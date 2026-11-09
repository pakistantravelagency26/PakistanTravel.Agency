import { describe, it, after } from "node:test";
import assert from "node:assert";
import { prisma } from "../src/lib/prisma.ts";
import {
  buildCustomerBookingConfirmationEmail,
  buildVendorBookingAlertEmail,
  buildAdminBookingAlertEmail,
  buildCustomerCancellationEmail,
  buildVendorCancellationEmail,
  buildAdminCancellationEmail,
} from "../src/services/emailTemplates.service.ts";
import {
  queueEmail,
  deliverOutboxEmail,
  sendBookingConfirmationEmails,
  sendBookingCancellationEmails,
  processPendingEmailOutbox,
} from "../src/services/email.service.ts";
import fs from "node:fs";
import path from "node:path";
import { SITE_URL, COMMISSION_PERCENT, PAYOUT_TIMING, siteConfig } from "../src/config/site.ts";

describe("Phase 6: Transactional Booking Emails Test Suite", () => {
  const sampleBooking = {
    bookingNumber: "PKT-2026-TEST01",
    listingTitle: "Skardu Alpine Glamping Resort",
    unitTitle: "Luxury Dome",
    destination: "Skardu",
    startDate: "2026-07-01",
    endDate: "2026-07-05",
    nightsCount: 4,
    guestsCount: 2,
    totalAmount: 120000,
    depositAmount: 30000,
    balanceDue: 90000,
    paymentMethod: "STRIPE",
    paymentStatus: "PAID",
    guestName: "Zainab Khan",
    guestEmail: "zainab.khan@example.pk",
    guestPhone: "+923001234567",
    specialRequests: "Airport transfer needed",
    vendorBusinessName: "Baltistan Eco Tours",
    vendorPhone: "+923119876543",
    vendorWhatsapp: "+923119876543",
    vendorEmail: "vendor.baltistan@example.pk",
    commissionRate: 10,
  };

  describe("Email Template Content & Compliance", () => {
    it("generates Customer confirmation email with voucher URL and cancellation policy", () => {
      const email = buildCustomerBookingConfirmationEmail(sampleBooking);

      assert.strictEqual(email.subject, "Booking Confirmed: PKT-2026-TEST01 - Skardu Alpine Glamping Resort");
      assert.ok(email.html.includes("PKT-2026-TEST01"), "HTML must include booking number");
      assert.ok(email.html.includes("Zainab Khan"), "HTML must include guest name");
      assert.ok(email.html.includes("Skardu Alpine Glamping Resort"), "HTML must include listing title");
      assert.ok(email.html.includes("PKR 120,000"), "HTML must include formatted total");
      assert.ok(email.html.includes("PKR 90,000"), "HTML must include balance due");
      assert.ok(email.html.includes(`${SITE_URL}/confirmation/PKT-2026-TEST01`), "HTML must link to official voucher");
      assert.ok(email.html.includes(siteConfig.cancellationPolicy.summary), "HTML must include cancellation policy");
      assert.ok(email.text.includes(sampleBooking.bookingNumber), "Text must include booking number");
    });

    it("generates Vendor alert with guest details, commission deduction, and payout timing", () => {
      const email = buildVendorBookingAlertEmail(sampleBooking);

      assert.ok(email.subject.includes("New Booking Received"));
      assert.ok(email.html.includes("Baltistan Eco Tours"));
      assert.ok(email.html.includes("Zainab Khan"));
      assert.ok(email.html.includes("+923001234567"));
      assert.ok(email.html.includes("PKR 12,000"), "HTML must include platform commission fee (10% of 120,000)");
      assert.ok(email.html.includes("PKR 108,000"), "HTML must include net vendor earnings (120,000 - 12,000)");
      assert.ok(email.html.includes(PAYOUT_TIMING), "HTML must reference official payout timing");
      assert.ok(email.html.includes(`${SITE_URL}/partner-hub/bookings`), "HTML must link to partner hub");
    });

    it("generates Admin booking alert with platform fees and admin portal link", () => {
      const email = buildAdminBookingAlertEmail(sampleBooking);

      assert.ok(email.subject.includes("[Admin Alert] New Marketplace Booking"));
      assert.ok(email.html.includes("PKT-2026-TEST01"));
      assert.ok(email.html.includes("PKR 12,000"), "Admin must see platform commission fee");
      assert.ok(email.html.includes(`${SITE_URL}/secure-admin/bookings`), "Admin must receive direct link");
    });

    it("generates Customer and Vendor cancellation emails with policy guidance", () => {
      const customerCancel = buildCustomerCancellationEmail(sampleBooking);
      assert.ok(customerCancel.subject.includes("Booking Cancelled"));
      assert.ok(customerCancel.html.includes(siteConfig.cancellationPolicy.summary));

      const vendorCancel = buildVendorCancellationEmail(sampleBooking);
      assert.ok(vendorCancel.subject.includes("Booking Cancelled by Guest"));
      assert.ok(vendorCancel.html.includes("Replenished automatically to availability"));

      const adminCancel = buildAdminCancellationEmail(sampleBooking);
      assert.ok(adminCancel.subject.includes("[Admin Alert] Booking Cancelled"));
    });
  });

  describe("Transactional Outbox Lifecycle & Delivery Engine", () => {
    it("queues an email in the EmailOutbox database table with PENDING status", async () => {
      const testEmailId = await queueEmail({
        to: "test.guest@example.pk",
        recipientRole: "CUSTOMER",
        subject: "Test Booking Confirmation",
        htmlBody: "<p>Test email body</p>",
        textBody: "Test email body",
        eventType: "BOOKING_CONFIRMED",
      });

      assert.ok(testEmailId, "Should return generated UUID");

      const item = await prisma.emailOutbox.findUnique({
        where: { id: testEmailId },
      });

      assert.strictEqual(item?.to, "test.guest@example.pk");
      assert.strictEqual(item?.status, "PENDING");
      assert.strictEqual(item?.attempts, 0);
      assert.strictEqual(item?.sentAt, null);
    });

    it("delivers the outbox email and updates status to SENT with sentAt populated", async () => {
      const testEmailId = await queueEmail({
        to: "test.vendor@example.pk",
        recipientRole: "VENDOR",
        subject: "Test Vendor Notification",
        htmlBody: "<p>Vendor body</p>",
        textBody: "Vendor body",
        eventType: "BOOKING_CONFIRMED",
      });

      const result = await deliverOutboxEmail(testEmailId);
      assert.strictEqual(result.success, true);

      const updated = await prisma.emailOutbox.findUnique({
        where: { id: testEmailId },
      });

      assert.strictEqual(updated?.status, "SENT");
      assert.strictEqual(updated?.attempts, 1);
      assert.ok(updated?.sentAt instanceof Date, "sentAt should be a valid Date timestamp");
    });
  });

  describe("End-to-End Multi-Party Booking Dispatch Flow", () => {
    let testVendorUser;
    let testVendorProfile;
    let testListing;
    let testBooking;
    let timestamp;

    it("seeds test vendor, listing, and booking record in database", async () => {
      timestamp = Date.now();
      testVendorUser = await prisma.user.create({
        data: {
          name: `Vendor Host ${timestamp}`,
          email: `host-${timestamp}@baltistantours.pk`,
          phone: `+92321${timestamp.toString().slice(-7)}`,
          role: "VENDOR",
        },
      });

      testVendorProfile = await prisma.vendor.create({
        data: {
          userId: testVendorUser.id,
          businessName: "Karakoram Expeditions PK",
          city: "Skardu",
          phone: testVendorUser.phone,
          status: "VERIFIED",
        },
      });

      let destination = await prisma.destination.findFirst();
      if (!destination) {
        destination = await prisma.destination.create({
          data: { name: "Skardu", slug: `skardu-${timestamp}` },
        });
      }

      let category = await prisma.category.findFirst();
      if (!category) {
        category = await prisma.category.create({
          data: { name: "Tours", slug: `tours-${timestamp}`, type: "TOUR" },
        });
      }

      testListing = await prisma.listing.create({
        data: {
          vendorId: testVendorProfile.id,
          destinationId: destination.id,
          categoryId: category.id,
          title: `Hunza Valley Autumn Adventure ${timestamp}`,
          slug: `hunza-autumn-${timestamp}`,
          description: "Explore northern Pakistan.",
          address: "Main Karakoram Highway, Hunza",
          city: "Hunza",
          cancellationPolicy: "Full refund 7 days prior",
          type: "TOUR",
          basePrice: 85000,
          commissionRate: 10,
          status: "PUBLISHED",
        },
      });

      const testUnit = await prisma.listingUnit.create({
        data: {
          listingId: testListing.id,
          title: "Standard Deluxe Tour Seat",
          basePrice: 85000,
        },
      });

      testBooking = await prisma.booking.create({
        data: {
          bookingNumber: `PKT-2026-E2E-${timestamp.toString().slice(-4)}`,
          userId: testVendorUser.id,
          listingId: testListing.id,
          unitId: testUnit.id,
          startDate: new Date("2026-10-01"),
          endDate: new Date("2026-10-06"),
          guestsCount: 2,
          totalAmount: 170000,
          depositAmount: 42500,
          balanceDue: 127500,
          vendorEarnings: 153000,
          platformFee: 17000,
          status: "CONFIRMED",
          guestName: "Ali Raza",
          guestEmail: `traveler-${timestamp}@gmail.com`,
          guestPhone: "+923335551234",
        },
      });

      assert.ok(testBooking.id);
    });

    it("dispatches booking confirmation emails to Customer, Vendor, and Admin", async () => {
      const dispatchResult = await sendBookingConfirmationEmails(testBooking.id);

      assert.ok(dispatchResult.customerOutboxId, "Customer outbox ID should be created");
      assert.ok(dispatchResult.vendorOutboxId, "Vendor outbox ID should be created");
      assert.ok(dispatchResult.adminOutboxIds.length > 0, "At least one Admin outbox ID should be created");

      const customerOutbox = await prisma.emailOutbox.findUnique({
        where: { id: dispatchResult.customerOutboxId },
      });
      assert.strictEqual(customerOutbox?.status, "SENT");
      assert.strictEqual(customerOutbox?.recipientRole, "CUSTOMER");
      assert.ok(customerOutbox?.subject.includes(testBooking.bookingNumber));

      const vendorOutbox = await prisma.emailOutbox.findUnique({
        where: { id: dispatchResult.vendorOutboxId },
      });
      assert.strictEqual(vendorOutbox?.status, "SENT");
      assert.strictEqual(vendorOutbox?.recipientRole, "VENDOR");
      assert.strictEqual(vendorOutbox?.to, testVendorUser.email.toLowerCase());

      for (const adminId of dispatchResult.adminOutboxIds) {
        const adminOutbox = await prisma.emailOutbox.findUnique({
          where: { id: adminId },
        });
        assert.strictEqual(adminOutbox?.status, "SENT");
        assert.strictEqual(adminOutbox?.recipientRole, "ADMIN");
      }
    });

    it("dispatches cancellation emails to Customer, Vendor, and Admin when booking is cancelled", async () => {
      const cancelResult = await sendBookingCancellationEmails(testBooking.id);

      assert.ok(cancelResult.customerOutboxId, "Customer cancellation outbox created");
      assert.ok(cancelResult.vendorOutboxId, "Vendor cancellation outbox created");
      assert.ok(cancelResult.adminOutboxIds.length > 0, "Admin cancellation outbox created");

      const customerOutbox = await prisma.emailOutbox.findUnique({
        where: { id: cancelResult.customerOutboxId },
      });
      assert.strictEqual(customerOutbox?.status, "SENT");
      assert.strictEqual(customerOutbox?.eventType, "BOOKING_CANCELLED");
    });

    after(async () => {
      // Clean up test booking and listing from isolated test database
      if (testBooking?.id) {
        await prisma.emailOutbox.deleteMany({ where: { OR: [{ to: testVendorUser?.email }, { to: `traveler-${timestamp}@gmail.com` }] } });
        await prisma.booking.deleteMany({ where: { id: testBooking.id } });
      }
      if (testListing?.id) {
        await prisma.listingUnit.deleteMany({ where: { listingId: testListing.id } });
        await prisma.listing.deleteMany({ where: { id: testListing.id } });
      }
      if (testVendorProfile?.id) {
        await prisma.vendor.deleteMany({ where: { id: testVendorProfile.id } });
      }
      if (testVendorUser?.id) {
        await prisma.user.deleteMany({ where: { id: testVendorUser.id } });
      }
    });
  });

  describe("Outbox Retry Engine & Background Worker", () => {
    it("processes a batch of pending emails and updates their state to SENT", async () => {
      const id1 = await queueEmail({
        to: "batch1@example.pk",
        recipientRole: "CUSTOMER",
        subject: "Batch Test 1",
        htmlBody: "<p>Batch 1</p>",
        textBody: "Batch 1",
        eventType: "BOOKING_CONFIRMED",
      });

      const id2 = await queueEmail({
        to: "batch2@example.pk",
        recipientRole: "VENDOR",
        subject: "Batch Test 2",
        htmlBody: "<p>Batch 2</p>",
        textBody: "Batch 2",
        eventType: "BOOKING_CONFIRMED",
      });

      const result = await processPendingEmailOutbox(10, [id1, id2]);
      assert.strictEqual(result.processed, 2, "Should process exactly the 2 targeted queued emails");
      assert.strictEqual(result.succeeded, 2, "Should succeed delivery for both emails");

      const item1 = await prisma.emailOutbox.findUnique({ where: { id: id1 } });
      const item2 = await prisma.emailOutbox.findUnique({ where: { id: id2 } });

      assert.strictEqual(item1?.status, "SENT");
      assert.strictEqual(item2?.status, "SENT");
      assert.strictEqual(item1?.attempts, 1);
      assert.strictEqual(item2?.attempts, 1);
    });

    it("does not process emails that have reached 5 failed attempts", async () => {
      const exhausted = await prisma.emailOutbox.create({
        data: {
          to: "exhausted@example.pk",
          recipientRole: "CUSTOMER",
          subject: "Exhausted Email",
          htmlBody: "<p>Exhausted</p>",
          textBody: "Exhausted",
          eventType: "BOOKING_CONFIRMED",
          status: "FAILED",
          attempts: 5,
        },
      });

      const result = await processPendingEmailOutbox(5);
      const check = await prisma.emailOutbox.findUnique({ where: { id: exhausted.id } });
      assert.strictEqual(check?.status, "FAILED");
      assert.strictEqual(check?.attempts, 5, "Exhausted email attempts should not increase");
    });
  });

  describe("SPF, DKIM, and DMARC DNS Documentation", () => {
    it("verifies that docs/EMAIL_DNS_SETUP.md contains valid SPF, DKIM, and DMARC specs", () => {
      const docPath = path.resolve(process.cwd(), "docs/EMAIL_DNS_SETUP.md");
      assert.ok(fs.existsSync(docPath), "EMAIL_DNS_SETUP.md must exist in docs/");

      const content = fs.readFileSync(docPath, "utf-8");
      assert.ok(content.includes("v=spf1"), "Must document SPF record with v=spf1");
      assert.ok(content.includes("DKIM"), "Must document DKIM configuration");
      assert.ok(content.includes("v=DMARC1"), "Must document DMARC policy with v=DMARC1");
      assert.ok(content.includes("rua=mailto:"), "Must document DMARC aggregate reporting address");
      assert.ok(content.includes("pakistantravel.agency"), "Must be scoped to pakistantravel.agency");
    });
  });
});
