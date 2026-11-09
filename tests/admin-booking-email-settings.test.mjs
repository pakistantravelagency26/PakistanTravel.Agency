import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { prisma } from "../src/lib/prisma.ts";
import {
  getBookingEmailSettings,
  getMaskedBookingEmailSettings,
  saveBookingEmailSettings,
  EMAIL_SETTINGS_KEY,
} from "../src/services/emailSettings.service.ts";
import {
  sendBookingConfirmationEmails,
  processPendingEmailOutbox,
} from "../src/services/email.service.ts";
import { requireRole } from "../src/lib/permissions.ts";

describe("Admin Booking Email Settings & Dispatch Verification", () => {
  let originalSetting;
  const timestamp = Date.now();

  before(async () => {
    // Backup existing site setting if any
    originalSetting = await prisma.siteSetting.findUnique({
      where: { key: EMAIL_SETTINGS_KEY },
    });
  });

  after(async () => {
    // Restore or cleanup
    if (originalSetting) {
      await prisma.siteSetting.update({
        where: { key: EMAIL_SETTINGS_KEY },
        data: { value: originalSetting.value },
      });
    } else {
      await prisma.siteSetting.deleteMany({
        where: { key: EMAIL_SETTINGS_KEY },
      });
    }
  });

  describe("1. Secure Storage & Credential Masking (AES-256-GCM)", () => {
    it("saves settings and stores password encrypted in database", async () => {
      const testPass = "abcd efgh ijkl mnop";
      const saved = await saveBookingEmailSettings({
        enabled: true,
        senderName: "PakistanTravel.Agency Test",
        senderEmail: "test-sender@gmail.com",
        smtpUser: "test-sender@gmail.com",
        smtpPass: testPass,
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpSecure: false,
        adminEmail: "test-admin@pakistantravel.agency",
        replyTo: "support@pakistantravel.agency",
      });

      assert.strictEqual(saved.enabled, true);
      assert.strictEqual(saved.senderName, "PakistanTravel.Agency Test");
      assert.strictEqual(saved.isPasswordConfigured, true);
      assert.strictEqual(saved.smtpHost, "smtp.gmail.com");
      assert.strictEqual(saved.smtpPort, 587);
      assert.strictEqual(saved.smtpSecure, false);
      assert.strictEqual("smtpPass" in saved, false, "Plaintext smtpPass must never be returned in masked output");

      // Verify raw database record
      const raw = await prisma.siteSetting.findUnique({
        where: { key: EMAIL_SETTINGS_KEY },
      });
      assert.ok(raw, "Database record must exist");
      const val = raw.value;
      assert.ok(val.smtpPassEncrypted, "Raw database must contain encrypted password");
      assert.ok(val.smtpPassEncrypted.startsWith("enc:v1:"), "Password must start with authenticated encryption prefix");
      assert.strictEqual("smtpPass" in val, false, "Plaintext password must NEVER be in raw DB payload");

      // Verify internal decrypted settings retrieval
      const internal = await getBookingEmailSettings();
      assert.strictEqual(internal.smtpPass, testPass, "Internal mailer must retrieve decrypted password");
    });

    it("preserves existing encrypted password when edited with blank password field", async () => {
      // First ensure a known password is saved
      const originalPass = "secret-pass-1234";
      await saveBookingEmailSettings({
        smtpPass: originalPass,
        senderEmail: "test-sender@gmail.com",
      });

      // Submit an update leaving password blank
      const updated = await saveBookingEmailSettings({
        senderName: "PakistanTravel.Agency Updated Name",
        smtpPass: "", // Blank!
      });

      assert.strictEqual(updated.senderName, "PakistanTravel.Agency Updated Name");
      assert.strictEqual(updated.isPasswordConfigured, true, "isPasswordConfigured must remain true");

      const internal = await getBookingEmailSettings();
      assert.strictEqual(internal.smtpPass, originalPass, "Password must be preserved exactly");
    });

    it("allows explicitly clearing the password", async () => {
      await saveBookingEmailSettings({
        clearPassword: true,
      });

      const masked = await getMaskedBookingEmailSettings();
      assert.strictEqual(masked.isPasswordConfigured, false);

      const internal = await getBookingEmailSettings();
      assert.strictEqual(internal.smtpPass, "");
    });
  });

  describe("2. Admin Access Control Enforcement", () => {
    it("restricts email settings management to ADMIN role", () => {
      const anonCheck = requireRole(null, ["ADMIN"]);
      assert.strictEqual(anonCheck.authorized, false);
      assert.strictEqual(anonCheck.status, 401);

      const customerCheck = requireRole({ user: { role: "CUSTOMER" } }, ["ADMIN"]);
      assert.strictEqual(customerCheck.authorized, false);
      assert.strictEqual(customerCheck.status, 403);

      const vendorCheck = requireRole({ user: { role: "VENDOR" } }, ["ADMIN"]);
      assert.strictEqual(vendorCheck.authorized, false);
      assert.strictEqual(vendorCheck.status, 403);

      const adminCheck = requireRole({ user: { role: "ADMIN" } }, ["ADMIN"]);
      assert.strictEqual(adminCheck.authorized, true);
      assert.strictEqual(adminCheck.status, 200);
    });
  });

  describe("3. Multi-Party Booking Confirmation Dispatch Rules", () => {
    let testVendorUser;
    let testVendor;
    let testListingWithEmail;
    let testListingWithoutEmail;
    let testUnitWithEmail;
    let testUnitWithoutEmail;
    let confirmedBooking;
    let pendingBooking;

    before(async () => {
      // Create test vendor user with email
      testVendorUser = await prisma.user.create({
        data: {
          name: `Vendor With Email ${timestamp}`,
          email: `vendor-${timestamp}@adventurepakistan.pk`,
          phone: `+92333${timestamp.toString().slice(-7)}`,
          role: "VENDOR",
        },
      });

      testVendor = await prisma.vendor.create({
        data: {
          userId: testVendorUser.id,
          businessName: "Karakoram Explorers",
          city: "Skardu",
          phone: testVendorUser.phone,
          status: "VERIFIED",
        },
      });

      let dest = await prisma.destination.findFirst();
      if (!dest) {
        dest = await prisma.destination.create({
          data: { name: "Skardu Valley", slug: `skardu-valley-${timestamp}` },
        });
      }

      let cat = await prisma.category.findFirst();
      if (!cat) {
        cat = await prisma.category.create({
          data: { name: "Tours", slug: `tours-${timestamp}`, type: "TOUR" },
        });
      }

      testListingWithEmail = await prisma.listing.create({
        data: {
          vendorId: testVendor.id,
          destinationId: dest.id,
          categoryId: cat.id,
          title: `Skardu Expedition ${timestamp}`,
          slug: `skardu-expedition-${timestamp}`,
          description: "Test expedition",
          address: "Skardu Center",
          city: "Skardu",
          cancellationPolicy: "Standard",
          type: "TOUR",
          basePrice: 95000,
          status: "PUBLISHED",
        },
      });

      // Listing with vendor user having no valid email address (e.g. unconfigured/offline partner)
      const vendorUserNoEmail = await prisma.user.create({
        data: {
          name: `Vendor Without Email ${timestamp}`,
          email: `novendor-${timestamp}`, // No '@' symbol
          phone: `+92344${timestamp.toString().slice(-7)}`,
          role: "VENDOR",
        },
      });
      const vendorNoEmail = await prisma.vendor.create({
        data: {
          userId: vendorUserNoEmail.id,
          businessName: "Northern Jeep Safaris",
          city: "Hunza",
          phone: vendorUserNoEmail.phone,
          status: "VERIFIED",
        },
      });
      testListingWithoutEmail = await prisma.listing.create({
        data: {
          vendorId: vendorNoEmail.id,
          destinationId: dest.id,
          categoryId: cat.id,
          title: `Jeep Safari ${timestamp}`,
          slug: `jeep-safari-${timestamp}`,
          description: "Test safari",
          address: "Hunza Center",
          city: "Hunza",
          cancellationPolicy: "Standard",
          type: "TOUR",
          basePrice: 65000,
          status: "PUBLISHED",
        },
      });

      testUnitWithEmail = await prisma.listingUnit.create({
        data: {
          listingId: testListingWithEmail.id,
          title: "Standard Seat",
          basePrice: 95000,
        },
      });

      testUnitWithoutEmail = await prisma.listingUnit.create({
        data: {
          listingId: testListingWithoutEmail.id,
          title: "Jeep Safari Seat",
          basePrice: 65000,
        },
      });

      // Confirmed booking
      confirmedBooking = await prisma.booking.create({
        data: {
          bookingNumber: `PKT-CONF-${timestamp}`,
          listingId: testListingWithEmail.id,
          unitId: testUnitWithEmail.id,
          userId: testVendorUser.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000 * 3),
          guestsCount: 2,
          unitsCount: 1,
          totalAmount: 95000,
          depositAmount: 23750,
          balanceDue: 71250,
          vendorEarnings: 83600,
          platformFee: 11400,
          status: "CONFIRMED",
          guestName: "Ali Raza",
          guestEmail: `aliraza-${timestamp}@testmail.pk`,
          guestPhone: "+923009988776",
        },
      });

      // Pending booking (e.g. checkout clicked without completed payment)
      pendingBooking = await prisma.booking.create({
        data: {
          bookingNumber: `PKT-PEND-${timestamp}`,
          listingId: testListingWithEmail.id,
          unitId: testUnitWithEmail.id,
          userId: testVendorUser.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000 * 3),
          guestsCount: 2,
          unitsCount: 1,
          totalAmount: 95000,
          depositAmount: 0,
          balanceDue: 95000,
          vendorEarnings: 83600,
          platformFee: 11400,
          status: "PENDING_PAYMENT",
          guestName: "Usman Tariq",
          guestEmail: `usman-${timestamp}@testmail.pk`,
          guestPhone: "+923001122334",
        },
      });
    });

    it("does NOT dispatch emails for pending/unconfirmed bookings", async () => {
      const res = await sendBookingConfirmationEmails(pendingBooking.id);
      assert.strictEqual(res.customerOutboxId, undefined, "Pending booking must not generate customer email");
      assert.strictEqual(res.vendorOutboxId, undefined, "Pending booking must not generate vendor email");
      assert.strictEqual(res.adminOutboxIds.length, 0, "Pending booking must not generate admin emails");

      const outboxCount = await prisma.emailOutbox.count({
        where: { bookingId: pendingBooking.id },
      });
      assert.strictEqual(outboxCount, 0, "No outbox records should exist for pending booking");
    });

    it("dispatches exactly 3 separate emails (Customer, Vendor, Admin) for confirmed booking", async () => {
      const res = await sendBookingConfirmationEmails(confirmedBooking.id);

      assert.ok(res.customerOutboxId, "Must create customer outbox record");
      assert.ok(res.vendorOutboxId, "Must create vendor outbox record");
      assert.ok(res.adminOutboxIds.length > 0, "Must create admin outbox record");

      const records = await prisma.emailOutbox.findMany({
        where: { bookingId: confirmedBooking.id },
      });

      const customerRecord = records.find((r) => r.recipientRole === "CUSTOMER");
      const vendorRecord = records.find((r) => r.recipientRole === "VENDOR");
      const adminRecord = records.find((r) => r.recipientRole === "ADMIN");

      assert.ok(customerRecord, "Customer record must exist");
      assert.strictEqual(customerRecord.to, confirmedBooking.guestEmail.toLowerCase());
      assert.ok(customerRecord.subject.includes(confirmedBooking.bookingNumber));
      assert.strictEqual(customerRecord.status, "SENT");

      assert.ok(vendorRecord, "Vendor record must exist");
      assert.strictEqual(vendorRecord.to, testVendorUser.email.toLowerCase());
      assert.ok(vendorRecord.subject.includes(confirmedBooking.bookingNumber));
      assert.strictEqual(vendorRecord.status, "SENT");

      assert.ok(adminRecord, "Admin record must exist");
      assert.ok(adminRecord.subject.includes("[Admin Alert]"));
      assert.strictEqual(adminRecord.status, "SENT");
    });

    it("deduplicates: repeated confirmation does NOT create duplicate emails", async () => {
      const initialCount = await prisma.emailOutbox.count({
        where: { bookingId: confirmedBooking.id },
      });

      // Call confirmation email dispatch again
      const secondCall = await sendBookingConfirmationEmails(confirmedBooking.id);

      const afterCount = await prisma.emailOutbox.count({
        where: { bookingId: confirmedBooking.id },
      });

      assert.strictEqual(afterCount, initialCount, "Duplicate calls must not create new outbox rows");
    });

    it("handles missing vendor email gracefully: logs failure in outbox and delivers customer & admin copies", async () => {
      const missingVendorBooking = await prisma.booking.create({
        data: {
          bookingNumber: `PKT-NOVEN-${timestamp}`,
          listingId: testListingWithoutEmail.id,
          unitId: testUnitWithoutEmail.id,
          userId: testVendorUser.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000 * 3),
          guestsCount: 1,
          unitsCount: 1,
          totalAmount: 65000,
          depositAmount: 16250,
          balanceDue: 48750,
          vendorEarnings: 57200,
          platformFee: 7800,
          status: "CONFIRMED",
          guestName: "Fatima Noor",
          guestEmail: `fatima-${timestamp}@testmail.pk`,
          guestPhone: "+923005544332",
        },
      });

      const res = await sendBookingConfirmationEmails(missingVendorBooking.id);

      assert.ok(res.customerOutboxId, "Customer email must still be dispatched");
      assert.ok(res.vendorOutboxId, "Vendor outbox entry must be created to surface warning in admin");
      assert.ok(res.adminOutboxIds.length > 0, "Admin email must still be dispatched");

      const vendorOutbox = await prisma.emailOutbox.findUnique({
        where: { id: res.vendorOutboxId },
      });

      assert.ok(vendorOutbox);
      assert.strictEqual(vendorOutbox.status, "FAILED");
      assert.ok(
        vendorOutbox.lastError?.includes("Vendor email address not configured"),
        "Error message must specify missing vendor email"
      );

      const customerOutbox = await prisma.emailOutbox.findUnique({
        where: { id: res.customerOutboxId },
      });
      assert.strictEqual(customerOutbox?.status, "SENT", "Customer email must succeed");
    });

    it("retries only failed recipients independently without resending succeeded emails", async () => {
      // Create a test failed email and a sent email
      const failedRecord = await prisma.emailOutbox.create({
        data: {
          to: "retry-recipient@test.pk",
          recipientRole: "VENDOR",
          subject: "Failed Item For Independent Retry Test",
          htmlBody: "<p>Retry</p>",
          textBody: "Retry",
          status: "PENDING",
          attempts: 1,
          lastError: "Connection timeout on previous attempt",
          eventType: "BOOKING_CONFIRMED",
        },
      });

      const sentRecord = await prisma.emailOutbox.create({
        data: {
          to: "already-delivered@test.pk",
          recipientRole: "CUSTOMER",
          subject: "Already Succeeded Item",
          htmlBody: "<p>Delivered</p>",
          textBody: "Delivered",
          status: "SENT",
          attempts: 1,
          sentAt: new Date(),
          eventType: "BOOKING_CONFIRMED",
        },
      });

      // Process pending outbox
      const processResult = await processPendingEmailOutbox(25, [failedRecord.id, sentRecord.id]);
      assert.strictEqual(processResult.processed, 1, "Only the pending/failed item should be picked up for retry");

      const afterRetry = await prisma.emailOutbox.findUnique({
        where: { id: failedRecord.id },
      });
      assert.strictEqual(afterRetry?.status, "SENT");
      assert.strictEqual(afterRetry?.attempts, 2);

      const sentAfter = await prisma.emailOutbox.findUnique({
        where: { id: sentRecord.id },
      });
      assert.strictEqual(sentAfter?.attempts, 1, "Already sent item must remain untouched");
    });
  });
});
