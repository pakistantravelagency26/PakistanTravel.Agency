/**
 * Neon Integration Services
 * Wires Lakebase Postgres, Neon Functions, Neon Auth, and Neon Realtime into PakistanTravel.agency
 */

import { prisma } from "@/lib/prisma";

export const neonConfig = {
  branch: process.env.NEON_BRANCH || "production",
  databaseUrl:
    process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("db.prisma.io")
      ? process.env.DATABASE_URL
      : "",
  databaseUrlUnpooled:
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.DATABASE_URL ||
    "",
  authBaseUrl: process.env.NEON_AUTH_BASE_URL,
  authJwksUrl: process.env.NEON_AUTH_JWKS_URL,
  functionHelloBaseUrl: process.env.NEON_FUNCTION_HELLO_BASE_URL,
  realtimeUrl: process.env.NEON_REALTIME_URL,
  realtimeSecret: process.env.NEON_REALTIME_SECRET,
};

/**
 * Neon Functions Invoker
 * Calls serverless long-running functions running next to Lakebase Postgres
 */
export async function invokeNeonFunction(functionName: "hello", path = "", init?: RequestInit) {
  const baseUrl = neonConfig.functionHelloBaseUrl;
  if (!baseUrl) {
    throw new Error(`Neon Function '${functionName}' base URL is not configured in environment.`);
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const targetUrl = `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(targetUrl, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Neon Function '${functionName}' error (${res.status}): ${errorText}`);
  }

  return res;
}

/**
 * Neon Realtime Helper
 * Signs and seals live queries using NEON_REALTIME_SECRET
 */
export async function sealRealtimeQuery(queryPayload: { query: string; params?: any[] }) {
  if (!neonConfig.realtimeSecret) {
    throw new Error("NEON_REALTIME_SECRET is not configured.");
  }

  // Use HMAC SHA-256 for query sealing
  const crypto = await import("crypto");
  const payloadString = JSON.stringify(queryPayload);
  const signature = crypto
    .createHmac("sha256", neonConfig.realtimeSecret)
    .update(payloadString)
    .digest("hex");

  return {
    realtimeUrl: neonConfig.realtimeUrl,
    payload: queryPayload,
    signature,
    timestamp: Date.now(),
  };
}

/**
 * Neon Auth Discovery & Health Check
 * Verifies Neon Managed Auth JWKS and OpenID configuration
 */
export async function checkNeonAuth() {
  if (!neonConfig.authJwksUrl && !neonConfig.authBaseUrl) {
    return { configured: false, status: "Neon Auth URLs not configured" };
  }

  try {
    const jwksUrl = neonConfig.authJwksUrl || `${neonConfig.authBaseUrl}/.well-known/jwks.json`;
    const res = await fetch(jwksUrl, { cache: "no-store" });
    return {
      configured: true,
      jwksUrl,
      status: res.ok ? "healthy" : `status ${res.status}`,
      statusCode: res.status,
    };
  } catch (err: any) {
    return {
      configured: true,
      status: "error",
      message: err.message,
    };
  }
}

/**
 * Neon Diagnostics & End-to-End Status
 */
export async function checkNeonHealth() {
  const results: Record<string, any> = {
    branch: neonConfig.branch || "unknown",
  };

  // 1. Lakebase Postgres
  try {
    const userCount = await prisma.user.count();
    const destinationCount = await prisma.destination.count();
    const listingCount = await prisma.listing.count();
    results.postgres = {
      status: "healthy",
      connected: true,
      stats: { users: userCount, destinations: destinationCount, listings: listingCount },
    };
  } catch (err: any) {
    results.postgres = { status: "error", message: err.message };
  }

  // 2. Neon Functions
  try {
    const fnRes = await invokeNeonFunction("hello");
    const fnText = await fnRes.text();
    results.functions = {
      status: "healthy",
      hello: fnText.trim(),
      url: neonConfig.functionHelloBaseUrl,
    };
  } catch (err: any) {
    results.functions = { status: "error", message: err.message };
  }

  // 3. Neon Auth
  results.auth = await checkNeonAuth();

  // 4. Neon Realtime
  results.realtime = {
    configured: !!neonConfig.realtimeUrl && !!neonConfig.realtimeSecret,
    url: neonConfig.realtimeUrl,
    hasSecret: !!neonConfig.realtimeSecret,
  };

  return results;
}
