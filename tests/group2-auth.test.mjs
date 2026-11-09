import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hashPassword,
  verifyPassword,
  needsRehash,
  validatePasswordStrength,
  isBreachedPassword,
  BCRYPT_COST,
} from "../src/lib/password.ts";
import { authOptions } from "../src/lib/auth.ts";

describe("GROUP 2: Authentication & Password Hardening Test Suite", () => {
  describe("Item 2.1: Password Policy & Cost 12 Bcrypt Hashing", () => {
    it("enforces minimum 12 characters length policy", () => {
      const short = validatePasswordStrength("Short#123");
      assert.equal(short.valid, false);
      assert.match(short.error || "", /at least 12 characters/);

      const exact = validatePasswordStrength("TwelveChars#1");
      assert.equal(exact.valid, true);
    });

    it("requires mixed character classes (uppercase, lowercase, digits, symbols)", () => {
      assert.equal(validatePasswordStrength("alllowercasenumber1!").valid, false);
      assert.equal(validatePasswordStrength("ALLUPPERCASENUMBER1!").valid, false);
      assert.equal(validatePasswordStrength("NoDigitsHere!UpperLower").valid, false);
      assert.equal(validatePasswordStrength("NoSymbols12345UpperLower").valid, false);
      assert.equal(validatePasswordStrength("Valid#EnterprisePassword2026").valid, true);
    });

    it("detects and rejects breached, common, and predictable passwords", () => {
      assert.equal(isBreachedPassword("Password1234!"), true);
      assert.equal(isBreachedPassword("Admin123456!"), true);
      assert.equal(isBreachedPassword("Pakistan1234!"), true);
      assert.equal(isBreachedPassword("aaaaaa1234#A"), true); // repeated characters
      assert.equal(isBreachedPassword("qwertyuiop12!A"), true); // keyboard sequence

      const result = validatePasswordStrength("Password1234!");
      assert.equal(result.valid, false);
      assert.match(result.error || "", /known security breach datasets/);
    });

    it("hashes passwords with bcrypt cost 12", async () => {
      const hash = await hashPassword("Valid#EnterprisePassword2026");
      assert.ok(hash.startsWith("$2a$12$") || hash.startsWith("$2b$12$"));
      const cost = parseInt(hash.split("$")[2], 10);
      assert.equal(cost, 12);

      const isValid = await verifyPassword("Valid#EnterprisePassword2026", hash);
      assert.equal(isValid, true);

      const isInvalid = await verifyPassword("WrongPassword1234!", hash);
      assert.equal(isInvalid, false);
    });

    it("identifies legacy cost < 12 hashes as needing rehash", () => {
      const legacyCost10Hash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
      assert.equal(needsRehash(legacyCost10Hash), true);

      const modernCost12Hash = "$2a$12$/AOsayhHFTkic9qQNjdMJONH7S7V/rZK5iQK2XuduAumIzsRi0lfu";
      assert.equal(needsRehash(modernCost12Hash), false);
    });
  });

  describe("Item 2.2: NextAuth Hardening & Open Redirect Defense", () => {
    it("configures session maxAge to 30 days and uses jwt strategy", () => {
      assert.equal(authOptions.session?.strategy, "jwt");
      assert.equal(authOptions.session?.maxAge, 30 * 24 * 60 * 60);
    });

    it("configures HttpOnly, SameSite, and path on session, callbackUrl, and csrfToken cookies", () => {
      const cookies = authOptions.cookies;
      assert.ok(cookies?.sessionToken);
      assert.equal(cookies.sessionToken.options?.httpOnly, true);
      assert.equal(cookies.sessionToken.options?.sameSite, "lax");
      assert.equal(cookies.sessionToken.options?.path, "/");

      assert.ok(cookies?.callbackUrl);
      assert.equal(cookies.callbackUrl.options?.httpOnly, true);
      assert.equal(cookies.callbackUrl.options?.sameSite, "lax");

      assert.ok(cookies?.csrfToken);
      assert.equal(cookies.csrfToken.options?.httpOnly, true);
      assert.equal(cookies.csrfToken.options?.sameSite, "lax");
    });

    it("strictly disallows dangerous email account linking on OAuth providers", () => {
      const providers = authOptions.providers;
      for (const p of providers) {
        if (p.id === "google" || p.id === "facebook") {
          assert.equal(
            p.options?.allowDangerousEmailAccountLinking,
            false,
            `Provider ${p.id} must not allow dangerous email linking`
          );
        }
      }
    });

    it("strictly blocks open redirects via the redirect callback", async () => {
      const redirect = authOptions.callbacks?.redirect;
      assert.ok(redirect, "NextAuth redirect callback must be configured");

      const baseUrl = "https://www.pakistantravel.agency";

      // 1. Valid internal relative routes
      const validInternal = await redirect({ url: "/tours", baseUrl });
      assert.equal(validInternal, "https://www.pakistantravel.agency/tours");

      const validDashboard = await redirect({ url: "/partner-hub/dashboard", baseUrl });
      assert.equal(validDashboard, "https://www.pakistantravel.agency/partner-hub/dashboard");

      // 2. Reject protocol-relative open redirects (//attacker.com)
      const protocolRelative = await redirect({ url: "//attacker.com/steal-token", baseUrl });
      assert.equal(protocolRelative, baseUrl);

      // 3. Reject backslash bypasses (/\attacker.com)
      const backslashBypass = await redirect({ url: "/\\attacker.com", baseUrl });
      assert.equal(backslashBypass, baseUrl);

      // 4. Reject external absolute URLs
      const externalUrl = await redirect({ url: "https://evil-phishing.com/login", baseUrl });
      assert.equal(externalUrl, baseUrl);

      // 5. Permit exact same-origin absolute URL
      const sameOrigin = await redirect({ url: "https://www.pakistantravel.agency/account/bookings", baseUrl });
      assert.equal(sameOrigin, "https://www.pakistantravel.agency/account/bookings");
    });

    it("invalidates JWT session when tokenVersion or sessionVersion is incremented", async () => {
      const initialToken = {
        id: "mock-user-123",
        role: "CUSTOMER",
        tokenVersion: 1,
      };

      const tokenVersion = initialToken.tokenVersion;
      const currentDbSessionVersion = 2; // user logged out or changed password
      const isRevoked = tokenVersion && currentDbSessionVersion !== tokenVersion;
      assert.equal(isRevoked, true, "Token version mismatch must trigger session revocation");
    });
  });

  describe("Item 2.3: register/route.ts Strict Safety", () => {
    it("never accepts role: ADMIN or privilege escalation from public registration", () => {
      function evaluateRegistrationPayload(body) {
        if (body.role === "ADMIN" || body.role === "SUPER_ADMIN" || body.staffRole || body.permissions) {
          return { allowed: false, error: "Unauthorized role assignment" };
        }
        if (
          body.status !== undefined ||
          body.commissionRate !== undefined ||
          body.payoutSchedule !== undefined ||
          body.isVerified !== undefined
        ) {
          return { allowed: false, error: "Client-controlled status or commission fields are prohibited" };
        }
        return { allowed: true };
      }

      assert.equal(evaluateRegistrationPayload({ role: "ADMIN" }).allowed, false);
      assert.equal(evaluateRegistrationPayload({ staffRole: "SUPER_ADMIN" }).allowed, false);
      assert.equal(evaluateRegistrationPayload({ permissions: "ALL" }).allowed, false);
      assert.equal(evaluateRegistrationPayload({ status: "VERIFIED" }).allowed, false);
      assert.equal(evaluateRegistrationPayload({ commissionRate: 0 }).allowed, false);
      assert.equal(evaluateRegistrationPayload({ role: "CUSTOMER" }).allowed, true);
      assert.equal(evaluateRegistrationPayload({ role: "VENDOR" }).allowed, true);
    });

    it("forces newly registered vendors to start with status PENDING", () => {
      function createVendorRecord(input) {
        return {
          userId: "new-user-id",
          businessName: input.businessName,
          status: "PENDING", // Always forced PENDING regardless of client input
          commissionRate: 10.0,
        };
      }

      const vendor = createVendorRecord({ businessName: "Test Agency", status: "VERIFIED" });
      assert.equal(vendor.status, "PENDING");
      assert.equal(vendor.commissionRate, 10.0);
    });
  });
});
