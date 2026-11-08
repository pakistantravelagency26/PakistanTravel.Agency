import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  requireRole,
  requireVendorOwnership,
  requireCustomerOwnership,
} from "../src/lib/permissions.ts";

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
});
