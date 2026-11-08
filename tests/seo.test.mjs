import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
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

  describe("Server-Rendered Catalog Pages Structured Data (JSON-LD)", () => {
    it("verifies /tours has ItemList (TouristTrip), BreadcrumbList, and canonical URL", () => {
      const file = fs.readFileSync(path.resolve(process.cwd(), "src/app/tours/page.tsx"), "utf-8");
      assert.ok(file.includes('canonical: `${SITE_URL}/tours`'), "Tours page must define canonical /tours");
      assert.ok(file.includes('"@type": "ItemList"'), "Tours page must inject ItemList JSON-LD");
      assert.ok(file.includes('"@type": "TouristTrip"'), "Tours items must be schema type TouristTrip");
      assert.ok(file.includes('"@type": "BreadcrumbList"'), "Tours page must inject BreadcrumbList JSON-LD");
      assert.ok(file.includes("export const revalidate = 60"), "Tours page must use 60s ISR revalidation");
      assert.ok(file.includes('"PKR"'), "Tours schema must use PKR currency");
    });

    it("verifies /hotels has ItemList (Hotel), BreadcrumbList, and canonical URL", () => {
      const file = fs.readFileSync(path.resolve(process.cwd(), "src/app/hotels/page.tsx"), "utf-8");
      assert.ok(file.includes('canonical: `${SITE_URL}/hotels`'), "Hotels page must define canonical /hotels");
      assert.ok(file.includes('"@type": "ItemList"'), "Hotels page must inject ItemList JSON-LD");
      assert.ok(file.includes('"@type": "Hotel"'), "Hotels items must be schema type Hotel");
      assert.ok(file.includes('"@type": "BreadcrumbList"'), "Hotels page must inject BreadcrumbList JSON-LD");
      assert.ok(file.includes("export const revalidate = 60"), "Hotels page must use 60s ISR revalidation");
    });

    it("verifies /rentals has ItemList (Product), BreadcrumbList, and canonical URL", () => {
      const file = fs.readFileSync(path.resolve(process.cwd(), "src/app/rentals/page.tsx"), "utf-8");
      assert.ok(file.includes('canonical: `${SITE_URL}/rentals`'), "Rentals page must define canonical /rentals");
      assert.ok(file.includes('"@type": "ItemList"'), "Rentals page must inject ItemList JSON-LD");
      assert.ok(file.includes('"@type": "Product"'), "Rentals items must be schema type Product");
      assert.ok(file.includes('"@type": "BreadcrumbList"'), "Rentals page must inject BreadcrumbList JSON-LD");
      assert.ok(file.includes("export const revalidate = 60"), "Rentals page must use 60s ISR revalidation");
    });

    it("verifies /listing/[slug] protects against fake aggregate ratings (<10 reviews)", () => {
      const file = fs.readFileSync(path.resolve(process.cwd(), "src/app/listing/[slug]/page.tsx"), "utf-8");
      assert.ok(file.includes("listing.totalReviews >= 10"), "Must guard AggregateRating strictly by >= 10 real reviews");
      assert.ok(file.includes('"@type": "BreadcrumbList"'), "Listing detail page must inject BreadcrumbList JSON-LD");
      assert.ok(file.includes('canonical: canonicalUrl'), "Listing detail page must specify canonical URL");
    });
  });

  describe("Middleware Canonical Routing & Crawl Exclusion Headers", () => {
    it("defines canonical 301 redirects for apex and preview domains", () => {
      const file = fs.readFileSync(path.resolve(process.cwd(), "src/middleware.ts"), "utf-8");
      assert.ok(file.includes("isApexDomain"), "Middleware must check for apex domain");
      assert.ok(file.includes("isProductionVercelHost"), "Middleware must check for vercel default host");
      assert.ok(file.includes("NextResponse.redirect(canonicalUrl, 301)"), "Middleware must issue 301 permanent redirect");
    });

    it("sets X-Robots-Tag: noindex, nofollow, noarchive on search, query params, and private portals", () => {
      const file = fs.readFileSync(path.resolve(process.cwd(), "src/middleware.ts"), "utf-8");
      assert.ok(file.includes('"X-Robots-Tag", "noindex, nofollow, noarchive"'));
      assert.ok(file.includes('path.startsWith("/secure-admin")'));
      assert.ok(file.includes('path.startsWith("/partner-hub")'));
      assert.ok(file.includes('path.startsWith("/account")'));
      assert.ok(file.includes('path === "/search"'));
      assert.ok(file.includes("hasQueryParams"));
    });
  });
});
