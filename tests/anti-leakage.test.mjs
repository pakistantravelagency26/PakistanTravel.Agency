import test from "node:test";
import assert from "node:assert/strict";

import {
  hasContactLeakage,
  maskContactLeakage,
  formatWhatsAppUrl,
  CONTACT_MASK_NOTICE,
  sanitizePublicVendor,
  resolveBookingVendorContact,
} from "../src/lib/antiLeakage.ts";

test.describe("Anti-Leakage & Vendor Contact Protection Test Suite", () => {
  // --------------------------------------------------------
  // 1. Detection of Contact Info & Marketplace Bypass Attempts
  // --------------------------------------------------------
  test.describe("Contact Leakage Detection", () => {
    test("detects standard Pakistani mobile numbers", () => {
      assert.equal(hasContactLeakage("Reach me at 0300 1234567 for direct discount"), true);
      assert.equal(hasContactLeakage("Call 0321-7654321"), true);
      assert.equal(hasContactLeakage("My number is +923331112233"), true);
    });

    test("detects obfuscated spaced phone numbers", () => {
      assert.equal(hasContactLeakage("Direct contact: 0 3 0 0 1 2 3 4 5 6 7"), true);
      assert.equal(hasContactLeakage("Call 0 3 2 1 - 7 6 5 4 3 2 1"), true);
    });

    test("detects email addresses", () => {
      assert.equal(hasContactLeakage("Email me at operator@mountaintravels.pk"), true);
      assert.equal(hasContactLeakage("Contact host: guide [at] gmail [dot] com"), true);
    });

    test("detects WhatsApp bypass phrases", () => {
      assert.equal(hasContactLeakage("whatsapp me on 03001234567"), true);
      assert.equal(hasContactLeakage("wa.me/923001234567"), true);
      assert.equal(hasContactLeakage("contact me directly offline"), true);
    });

    test("does not flag legitimate travel discussions or pricing", () => {
      assert.equal(hasContactLeakage("I want a 5-day tour for 3 travelers in Skardu"), false);
      assert.equal(hasContactLeakage("The price is PKR 45,000 per person including breakfast"), false);
      assert.equal(hasContactLeakage("Is heater available in the hotel room?"), false);
      assert.equal(hasContactLeakage("Departure date is 2026-06-15"), false);
    });
  });

  // --------------------------------------------------------
  // 2. Content Masking
  // --------------------------------------------------------
  test.describe("Contact Masking Replacement", () => {
    test("replaces phone number with safety notice", () => {
      const raw = "Contact me on 0300 1234567 for offline deal";
      const masked = maskContactLeakage(raw);
      assert.ok(!masked.includes("0300 1234567"));
      assert.ok(masked.includes(CONTACT_MASK_NOTICE));
    });

    test("replaces email with safety notice", () => {
      const raw = "Send receipt to mypersonal@yahoo.com please";
      const masked = maskContactLeakage(raw);
      assert.ok(!masked.includes("mypersonal@yahoo.com"));
      assert.ok(masked.includes(CONTACT_MASK_NOTICE));
    });

    test("replaces WhatsApp link with safety notice", () => {
      const raw = "Chat here wa.me/923001234567";
      const masked = maskContactLeakage(raw);
      assert.ok(!masked.includes("wa.me"));
      assert.ok(masked.includes(CONTACT_MASK_NOTICE));
    });
  });

  // --------------------------------------------------------
  // 3. WhatsApp wa.me URL Formatter
  // --------------------------------------------------------
  test.describe("WhatsApp Link Formatter", () => {
    test("converts local Pakistani 03xx number to international 923xx wa.me URL", () => {
      const url = formatWhatsAppUrl("0300-1234567");
      assert.equal(url, "https://wa.me/923001234567");
    });

    test("handles numbers already with +92 country code", () => {
      const url = formatWhatsAppUrl("+92 321 7654321");
      assert.equal(url, "https://wa.me/923217654321");
    });

    test("returns null on empty or invalid input", () => {
      assert.equal(formatWhatsAppUrl(null), null);
      assert.equal(formatWhatsAppUrl(""), null);
    });
  });

  // --------------------------------------------------------
  // 4. Public Listing Scrape Protection
  // --------------------------------------------------------
  test.describe("Public Listing Scrape Defense", () => {
    test("sanitizePublicVendor strips vendor phone, WhatsApp, and email from public listings", () => {
      const rawVendor = {
        id: "v-operator-1",
        businessName: "Karakoram Explorers",
        city: "Karimabad",
        status: "VERIFIED",
        phone: "0300-1234567", // Raw DB field
        whatsapp: "0300-1234567", // Raw DB field
        email: "direct@karakoram.com", // Raw DB field
        cnicOrTaxNumber: "DTS-1122",
      };

      const publicVendor = sanitizePublicVendor(rawVendor);

      // Verify safe fields are included
      assert.equal(publicVendor.businessName, "Karakoram Explorers");
      assert.equal(publicVendor.city, "Karimabad");
      assert.equal(publicVendor.licenseNumber, "DTS-1122");

      // Verify contact numbers are NOT leaked
      assert.equal(publicVendor.phone, undefined);
      assert.equal(publicVendor.whatsapp, undefined);
      assert.equal(publicVendor.email, undefined);

      // Verify JSON serialization does not contain the phone number or email anywhere
      const jsonString = JSON.stringify(publicVendor);
      assert.ok(!jsonString.includes("0300-1234567"));
      assert.ok(!jsonString.includes("03001234567"));
      assert.ok(!jsonString.includes("direct@karakoram.com"));
    });
  });

  // --------------------------------------------------------
  // 5. Booking Confirmation Contact Release Policy
  // --------------------------------------------------------
  test.describe("Booking Host Contact Release Policy", () => {
    test("hides vendor phone and WhatsApp when booking is PENDING_PAYMENT", () => {
      const rawVendor = {
        id: "v-1",
        businessName: "Baltistan Treks",
        city: "Skardu",
        phone: "0345-9876543",
        whatsapp: "0345-9876543",
      };

      const mapped = resolveBookingVendorContact(rawVendor, false); // isConfirmed = false
      assert.ok(mapped);
      assert.equal(mapped.businessName, "Baltistan Treks");
      assert.equal(mapped.city, "Skardu");
      assert.equal(mapped.phone, undefined);
      assert.equal(mapped.whatsapp, undefined);
    });

    test("reveals vendor phone and WhatsApp when booking is CONFIRMED", () => {
      const rawVendor = {
        id: "v-1",
        businessName: "Baltistan Treks",
        city: "Skardu",
        phone: "0345-9876543",
        whatsapp: "0345-9876543",
      };

      const mapped = resolveBookingVendorContact(rawVendor, true); // isConfirmed = true
      assert.ok(mapped);
      assert.equal(mapped.businessName, "Baltistan Treks");
      assert.equal(mapped.phone, "0345-9876543");
      assert.equal(mapped.whatsapp, "0345-9876543");
    });
  });
});
