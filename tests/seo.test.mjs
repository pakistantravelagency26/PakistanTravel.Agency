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
    it("generates sitemap with /tours, destinations, and static pages but NO /hotels or /rentals", async () => {
      const entries = await sitemapGenerator();
      const urls = entries.map((e) => e.url);

      assert.ok(urls.includes("https://www.pakistantravel.agency/tours"), "Includes /tours");
      assert.ok(!urls.includes("https://www.pakistantravel.agency/hotels"), "Must NOT include /hotels in sitemap");
      assert.ok(!urls.includes("https://www.pakistantravel.agency/rentals"), "Must NOT include /rentals in sitemap");
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

    it("verifies 301 redirects exist for legacy /hotels and /rentals routes in middleware", () => {
      const file = fs.readFileSync(path.resolve(process.cwd(), "src/middleware.ts"), "utf-8");
      assert.ok(file.includes('/hotels'), "Middleware must handle legacy /hotels");
      assert.ok(file.includes('/rentals'), "Middleware must handle legacy /rentals");
      assert.ok(file.includes('301'), "Middleware must perform permanent 301 redirects to /tours");
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
      assert.ok(file.includes("isVercelHost"), "Middleware must check for vercel default host");
      assert.ok(file.includes("NextResponse.redirect(canonicalUrl, 301)"), "Middleware must issue 301 permanent redirect");
    });

    it("verifies 301 permanent redirects for legacy Urdu (/ur) routes in middleware", () => {
      const file = fs.readFileSync(path.resolve(process.cwd(), "src/middleware.ts"), "utf-8");
      assert.ok(file.includes('path === "/ur"'), "Middleware must check for /ur");
      assert.ok(file.includes('path.startsWith("/ur/")'), "Middleware must check for /ur/*");
      assert.ok(file.includes('NextResponse.redirect(englishHome, 301)'), "Must 301 redirect /ur to English home");
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
