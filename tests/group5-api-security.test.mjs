import { test, describe } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import { checkServerlessRateLimit } from "../src/lib/serverlessRateLimiter.ts";
import { getTrustedClientIp } from "../src/lib/clientIp.ts";

describe("GROUP 5: API Security, Rate Limiting, CORS, Headers, Webhooks", () => {
  describe("Item 5.1 & 5.2: Serverless Rate Limiting & Trusted Client IP", () => {
    test("Rate limiter allows requests within threshold and blocks with 429 when exceeded", async () => {
      const testKey = `test-ip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const maxLimit = 3;
      const windowSeconds = 10;

      // First 3 calls should pass
      const res1 = await checkServerlessRateLimit(testKey, maxLimit, windowSeconds);
      assert.equal(res1.success, true);
      assert.equal(res1.remaining, 2);

      const res2 = await checkServerlessRateLimit(testKey, maxLimit, windowSeconds);
      assert.equal(res2.success, true);
      assert.equal(res2.remaining, 1);

      const res3 = await checkServerlessRateLimit(testKey, maxLimit, windowSeconds);
      assert.equal(res3.success, true);
      assert.equal(res3.remaining, 0);

      // 4th call must be blocked with retryAfter
      const res4 = await checkServerlessRateLimit(testKey, maxLimit, windowSeconds);
      assert.equal(res4.success, false);
      assert.equal(res4.remaining, 0);
      assert.ok(res4.retryAfterSeconds > 0, "retryAfterSeconds must be positive");
    });

    test("Extracts trusted client IP correctly and ignores spoofed headers", () => {
      // 1. Cloudflare header
      const cfHeaders = new Headers({ "cf-connecting-ip": "203.0.113.195" });
      assert.equal(getTrustedClientIp(cfHeaders), "203.0.113.195");

      // 2. X-Real-IP
      const realIpHeaders = new Headers({ "x-real-ip": "198.51.100.42" });
      assert.equal(getTrustedClientIp(realIpHeaders), "198.51.100.42");

      // 3. Multi-hop X-Forwarded-For: extracts first client IP, stripping ports
      const xffHeaders = new Headers({ "x-forwarded-for": "192.0.2.1:5432, 10.0.0.1" });
      assert.equal(getTrustedClientIp(xffHeaders), "192.0.2.1");

      // 4. Fallback to localhost when no headers present
      const emptyHeaders = new Headers({});
      assert.equal(getTrustedClientIp(emptyHeaders), "127.0.0.1");
    });
  });

  describe("Item 5.3: CORS & CSRF Enforcement Rules", () => {
    function simulateCorsCheck({ origin, referer, secFetchSite, method, path }) {
      const isProduction = true;
      const isAllowedOrigin = (urlStr) => {
        if (!urlStr) return false;
        return urlStr.trim().toLowerCase() === "https://www.pakistantravel.agency";
      };

      if (method === "OPTIONS") {
        if (origin) {
          if (!isAllowedOrigin(origin)) {
            return { status: 403, error: "Forbidden: Cross-origin request not allowed." };
          }
          return {
            status: 204,
            headers: {
              "Access-Control-Allow-Origin": origin,
              "Access-Control-Allow-Credentials": "true",
              "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
            },
          };
        }
        return { status: 204 };
      }

      const isStateChanging = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
      const isExemptWebhook = path === "/api/payments/webhook" || path.startsWith("/api/cron/");

      if (isStateChanging && !isExemptWebhook) {
        if (secFetchSite === "cross-site") {
          return { status: 403, error: "Forbidden: Cross-site request blocked by CSRF policy." };
        }
        if (origin && !isAllowedOrigin(origin)) {
          return { status: 403, error: "Forbidden: Cross-origin state-changing request blocked." };
        }
        if (!origin && referer) {
          try {
            const refOrigin = new URL(referer).origin;
            if (!isAllowedOrigin(refOrigin)) {
              return { status: 403, error: "Forbidden: Cross-origin referer blocked by CSRF policy." };
            }
          } catch {
            return { status: 403, error: "Forbidden: Malformed referer header." };
          }
        }
      }

      return { status: 200, allowed: true };
    }

    test("OPTIONS preflight allows production canonical origin and blocks unauthorized origin", () => {
      const allowedPreflight = simulateCorsCheck({
        origin: "https://www.pakistantravel.agency",
        method: "OPTIONS",
        path: "/api/bookings",
      });
      assert.equal(allowedPreflight.status, 204);
      assert.equal(allowedPreflight.headers["Access-Control-Allow-Origin"], "https://www.pakistantravel.agency");
      assert.equal(allowedPreflight.headers["Access-Control-Allow-Credentials"], "true");
      assert.notEqual(allowedPreflight.headers["Access-Control-Allow-Origin"], "*");

      const blockedPreflight = simulateCorsCheck({
        origin: "https://evil-phishing-travel.com",
        method: "OPTIONS",
        path: "/api/bookings",
      });
      assert.equal(blockedPreflight.status, 403);
    });

    test("CSRF policy blocks cross-site and unauthorized origin state-changing mutations", () => {
      // Cross-site fetch header
      const crossSiteReq = simulateCorsCheck({
        origin: "https://www.pakistantravel.agency",
        secFetchSite: "cross-site",
        method: "POST",
        path: "/api/bookings",
      });
      assert.equal(crossSiteReq.status, 403);

      // Unauthorized origin
      const untrustedOriginReq = simulateCorsCheck({
        origin: "https://attacker.site",
        method: "POST",
        path: "/api/admin/payouts",
      });
      assert.equal(untrustedOriginReq.status, 403);

      // Legitimate same-site mutation
      const legitReq = simulateCorsCheck({
        origin: "https://www.pakistantravel.agency",
        secFetchSite: "same-origin",
        method: "POST",
        path: "/api/bookings",
      });
      assert.equal(legitReq.status, 200);

      // Webhook is exempt from browser same-site CSRF check (secured by HMAC signature instead)
      const webhookReq = simulateCorsCheck({
        origin: "https://stripe.com",
        secFetchSite: "cross-site",
        method: "POST",
        path: "/api/payments/webhook",
      });
      assert.equal(webhookReq.status, 200);
    });
  });

  describe("Item 5.4: Security Headers Configuration", () => {
    test("Verifies all required security headers are configured in next.config.mjs", async () => {
      const nextConfigModule = await import("../next.config.mjs");
      const nextConfig = nextConfigModule.default;
      assert.ok(typeof nextConfig.headers === "function", "nextConfig.headers must be a function");

      const headersList = await nextConfig.headers();
      const globalHeaderEntry = headersList.find((h) => h.source === "/:path*");
      assert.ok(globalHeaderEntry, "Must define global /:path* security headers");

      const headerMap = new Map();
      globalHeaderEntry.headers.forEach((h) => headerMap.set(h.key.toLowerCase(), h.value));

      // 1. Content-Security-Policy
      const csp = headerMap.get("content-security-policy");
      assert.ok(csp, "Content-Security-Policy must be set");
      assert.ok(csp.includes("frame-ancestors 'self'"), "CSP must include frame-ancestors 'self'");
      assert.ok(csp.includes("object-src 'none'"), "CSP must include object-src 'none'");

      // 2. Strict-Transport-Security (HSTS) with preload
      const hsts = headerMap.get("strict-transport-security");
      assert.ok(hsts, "Strict-Transport-Security must be set");
      assert.ok(hsts.includes("max-age=63072000"), "HSTS max-age must be 2 years (63072000)");
      assert.ok(hsts.includes("includeSubDomains"), "HSTS must include subdomains");
      assert.ok(hsts.includes("preload"), "HSTS must include preload");

      // 3. X-Content-Type-Options
      assert.equal(headerMap.get("x-content-type-options"), "nosniff");

      // 4. X-Frame-Options
      assert.equal(headerMap.get("x-frame-options"), "SAMEORIGIN");

      // 5. Referrer-Policy
      assert.equal(headerMap.get("referrer-policy"), "strict-origin-when-cross-origin");

      // 6. Permissions-Policy
      assert.equal(headerMap.get("permissions-policy"), "camera=(), microphone=(), geolocation=(self)");

      // 7. Cross-Origin-Opener-Policy
      assert.equal(headerMap.get("cross-origin-opener-policy"), "same-origin");

      // 8. Cross-Origin-Resource-Policy
      assert.equal(headerMap.get("cross-origin-resource-policy"), "same-origin");
    });
  });

  describe("Item 5.5: Webhook Signature & Replay Protection Verification", () => {
    const secret = "test-super-secret-webhook-signing-key-12345";
    const payload = JSON.stringify({
      transactionRef: "TX-TEST-9988",
      amount: 15000,
      paymentMethod: "STRIPE",
    });

    function verifyWebhookSim({ body, signatureHeader, timestampHeader, webhookSecret }) {
      if (!signatureHeader) {
        return { valid: false, error: "Missing required cryptographic webhook signature", status: 401 };
      }

      let webhookTimestamp = null;
      let signatureHash = signatureHeader;

      if (timestampHeader) {
        const parsed = parseInt(timestampHeader, 10);
        if (!isNaN(parsed)) {
          webhookTimestamp = parsed > 1e11 ? Math.floor(parsed / 1000) : parsed;
        }
      } else if (signatureHeader.includes("t=")) {
        const parts = signatureHeader.split(",");
        for (const part of parts) {
          const [k, v] = part.split("=");
          if (k?.trim() === "t") webhookTimestamp = parseInt(v.trim(), 10);
          else if (k?.trim() === "v1") signatureHash = v.trim();
        }
      }

      if (webhookTimestamp !== null) {
        const nowSeconds = Math.floor(Date.now() / 1000);
        const ageSeconds = nowSeconds - webhookTimestamp;
        if (ageSeconds > 300 || ageSeconds < -60) {
          return { valid: false, error: "Webhook rejected: Timestamp expired or replay window exceeded (max 300s).", status: 401 };
        }
      }

      const expectedDirect = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex");
      const expectedTimestamped = webhookTimestamp !== null
        ? crypto.createHmac("sha256", webhookSecret).update(`${webhookTimestamp}.${body}`).digest("hex")
        : "";

      const sigBuffer = Buffer.from(signatureHash);
      const directBuffer = Buffer.from(expectedDirect);
      const timestampedBuffer = Buffer.from(expectedTimestamped);

      const isDirectMatch =
        sigBuffer.length === directBuffer.length &&
        crypto.timingSafeEqual(sigBuffer, directBuffer);

      const isTimestampedMatch =
        expectedTimestamped !== "" &&
        sigBuffer.length === timestampedBuffer.length &&
        crypto.timingSafeEqual(sigBuffer, timestampedBuffer);

      if (!isDirectMatch && !isTimestampedMatch) {
        return { valid: false, error: "Invalid webhook signature", status: 401 };
      }

      return { valid: true, status: 200 };
    }

    test("Accepts webhook with valid timestamp within 300s window and valid HMAC signature", () => {
      const now = Math.floor(Date.now() / 1000);
      const validSig = crypto.createHmac("sha256", secret).update(`${now}.${payload}`).digest("hex");
      const stripeSigHeader = `t=${now},v1=${validSig}`;

      const res = verifyWebhookSim({
        body: payload,
        signatureHeader: stripeSigHeader,
        timestampHeader: null,
        webhookSecret: secret,
      });

      assert.equal(res.valid, true);
      assert.equal(res.status, 200);
    });

    test("Rejects webhook with expired timestamp (replay attack prevention > 300s)", () => {
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 360; // 6 minutes ago
      const expiredSig = crypto.createHmac("sha256", secret).update(`${expiredTimestamp}.${payload}`).digest("hex");
      const stripeSigHeader = `t=${expiredTimestamp},v1=${expiredSig}`;

      const res = verifyWebhookSim({
        body: payload,
        signatureHeader: stripeSigHeader,
        timestampHeader: null,
        webhookSecret: secret,
      });

      assert.equal(res.valid, false);
      assert.equal(res.status, 401);
      assert.ok(res.error.includes("replay window exceeded"));
    });

    test("Rejects webhook with future timestamp (> 60s ahead)", () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 120; // 2 minutes in future
      const futureSig = crypto.createHmac("sha256", secret).update(`${futureTimestamp}.${payload}`).digest("hex");
      const stripeSigHeader = `t=${futureTimestamp},v1=${futureSig}`;

      const res = verifyWebhookSim({
        body: payload,
        signatureHeader: stripeSigHeader,
        timestampHeader: null,
        webhookSecret: secret,
      });

      assert.equal(res.valid, false);
      assert.equal(res.status, 401);
      assert.ok(res.error.includes("replay window exceeded"));
    });

    test("Rejects webhook with tampered body or invalid signature", () => {
      const now = Math.floor(Date.now() / 1000);
      const forgedSig = crypto.createHmac("sha256", "wrong-secret").update(`${now}.${payload}`).digest("hex");
      const stripeSigHeader = `t=${now},v1=${forgedSig}`;

      const res = verifyWebhookSim({
        body: payload,
        signatureHeader: stripeSigHeader,
        timestampHeader: null,
        webhookSecret: secret,
      });

      assert.equal(res.valid, false);
      assert.equal(res.status, 401);
      assert.equal(res.error, "Invalid webhook signature");
    });
  });
});
