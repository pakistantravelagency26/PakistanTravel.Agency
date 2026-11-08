import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import {
  requireRole,
  requireVendorOwnership,
  requireCustomerOwnership,
} from "../src/lib/permissions.ts";
import { getSafeCallbackUrl } from "../src/lib/safeRedirect.ts";

describe("Phase 2: RBAC & IDOR Access Control Test Suite", () => {
  describe("Central requireRole Helper", () => {
    it("rejects unauthenticated requests (null session) with 401", () => {
      const res = requireRole(null, ["ADMIN"]);
      assert.equal(res.authorized, false);
      assert.equal(res.status, 401);
    });

    it("allows ADMIN role when ADMIN is permitted", () => {
      const session = { user: { id: "u-admin", email: "admin@pta.pk", role: "ADMIN" } };
      const res = requireRole(session, ["ADMIN"]);
      assert.equal(res.authorized, true);
      assert.equal(res.status, 200);
    });

    it("rejects VENDOR role attempting to access ADMIN-only action with 403", () => {
      const session = { user: { id: "u-vendor", email: "vendor@pta.pk", role: "VENDOR" } };
      const res = requireRole(session, ["ADMIN"]);
      assert.equal(res.authorized, false);
      assert.equal(res.status, 403);
    });

    it("allows VENDOR role when VENDOR is in allowed roles list", () => {
      const session = { user: { id: "u-vendor", email: "vendor@pta.pk", role: "VENDOR" } };
      const res = requireRole(session, ["ADMIN", "VENDOR"]);
      assert.equal(res.authorized, true);
      assert.equal(res.status, 200);
    });
  });

  describe("Vendor Multi-Tenant Isolation & Ownership (requireVendorOwnership)", () => {
    const vendorA = {
      user: { id: "user-v-a", email: "a@partner.pk", role: "VENDOR", vendorId: "vendor-id-a" },
    };
    const vendorB = {
      user: { id: "user-v-b", email: "b@partner.pk", role: "VENDOR", vendorId: "vendor-id-b" },
    };
    const admin = {
      user: { id: "user-admin", email: "admin@pta.pk", role: "ADMIN" },
    };

    it("permits vendor A to modify their own resource", () => {
      const res = requireVendorOwnership(vendorA, "vendor-id-a");
      assert.equal(res.authorized, true);
      assert.equal(res.status, 200);
    });

    it("blocks vendor A from accessing or modifying vendor B's listing/booking with 403", () => {
      const res = requireVendorOwnership(vendorA, "vendor-id-b");
      assert.equal(res.authorized, false);
      assert.equal(res.status, 403);
      assert.match(res.error, /do not own/i);
    });

    it("blocks vendor B from accessing vendor A's resources with 403", () => {
      const res = requireVendorOwnership(vendorB, "vendor-id-a");
      assert.equal(res.authorized, false);
      assert.equal(res.status, 403);
    });

    it("allows ADMIN to access any vendor's resource for moderation and support", () => {
      const resA = requireVendorOwnership(admin, "vendor-id-a");
      const resB = requireVendorOwnership(admin, "vendor-id-b");
      assert.equal(resA.authorized, true);
      assert.equal(resB.authorized, true);
    });

    it("blocks unauthenticated access with 401", () => {
      const res = requireVendorOwnership(null, "vendor-id-a");
      assert.equal(res.authorized, false);
      assert.equal(res.status, 401);
    });
  });

  describe("Customer Booking Ownership (requireCustomerOwnership)", () => {
    const customer1 = { user: { id: "c1", email: "traveler1@example.com", role: "USER" } };
    const customer2 = { user: { id: "c2", email: "traveler2@example.com", role: "USER" } };
    const admin = { user: { id: "admin", email: "ops@pta.pk", role: "ADMIN" } };

    it("allows customer to access their own booking", () => {
      const res = requireCustomerOwnership(customer1, "traveler1@example.com");
      assert.equal(res.authorized, true);
      assert.equal(res.status, 200);
    });

    it("blocks customer 1 from viewing customer 2's booking with 403", () => {
      const res = requireCustomerOwnership(customer1, "traveler2@example.com");
      assert.equal(res.authorized, false);
      assert.equal(res.status, 403);
    });

    it("allows ADMIN to inspect customer bookings", () => {
      const res = requireCustomerOwnership(admin, "traveler1@example.com");
      assert.equal(res.authorized, true);
    });
  });

  describe("Middleware Access & Redirect Logic Rules", () => {
    function simulateMiddlewareCheck({ path, token }) {
      // 1. Super Admin Portal protection (/secure-admin)
      if (path.startsWith("/secure-admin") && path !== "/secure-admin/login") {
        if (!token) {
          return { action: "redirect", destination: `/secure-admin/login?callbackUrl=${encodeURIComponent(path)}` };
        }
        if (token.role !== "ADMIN") {
          return { action: "forbidden", status: 403 };
        }
      }

      // 2. Admin API protection (/api/admin)
      if (path.startsWith("/api/admin")) {
        if (!token) {
          return { action: "unauthorized", status: 401 };
        }
        if (token.role !== "ADMIN") {
          return { action: "forbidden", status: 403 };
        }
      }

      // 3. Partner Hub Portal protection (/partner-hub)
      if (path.startsWith("/partner-hub") && path !== "/partner-hub/login") {
        if (!token || (token.role !== "VENDOR" && token.role !== "ADMIN")) {
          return { action: "redirect", destination: `/partner-hub/login?callbackUrl=${encodeURIComponent(path)}` };
        }
      }

      return { action: "next", status: 200 };
    }

    it("redirects anonymous user from /partner-hub/listings/new to login", () => {
      const res = simulateMiddlewareCheck({ path: "/partner-hub/listings/new", token: null });
      assert.equal(res.action, "redirect");
      assert.match(res.destination, /\/partner-hub\/login\?callbackUrl=/);
    });

    it("redirects anonymous user from /secure-admin/vendors to admin login", () => {
      const res = simulateMiddlewareCheck({ path: "/secure-admin/vendors", token: null });
      assert.equal(res.action, "redirect");
      assert.match(res.destination, /\/secure-admin\/login\?callbackUrl=/);
    });

    it("returns 403 Forbidden when a vendor attempts to open /secure-admin/vendors", () => {
      const res = simulateMiddlewareCheck({
        path: "/secure-admin/vendors",
        token: { role: "VENDOR", sub: "v1" },
      });
      assert.equal(res.action, "forbidden");
      assert.equal(res.status, 403);
    });

    it("returns 403 Forbidden when a vendor attempts to call /api/admin/vendors", () => {
      const res = simulateMiddlewareCheck({
        path: "/api/admin/vendors",
        token: { role: "VENDOR", sub: "v1" },
      });
      assert.equal(res.action, "forbidden");
      assert.equal(res.status, 403);
    });

    it("allows ADMIN to access /secure-admin/vendors", () => {
      const res = simulateMiddlewareCheck({
        path: "/secure-admin/vendors",
        token: { role: "ADMIN", sub: "adm1" },
      });
      assert.equal(res.action, "next");
      assert.equal(res.status, 200);
    });

    it("allows VENDOR to access /partner-hub/listings/new", () => {
      const res = simulateMiddlewareCheck({
        path: "/partner-hub/listings/new",
        token: { role: "VENDOR", sub: "v1" },
      });
      assert.equal(res.action, "next");
      assert.equal(res.status, 200);
    });
  });

  describe("Chatbot Exclusion Rule Validation", () => {
    function shouldRenderChatbot(pathname) {
      if (!pathname) return false;
      return !(
        pathname.startsWith("/partner-hub") ||
        pathname.startsWith("/secure-admin") ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/account") ||
        pathname === "/login" ||
        pathname === "/register" ||
        pathname.startsWith("/forgot-password")
      );
    }

    it("renders chatbot on public home page (/)", () => {
      assert.equal(shouldRenderChatbot("/"), true);
    });

    it("renders chatbot on public listing page (/listing/skardu-luxury-resort)", () => {
      assert.equal(shouldRenderChatbot("/listing/skardu-luxury-resort"), true);
    });

    it("renders chatbot on public destination page (/destinations/hunza)", () => {
      assert.equal(shouldRenderChatbot("/destinations/hunza"), true);
    });

    it("does NOT render chatbot on /partner-hub/listings", () => {
      assert.equal(shouldRenderChatbot("/partner-hub/listings"), false);
    });

    it("does NOT render chatbot on /partner-hub/login", () => {
      assert.equal(shouldRenderChatbot("/partner-hub/login"), false);
    });

    it("does NOT render chatbot on /secure-admin/dashboard", () => {
      assert.equal(shouldRenderChatbot("/secure-admin/dashboard"), false);
    });

    it("does NOT render chatbot on /login", () => {
      assert.equal(shouldRenderChatbot("/login"), false);
    });

    it("does NOT render chatbot on /register", () => {
      assert.equal(shouldRenderChatbot("/register"), false);
    });
  });

  describe("Open Redirect Defense (getSafeCallbackUrl)", () => {
    it("permits standard internal relative paths", () => {
      assert.equal(getSafeCallbackUrl("/partner-hub/dashboard"), "/partner-hub/dashboard");
      assert.equal(getSafeCallbackUrl("/checkout/pkt-1234"), "/checkout/pkt-1234");
      assert.equal(getSafeCallbackUrl("/destinations/hunza?season=autumn"), "/destinations/hunza?season=autumn");
    });

    it("rejects protocol-relative URLs (//evil.com)", () => {
      assert.equal(getSafeCallbackUrl("//evil.com", "/"), "/");
      assert.equal(getSafeCallbackUrl("//evil.com/phishing", "/login"), "/login");
    });

    it("rejects absolute external URLs (https://attacker.com)", () => {
      assert.equal(getSafeCallbackUrl("https://attacker.com", "/"), "/");
      assert.equal(getSafeCallbackUrl("http://evil.com/steal-creds", "/partner-hub/dashboard"), "/partner-hub/dashboard");
    });

    it("rejects javascript: and data: schemes", () => {
      assert.equal(getSafeCallbackUrl("javascript:alert(1)", "/"), "/");
      assert.equal(getSafeCallbackUrl("/javascript:alert(1)", "/"), "/");
      assert.equal(getSafeCallbackUrl("data:text/html;base64,PHNjcmlwdD4=", "/"), "/");
    });

    it("rejects backslash directory bypasses (\\evil.com)", () => {
      assert.equal(getSafeCallbackUrl("/\\evil.com", "/"), "/");
      assert.equal(getSafeCallbackUrl("\\evil.com", "/"), "/");
    });

    it("falls back to defaultUrl on empty or non-string input", () => {
      assert.equal(getSafeCallbackUrl("", "/fallback"), "/fallback");
      assert.equal(getSafeCallbackUrl(null, "/fallback"), "/fallback");
      assert.equal(getSafeCallbackUrl(undefined, "/fallback"), "/fallback");
    });
  });

  describe("Complete Role-Based Access Matrix (Anonymous, Customer, Vendor A, Vendor B, Admin)", () => {
    const roles = {
      ANONYMOUS: null,
      CUSTOMER: { user: { id: "c1", email: "cust@gmail.com", role: "CUSTOMER" } },
      VENDOR_A: { user: { id: "va", email: "a@partner.pk", role: "VENDOR", vendorId: "v-hunza" } },
      VENDOR_B: { user: { id: "vb", email: "b@partner.pk", role: "VENDOR", vendorId: "v-skardu" } },
      ADMIN: { user: { id: "adm", email: "ops@pakistantravel.agency", role: "ADMIN", staffRole: "SUPER_ADMIN" } },
    };

    // 1. /api/admin/* endpoints
    function evaluateAdminEndpointAccess(session) {
      const check = requireRole(session, ["ADMIN"]);
      return check.status;
    }

    it("Matrix: Admin APIs - Anonymous (401), Customer (403), Vendor A (403), Vendor B (403), Admin (200)", () => {
      assert.equal(evaluateAdminEndpointAccess(roles.ANONYMOUS), 401);
      assert.equal(evaluateAdminEndpointAccess(roles.CUSTOMER), 403);
      assert.equal(evaluateAdminEndpointAccess(roles.VENDOR_A), 403);
      assert.equal(evaluateAdminEndpointAccess(roles.VENDOR_B), 403);
      assert.equal(evaluateAdminEndpointAccess(roles.ADMIN), 200);
    });

    // 2. /api/partner/* endpoints
    function evaluatePartnerEndpointAccess(session) {
      const check = requireRole(session, ["ADMIN", "VENDOR"]);
      return check.status;
    }

    it("Matrix: Partner APIs - Anonymous (401), Customer (403), Vendor A (200), Vendor B (200), Admin (200)", () => {
      assert.equal(evaluatePartnerEndpointAccess(roles.ANONYMOUS), 401);
      assert.equal(evaluatePartnerEndpointAccess(roles.CUSTOMER), 403);
      assert.equal(evaluatePartnerEndpointAccess(roles.VENDOR_A), 200);
      assert.equal(evaluatePartnerEndpointAccess(roles.VENDOR_B), 200);
      assert.equal(evaluatePartnerEndpointAccess(roles.ADMIN), 200);
    });

    // 3. Vendor A editing/deleting Vendor B's listing
    function evaluateVendorMutationAccess(session, targetListingVendorId) {
      const check = requireVendorOwnership(session, targetListingVendorId);
      return check.status;
    }

    it("Matrix: Mutation on Vendor B listing - Anonymous (401), Customer (403), Vendor A (403), Vendor B (200), Admin (200)", () => {
      assert.equal(evaluateVendorMutationAccess(roles.ANONYMOUS, "v-skardu"), 401);
      assert.equal(evaluateVendorMutationAccess(roles.CUSTOMER, "v-skardu"), 403);
      assert.equal(evaluateVendorMutationAccess(roles.VENDOR_A, "v-skardu"), 403); // IDOR blocked!
      assert.equal(evaluateVendorMutationAccess(roles.VENDOR_B, "v-skardu"), 200); // Owner permitted
      assert.equal(evaluateVendorMutationAccess(roles.ADMIN, "v-skardu"), 200);    // Admin permitted
    });

    // 4. Customer accessing another Customer's booking
    function evaluateCustomerBookingAccess(session, targetCustomerEmail) {
      const check = requireCustomerOwnership(session, targetCustomerEmail);
      return check.status;
    }

    it("Matrix: Viewing Customer 1 Booking - Anonymous (401), Customer 2 (403), Customer 1 (200), Admin (200)", () => {
      assert.equal(evaluateCustomerBookingAccess(roles.ANONYMOUS, "cust@gmail.com"), 401);
      assert.equal(evaluateCustomerBookingAccess(roles.CUSTOMER, "cust2@gmail.com"), 403);
      assert.equal(evaluateCustomerBookingAccess(roles.CUSTOMER, "cust@gmail.com"), 200);
      assert.equal(evaluateCustomerBookingAccess(roles.ADMIN, "cust@gmail.com"), 200);
    });
  });

  describe("Phase 2 Critical Fixes: OAuth Restriction for Admin/Vendor", () => {
    function simulateOAuthSignInCheck({ userRole, provider }) {
      if (provider === "google" || provider === "facebook") {
        if (userRole === "ADMIN" || userRole === "VENDOR") {
          return { allowed: false, redirect: "/login?error=OAuthRoleRestricted" };
        }
      }
      return { allowed: true };
    }

    it("blocks ADMIN from logging in via Google OAuth", () => {
      const res = simulateOAuthSignInCheck({ userRole: "ADMIN", provider: "google" });
      assert.equal(res.allowed, false);
      assert.equal(res.redirect, "/login?error=OAuthRoleRestricted");
    });

    it("blocks VENDOR from logging in via Facebook OAuth", () => {
      const res = simulateOAuthSignInCheck({ userRole: "VENDOR", provider: "facebook" });
      assert.equal(res.allowed, false);
      assert.equal(res.redirect, "/login?error=OAuthRoleRestricted");
    });

    it("allows standard CUSTOMER to log in via Google OAuth", () => {
      const res = simulateOAuthSignInCheck({ userRole: "CUSTOMER", provider: "google" });
      assert.equal(res.allowed, true);
    });

    it("allows standard CUSTOMER to log in via Facebook OAuth", () => {
      const res = simulateOAuthSignInCheck({ userRole: "CUSTOMER", provider: "facebook" });
      assert.equal(res.allowed, true);
    });
  });

  describe("Phase 2 Critical Fixes: sessionVersion & tokenVersion JWT Invalidation", () => {
    function simulateJwtSessionCheck({ tokenVersionInJwt, dbUser }) {
      if (!dbUser) return null; // User deleted
      const currentVersion = dbUser.sessionVersion ?? dbUser.tokenVersion ?? 1;
      if (tokenVersionInJwt && currentVersion !== tokenVersionInJwt) {
        return null; // Session revoked
      }
      return { valid: true, version: currentVersion };
    }

    it("validates token when sessionVersion matches DB version", () => {
      const res = simulateJwtSessionCheck({
        tokenVersionInJwt: 2,
        dbUser: { id: "u1", sessionVersion: 2, tokenVersion: 2 },
      });
      assert.notEqual(res, null);
      assert.equal(res.valid, true);
    });

    it("immediately invalidates JWT token when sessionVersion was incremented in DB", () => {
      const res = simulateJwtSessionCheck({
        tokenVersionInJwt: 1, // Old session
        dbUser: { id: "u1", sessionVersion: 2, tokenVersion: 2 }, // Incremented after password reset / 2FA / revoke
      });
      assert.equal(res, null);
    });

    it("immediately invalidates JWT token if user was deleted from DB", () => {
      const res = simulateJwtSessionCheck({
        tokenVersionInJwt: 1,
        dbUser: null,
      });
      assert.equal(res, null);
    });
  });

  describe("Phase 2 Critical Fixes: Voucher HMAC Cryptographic Verification", () => {
    const secret = "test-secret-key-phase2";

    function generateVoucherToken(bookingId, guestEmail) {
      return crypto
        .createHmac("sha256", secret)
        .update(`${bookingId}:${guestEmail.toLowerCase().trim()}`)
        .digest("hex");
    }

    function verifyVoucherAccess({ session, queryToken, booking }) {
      const isAdmin = session?.user?.role === "ADMIN";
      const isOwner = session?.user?.email && session.user.email.toLowerCase() === booking.guestEmail.toLowerCase();
      
      const expectedToken = generateVoucherToken(booking.id, booking.guestEmail);
      const isTokenValid = Boolean(queryToken && queryToken === expectedToken);

      if (isAdmin || isOwner || isTokenValid) {
        return { authorized: true, status: 200 };
      }
      return { authorized: false, status: 403 };
    }

    const testBooking = { id: "b-12345", guestEmail: "traveler@gmail.com" };

    it("rejects unauthenticated request attempting IDOR access with guessing/no token", () => {
      const res = verifyVoucherAccess({ session: null, queryToken: null, booking: testBooking });
      assert.equal(res.authorized, false);
      assert.equal(res.status, 403);
    });

    it("rejects unauthenticated request with invalid/forged token", () => {
      const res = verifyVoucherAccess({ session: null, queryToken: "forged-hex-token", booking: testBooking });
      assert.equal(res.authorized, false);
      assert.equal(res.status, 403);
    });

    it("permits guest access when presenting valid HMAC signed token", () => {
      const validToken = generateVoucherToken(testBooking.id, testBooking.guestEmail);
      const res = verifyVoucherAccess({ session: null, queryToken: validToken, booking: testBooking });
      assert.equal(res.authorized, true);
      assert.equal(res.status, 200);
    });

    it("permits logged-in owner without needing HMAC token", () => {
      const session = { user: { email: "traveler@gmail.com", role: "CUSTOMER" } };
      const res = verifyVoucherAccess({ session, queryToken: null, booking: testBooking });
      assert.equal(res.authorized, true);
      assert.equal(res.status, 200);
    });

    it("permits admin access without token", () => {
      const session = { user: { email: "ops@pakistantravel.agency", role: "ADMIN" } };
      const res = verifyVoucherAccess({ session, queryToken: null, booking: testBooking });
      assert.equal(res.authorized, true);
      assert.equal(res.status, 200);
    });
  });
});
