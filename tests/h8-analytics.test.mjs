import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

test("H8.1: Exactly one GTM container (GTM-PRQQWCK8) and no secondary container", () => {
  const rootLayout = fs.readFileSync("src/app/layout.tsx", "utf8");
  assert.ok(rootLayout.includes("GTM-PRQQWCK8"), "Root layout must contain GTM-PRQQWCK8");
  assert.ok(!rootLayout.includes("GTM-TQZH7T4C"), "Root layout must not contain old GTM-TQZH7T4C");

  // Search entire src directory for any other GTM IDs
  function scan(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) scan(full);
      else if (f.endsWith(".tsx") || f.endsWith(".ts")) {
        const text = fs.readFileSync(full, "utf8");
        const gtmMatches = text.match(/GTM-[A-Z0-9]+/g) || [];
        for (const m of gtmMatches) {
          assert.equal(m, "GTM-PRQQWCK8", `Only GTM-PRQQWCK8 allowed, found: ${m} in ${full}`);
        }
      }
    }
  }
  scan("src");
});

test("H8.1: Consent Mode v2 defaults to denied for all privacy categories", () => {
  const rootLayout = fs.readFileSync("src/app/layout.tsx", "utf8");
  assert.ok(rootLayout.includes("'ad_storage': 'denied'"), "ad_storage must default to denied");
  assert.ok(rootLayout.includes("'ad_user_data': 'denied'"), "ad_user_data must default to denied");
  assert.ok(rootLayout.includes("'ad_personalization': 'denied'"), "ad_personalization must default to denied");
  assert.ok(rootLayout.includes("'analytics_storage': 'denied'"), "analytics_storage must default to denied");
});

test("H8.1: Cookie Preferences control component exists and persists consent", () => {
  const banner = fs.readFileSync("src/components/analytics/CookieConsentBanner.tsx", "utf8");
  assert.ok(banner.includes("localStorage.setItem(CONSENT_STORAGE_KEY, value)"), "Persists to localStorage");
  assert.ok(banner.includes("document.cookie ="), "Persists to document.cookie");
  assert.ok(banner.includes("updateAnalyticsConsent"), "Calls updateAnalyticsConsent");
  assert.ok(banner.includes("openCookiePreferences"), "Listens to openCookiePreferences event");
});

test("H8.1: All 6 analytics events are defined and enforce PII-free payloads", () => {
  const analyticsCode = fs.readFileSync("src/lib/analytics.ts", "utf8");
  
  // Verify all 6 event names are emitted
  const requiredEvents = [
    "tour_view",
    "booking_started",
    "deposit_paid",
    "trip_request_submitted",
    "vendor_registered",
    "chat_started"
  ];
  for (const ev of requiredEvents) {
    assert.ok(analyticsCode.includes(`"${ev}"`), `Analytics library must emit "${ev}" event`);
  }

  // Verify no PII fields are mapped into event parameters
  const forbiddenPii = [
    "customerEmail",
    "customerPhone",
    "guestEmail",
    "guestPhone",
    "cnicOrPassport",
    "creditCard",
    "userPassword",
    "walletPhone"
  ];
  for (const pii of forbiddenPii) {
    assert.ok(!analyticsCode.includes(pii), `Analytics event signatures must never include PII param: ${pii}`);
  }
});

test("H8.2: Google site verification meta renders on public layout", () => {
  const rootLayout = fs.readFileSync("src/app/layout.tsx", "utf8");
  assert.ok(rootLayout.includes("_dtqzGPHubzFRP1O4KBy3bcZjIlfrRoz-DtaGPx44ww"), "Verification key must be present in layout");
});
