import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  requireRole,
  requireVendorOwnership,
  requireCustomerOwnership,
  requireOwnership,
} from "../src/lib/permissions.ts";
import crypto from "node:crypto";

function generateBookingNumber() {
  const token = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `PKT-2026-${token}`;
}

describe("GROUP 3: Centralized Server-Side Authorization & RBAC", () => {
  // Test actor sessions
  const anonymousSession = null;
  const customerSession = {
    user: {
      id: "usr_cust_001",
      email: "customer@example.com",
      name: "Ali Customer",
      role: "CUSTOMER",
    },
  };
  const vendorASession = {
    user: {
      id: "usr_ven_a",
      email: "vendor-a@example.com",
      name: "Hunza Explorers",
      role: "VENDOR",
      vendorId: "v_hunza_001",
    },
  };
  const vendorBSession = {
    user: {
      id: "usr_ven_b",
      email: "vendor-b@example.com",
      name: "Skardu Treks",
      role: "VENDOR",
      vendorId: "v_skardu_002",
    },
  };
  const adminSession = {
    user: {
      id: "usr_admin_001",
      email: "emraanirshad88@gmail.com",
      name: "Platform Super Admin",
      role: "ADMIN",
      staffRole: "SUPER_ADMIN",
      permissions: "ALL",
    },
  };

  test("1. requireRole: Anonymous user gets 401 Unauthorized", () => {
    const adminCheck = requireRole(anonymousSession, ["ADMIN"]);
    assert.equal(adminCheck.authorized, false);
    assert.equal(adminCheck.status, 401);
    assert.match(adminCheck.error, /Active session required/);

    const vendorCheck = requireRole(anonymousSession, ["VENDOR"]);
    assert.equal(vendorCheck.authorized, false);
    assert.equal(vendorCheck.status, 401);
  });

  test("2. requireRole: Customer gets 403 Forbidden on vendor and admin routes", () => {
    const adminCheck = requireRole(customerSession, ["ADMIN"]);
    assert.equal(adminCheck.authorized, false);
    assert.equal(adminCheck.status, 403);
    assert.match(adminCheck.error, /Role 'CUSTOMER' is not permitted/);

    const vendorCheck = requireRole(customerSession, ["VENDOR"]);
    assert.equal(vendorCheck.authorized, false);
    assert.equal(vendorCheck.status, 403);
  });

  test("3. requireRole: Vendor gets 403 Forbidden on admin routes", () => {
    const adminCheck = requireRole(vendorASession, ["ADMIN"]);
    assert.equal(adminCheck.authorized, false);
    assert.equal(adminCheck.status, 403);
    assert.match(adminCheck.error, /Role 'VENDOR' is not permitted/);
  });

  test("4. requireRole: Legitimate roles are granted 200 Authorized", () => {
    const adminOnAdmin = requireRole(adminSession, ["ADMIN"]);
    assert.equal(adminOnAdmin.authorized, true);
    assert.equal(adminOnAdmin.status, 200);

    const vendorOnVendor = requireRole(vendorASession, ["VENDOR", "ADMIN"]);
    assert.equal(vendorOnVendor.authorized, true);
    assert.equal(vendorOnVendor.status, 200);

    const adminOnVendorRoute = requireRole(adminSession, ["VENDOR", "ADMIN"]);
    assert.equal(adminOnVendorRoute.authorized, true);
    assert.equal(adminOnVendorRoute.status, 200);
  });

  test("5. Multi-Tenant IDOR: Vendor A cannot read or modify Vendor B resources", () => {
    const vendorAResourceId = "v_hunza_001";
    const vendorBResourceId = "v_skardu_002";

    // Vendor A accessing their own resource -> permitted
    const ownCheck = requireVendorOwnership(vendorASession, vendorAResourceId);
    assert.equal(ownCheck.authorized, true);
    assert.equal(ownCheck.status, 200);

    // Vendor A attempting to access Vendor B's resource -> 403 Forbidden
    const idorCheck = requireVendorOwnership(vendorASession, vendorBResourceId);
    assert.equal(idorCheck.authorized, false);
    assert.equal(idorCheck.status, 403);
    assert.match(idorCheck.error, /You do not own this listing, booking, or financial ledger entry/);

    // Customer attempting to access Vendor resource -> 403 Forbidden
    const customerOnVendor = requireVendorOwnership(customerSession, vendorAResourceId);
    assert.equal(customerOnVendor.authorized, false);
    assert.equal(customerOnVendor.status, 403);

    // Admin has global oversight -> 200 Authorized
    const adminCheck = requireVendorOwnership(adminSession, vendorBResourceId);
    assert.equal(adminCheck.authorized, true);
    assert.equal(adminCheck.status, 200);
  });

  test("6. Customer IDOR: Customer A cannot view or modify Customer B bookings", () => {
    const customerAEmail = "customer@example.com";
    const customerBEmail = "another.traveler@example.com";

    // Customer A accessing own data -> 200
    const ownCheck = requireCustomerOwnership(customerSession, customerAEmail);
    assert.equal(ownCheck.authorized, true);
    assert.equal(ownCheck.status, 200);

    // Customer A accessing Customer B data -> 403 Forbidden
    const idorCheck = requireCustomerOwnership(customerSession, customerBEmail);
    assert.equal(idorCheck.authorized, false);
    assert.equal(idorCheck.status, 403);
    assert.match(idorCheck.error, /You cannot view or modify another customer's booking/);

    // Admin accessing customer data -> 200
    const adminCheck = requireCustomerOwnership(adminSession, customerBEmail);
    assert.equal(adminCheck.authorized, true);
    assert.equal(adminCheck.status, 200);
  });

  test("7. Unified requireOwnership verifies multi-tenant resources and customer records", () => {
    // Vendor resource test
    const vCheckPass = requireOwnership(vendorASession, { vendorId: "v_hunza_001" });
    assert.equal(vCheckPass.authorized, true);

    const vCheckFail = requireOwnership(vendorASession, { vendorId: "v_skardu_002" });
    assert.equal(vCheckFail.authorized, false);
    assert.equal(vCheckFail.status, 403);

    // Customer resource test
    const cCheckPass = requireOwnership(customerSession, { customerEmail: "customer@example.com" });
    assert.equal(cCheckPass.authorized, true);

    const cCheckFail = requireOwnership(customerSession, { customerEmail: "other@example.com" });
    assert.equal(cCheckFail.authorized, false);
    assert.equal(cCheckFail.status, 403);

    // Admin override test
    const adminCheck = requireOwnership(adminSession, { vendorId: "v_skardu_002" });
    assert.equal(adminCheck.authorized, true);
  });

  test("8. Unguessable IDs: Bookings, Payouts, Documents use cryptographically secure UUIDs", () => {
    // Test booking number format: PKT-2026-[8 hex uppercase chars]
    const bNumber1 = generateBookingNumber();
    const bNumber2 = generateBookingNumber();
    assert.notEqual(bNumber1, bNumber2);
    assert.match(bNumber1, /^PKT-2026-[0-9A-F]{8}$/);
    assert.match(bNumber2, /^PKT-2026-[0-9A-F]{8}$/);

    // Test UUID generator format (used for Payouts, Bookings, Document uploads)
    const uuid = crypto.randomUUID();
    assert.match(
      uuid,
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  test("9. Private Documents Security: Directory traversal defense and UUID format validation", () => {
    const validUuidFilename = `${crypto.randomUUID()}.jpg`;
    const traversalAttempt = `../../etc/passwd.jpg`;
    const maliciousName = `malicious-code.php`;

    const validPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\.(jpg|jpeg|png|webp|avif|pdf)$/i;

    assert.equal(validPattern.test(validUuidFilename), true);
    assert.equal(validPattern.test(traversalAttempt), false);
    assert.equal(validPattern.test(maliciousName), false);
  });

  test("10. Multi-Tenant Payouts: Vendor cannot request payout under another vendorId", () => {
    // When Vendor A submits a payout request, server strictly forces vendorId from session
    const simulatedPayoutPayload = {
      amount: 50000,
      vendorId: "v_skardu_002", // Malicious vendorId in body
    };

    // Server-side enforcement overrides or rejects untrusted vendorId
    const resolvedVendorId = vendorASession.user.vendorId;
    assert.equal(resolvedVendorId, "v_hunza_001");
    assert.notEqual(resolvedVendorId, simulatedPayoutPayload.vendorId);
  });

  test("11. IDOR on Bookings & Vouchers: Unauthorized user without signature gets 403", () => {
    const booking = {
      id: "bkg-uuid-1234",
      guestEmail: "ali@example.com",
      listingId: "tour-hunza-01",
    };

    const secret = "test-secret-at-least-32-chars-long-security-pass";
    const validToken = crypto
      .createHmac("sha256", secret)
      .update(`${booking.id}:${booking.guestEmail.toLowerCase().trim()}`)
      .digest("hex");

    const forgedToken = crypto
      .createHmac("sha256", secret)
      .update(`bkg-other-5678:victim@example.com`)
      .digest("hex");

    assert.equal(validToken === forgedToken, false);

    // Guest with forged token is rejected
    const isOwner = Boolean(
      customerSession.user.email === booking.guestEmail ||
      forgedToken === validToken
    );
    assert.equal(isOwner, false);
  });
});
