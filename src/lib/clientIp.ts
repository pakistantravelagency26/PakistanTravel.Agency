/**
 * PakistanTravel.Agency - Trusted Client IP Resolution Helper
 * 
 * Extracts the real client IP address from request headers.
 * Protects against X-Forwarded-For spoofing attacks by prioritizing
 * trusted edge gateway headers (Cloudflare CF-Connecting-IP, Vercel X-Vercel-Forwarded-For).
 */

export type HeaderSource = 
  | Headers 
  | Record<string, string | string[] | undefined> 
  | { get: (name: string) => string | null | undefined };

function getHeaderValue(headers: HeaderSource, name: string): string | null {
  if (!headers) return null;

  if (typeof (headers as any).get === "function") {
    const val = (headers as any).get(name);
    return typeof val === "string" ? val : null;
  }

  const record = headers as Record<string, string | string[] | undefined>;
  const lowerName = name.toLowerCase();

  for (const [key, val] of Object.entries(record)) {
    if (key.toLowerCase() === lowerName) {
      if (Array.isArray(val)) {
        return val[0] || null;
      }
      return typeof val === "string" ? val : null;
    }
  }

  return null;
}

/**
 * Extracts and sanitizes the trusted client IP.
 */
export function getTrustedClientIp(headers?: HeaderSource | null): string {
  if (!headers) return "127.0.0.1";

  // 1. Cloudflare edge header (highest priority, Cloudflare overwrites this with connecting IP)
  const cfIp = getHeaderValue(headers, "cf-connecting-ip");
  if (cfIp && isValidIp(cfIp.trim())) {
    return cfIp.trim();
  }

  // 2. Vercel edge header
  const vercelIp = getHeaderValue(headers, "x-vercel-forwarded-for");
  if (vercelIp) {
    const firstVercel = vercelIp.split(",")[0]?.trim();
    if (firstVercel && isValidIp(firstVercel)) {
      return firstVercel;
    }
  }

  // 3. Nginx / Standard reverse proxy real IP
  const realIp = getHeaderValue(headers, "x-real-ip");
  if (realIp && isValidIp(realIp.trim())) {
    return realIp.trim();
  }

  // 4. Fallback to X-Forwarded-For (take the first IP in the chain)
  const xForwardedFor = getHeaderValue(headers, "x-forwarded-for");
  if (xForwardedFor) {
    const firstXff = xForwardedFor.split(",")[0]?.trim();
    if (firstXff && isValidIp(firstXff)) {
      return firstXff;
    }
  }

  return "127.0.0.1";
}

function isValidIp(ip: string): boolean {
  if (!ip || ip.length > 45) return false;
  // IPv4 simple format check
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(ip)) {
    const parts = ip.split(".").map(Number);
    return parts.every((p) => p >= 0 && p <= 255);
  }
  // IPv6 simple format check
  const ipv6Regex = /^[0-9a-fA-F:]+$/;
  return ipv6Regex.test(ip) && ip.includes(":");
}
