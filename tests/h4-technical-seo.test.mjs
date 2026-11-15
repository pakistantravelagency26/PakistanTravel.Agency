import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import { SITE_URL, siteConfig } from '../src/config/site.ts';
import { destinationsData } from '../src/data/destinationData.ts';
import { blogPosts } from '../src/data/blogData.ts';
import { tourIntentsData } from '../src/data/tourIntentsData.ts';

describe('Part H4: Technical SEO Test Suite', () => {

  describe('H4.1: Host, Canonical & 301 Redirects Configuration', () => {
    it('enforces exact canonical production SITE_URL', () => {
      assert.strictEqual(SITE_URL, 'https://www.pakistantravel.agency');
      assert.strictEqual(siteConfig.url, 'https://www.pakistantravel.agency');
    });

    it('verifies 301 status code on all next.config.mjs redirects', async () => {
      const nextConfig = (await import('../next.config.mjs')).default;
      const redirects = await nextConfig.redirects();

      for (const r of redirects) {
        assert.strictEqual(
          r.statusCode,
          301,
          `Redirect for ${r.source} must use statusCode: 301 instead of 308/302`
        );
      }
    });

    it('verifies legacy Urdu (/ur) routes redirect to English equivalents via 301', async () => {
      const nextConfig = (await import('../next.config.mjs')).default;
      const redirects = await nextConfig.redirects();

      const urHome = redirects.find(r => r.source === '/ur');
      assert.ok(urHome, 'Missing /ur redirect');
      assert.strictEqual(urHome.statusCode, 301);
      assert.strictEqual(urHome.destination, 'https://www.pakistantravel.agency/');

      const urSub = redirects.find(r => r.source === '/ur/:path*');
      assert.ok(urSub, 'Missing /ur/:path* redirect');
      assert.strictEqual(urSub.statusCode, 301);
      assert.strictEqual(urSub.destination, 'https://www.pakistantravel.agency/:path*');
    });

    it('verifies legacy /hotels and /rentals routes redirect to /tours via 301', async () => {
      const nextConfig = (await import('../next.config.mjs')).default;
      const redirects = await nextConfig.redirects();

      const hotels = redirects.find(r => r.source === '/hotels');
      assert.ok(hotels, 'Missing /hotels redirect');
      assert.strictEqual(hotels.statusCode, 301);
      assert.strictEqual(hotels.destination, 'https://www.pakistantravel.agency/tours');

      const rentals = redirects.find(r => r.source === '/rentals');
      assert.ok(rentals, 'Missing /rentals redirect');
      assert.strictEqual(rentals.statusCode, 301);
      assert.strictEqual(rentals.destination, 'https://www.pakistantravel.agency/tours');
    });
  });

  describe('H4.2: Noindex Protection for Portals, Query Params & Private Routes', () => {
    it('verifies headers configuration sets noindex on portal and query routes', async () => {
      const nextConfig = (await import('../next.config.mjs')).default;
      const headers = await nextConfig.headers();

      const portalHeaders = headers.find(h => h.source.includes('partner-hub|secure-admin'));
      assert.ok(portalHeaders, 'Missing portal headers rule');
      const robotHeader = portalHeaders.headers.find(h => h.key === 'X-Robots-Tag');
      assert.strictEqual(robotHeader.value, 'noindex, nofollow, noarchive');
    });

    it('verifies middleware enforces X-Robots-Tag noindex on search, auth, and query params', () => {
      const middlewareCode = fs.readFileSync('src/middleware.ts', 'utf8');
      assert.ok(middlewareCode.includes('path.startsWith("/secure-admin")'));
      assert.ok(middlewareCode.includes('path.startsWith("/partner-hub")'));
      assert.ok(middlewareCode.includes('path === "/search"'));
      assert.ok(middlewareCode.includes('hasQueryParams'));
      assert.ok(middlewareCode.includes('res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive")'));
    });
  });

  describe('H4.3: Sitemap.xml & Robots.ts Configuration', () => {
    it('verifies robots.txt references sitemap and does NOT list admin paths', async () => {
      const robotsFn = (await import('../src/app/robots.ts')).default;
      const config = robotsFn();

      assert.strictEqual(config.sitemap, 'https://www.pakistantravel.agency/sitemap.xml');
      const disallows = config.rules[0].disallow;
      assert.ok(disallows.includes('/api/'));
      assert.ok(disallows.includes('/search'));
      assert.ok(!disallows.includes('/secure-admin'), 'Admin path must NOT be enumerated in robots.txt');
      assert.ok(!disallows.includes('/partner-hub'), 'Partner hub must NOT be enumerated in robots.txt');
      assert.ok(!disallows.some(d => d.includes('destination=')), 'Query params must not be blocked in robots.txt');
    });
  });

  describe('H4.4: Titles and Meta Descriptions Compliance', () => {
    it('verifies all destination titles are under 60 chars rendered', () => {
      for (const [slug, d] of Object.entries(destinationsData)) {
        const renderedTitle = `${d.seoTitle} | PakistanTravel`;
        assert.ok(
          renderedTitle.length <= 60,
          `Destination ${slug} title exceeds 60 chars (${renderedTitle.length}): ${renderedTitle}`
        );
      }
    });

    it('verifies all destination descriptions are 140-155 characters without "verified"', () => {
      for (const [slug, d] of Object.entries(destinationsData)) {
        const desc = d.seoDescription;
        assert.ok(
          desc.length >= 140 && desc.length <= 155,
          `Destination ${slug} desc not in 140-155 range (${desc.length}): ${desc}`
        );
        assert.ok(!desc.toLowerCase().includes('verified'), `Destination ${slug} contains forbidden word "verified"`);
        assert.ok(desc.endsWith('.'), `Destination ${slug} desc must end with a period`);
      }
    });

    it('verifies all blog titles are under 60 chars rendered', () => {
      for (const post of blogPosts) {
        const renderedTitle = `${post.seoTitle} | PakistanTravel`;
        assert.ok(
          renderedTitle.length <= 60,
          `Blog post ${post.slug} title exceeds 60 chars (${renderedTitle.length}): ${renderedTitle}`
        );
      }
    });

    it('verifies all blog descriptions are 140-155 characters without "verified"', () => {
      for (const post of blogPosts) {
        const desc = post.metaDescription;
        assert.ok(
          desc.length >= 140 && desc.length <= 155,
          `Blog post ${post.slug} desc not in 140-155 range (${desc.length}): ${desc}`
        );
        assert.ok(!desc.toLowerCase().includes('verified'), `Blog post ${post.slug} contains forbidden word "verified"`);
        assert.ok(desc.endsWith('.'), `Blog post ${post.slug} desc must end with a period`);
      }
    });
  });

  describe('H4.5: Internal Link Safety', () => {
    it('verifies zero public pages link to /search', () => {
      const publicFiles = [
        'src/components/layout/Navbar.tsx',
        'src/components/layout/Footer.tsx',
        'src/app/page.tsx',
        'src/app/tours/page.tsx',
        'src/app/destinations/page.tsx',
        'src/app/destinations/[slug]/page.tsx',
        'src/app/blog/page.tsx',
        'src/app/blog/[slug]/page.tsx',
        'src/app/contact/page.tsx',
        'src/app/partner-info/page.tsx',
        'src/app/list-your-tour/page.tsx',
        'src/app/about/page.tsx',
        'src/app/faq/page.tsx',
        'src/app/terms/page.tsx',
        'src/app/privacy/page.tsx'
      ];

      for (const f of publicFiles) {
        if (fs.existsSync(f)) {
          const content = fs.readFileSync(f, 'utf8');
          assert.ok(!content.includes('href="/search"'), `${f} links to /search`);
          assert.ok(!content.includes("href='/search'"), `${f} links to /search`);
        }
      }
    });
  });
});
