import { describe, it } from "node:test";
import assert from "node:assert";
import robotsConfig from "../src/app/robots.ts";
import sitemapGenerator from "../src/app/sitemap.ts";
import { SITE_URL } from "../src/config/site.ts";

describe("Phase 7: SEO & Canonical Routing Test Suite", () => {
  it("enforces exact canonical production SITE_URL", () => {
    assert.strictEqual(SITE_URL, "https://www.pakistantravel.agency");
    assert.ok(!SITE_URL.endsWith("/"), "SITE_URL must not have a trailing slash");
    assert.ok(SITE_URL.startsWith("https://www."), "SITE_URL must be https and www");
  });

  describe("Robots.txt Crawler Rules", () => {
    it("configures robots.txt without exposing sensitive admin paths", () => {
      const robots = robotsConfig();
      const rules = Array.isArray(robots.rules) ? robots.rules[0] : robots.rules;

      assert.ok(rules.disallow.includes("/api/"), "Disallows /api/");
      assert.ok(rules.disallow.includes("/search"), "Disallows /search");
      assert.ok(rules.disallow.includes("/login"), "Disallows /login");
      assert.ok(rules.disallow.includes("/register"), "Disallows /register");
      assert.ok(!rules.disallow.includes("/secure-admin"), "Must NOT list /secure-admin in robots.txt");
      assert.ok(!rules.disallow.includes("/partner-hub"), "Must NOT list /partner-hub in robots.txt");
      assert.strictEqual(robots.sitemap, "https://www.pakistantravel.agency/sitemap.xml");
    });
  });

  describe("Sitemap URLs & Indexable Routes", () => {
    it("generates sitemap with /tours, /hotels, /rentals and no admin routes", async () => {
      const entries = await sitemapGenerator();
      const urls = entries.map((e) => e.url);

      assert.ok(urls.includes("https://www.pakistantravel.agency/tours"), "Includes /tours");
      assert.ok(urls.includes("https://www.pakistantravel.agency/hotels"), "Includes /hotels");
      assert.ok(urls.includes("https://www.pakistantravel.agency/rentals"), "Includes /rentals");
      assert.ok(urls.includes("https://www.pakistantravel.agency/destinations"), "Includes /destinations");

      // Verify every single URL starts with the canonical SITE_URL
      for (const url of urls) {
        assert.ok(url.startsWith("https://www.pakistantravel.agency"), `URL must start with canonical domain: ${url}`);
        assert.ok(!url.includes("/secure-admin"), "Sitemap must never include /secure-admin");
        assert.ok(!url.includes("/partner-hub"), "Sitemap must never include /partner-hub");
        assert.ok(!url.includes("/login"), "Sitemap must never include /login");
        assert.ok(!url.includes("/register"), "Sitemap must never include /register");
        assert.ok(!url.includes("/search"), "Sitemap must never include /search");
        assert.ok(!url.includes("/ur"), "Sitemap must never include /ur routes (Phase 3 English-only requirement)");
      }
    });

    it("ensures sitemap has zero /ur routes remaining", async () => {
      const entries = await sitemapGenerator();
      const urRoutes = entries.filter((e) => e.url.includes("/ur"));
      assert.strictEqual(urRoutes.length, 0, "No Urdu routes may exist in sitemap");
    });
  });
});
