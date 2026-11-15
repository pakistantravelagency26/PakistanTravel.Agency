import fs from 'fs';

async function runLiveAudit() {
  console.log('=== PART H4 LIVE PRODUCTION AUDIT ===\n');

  // 1. Redirects Check
  const redirectUrls = [
    'http://pakistantravel.agency',
    'http://www.pakistantravel.agency',
    'https://pakistantravel.agency',
    'https://pakistan-travel-agency.vercel.app',
    'https://www.pakistantravel.agency/ur',
    'https://www.pakistantravel.agency/ur/tours',
    'https://www.pakistantravel.agency/hotels',
    'https://www.pakistantravel.agency/rentals',
    'https://www.pakistantravel.agency/activities'
  ];

  console.log('--- 1. REDIRECTS (301 PERMANENT REDIRECTS) ---');
  for (const url of redirectUrls) {
    try {
      const res = await fetch(url, { redirect: 'manual' });
      console.log(`${url} -> Status: ${res.status} | Location: ${res.headers.get('location')}`);
    } catch (e) {
      console.log(`${url} -> Error: ${e.message}`);
    }
  }

  // 2. Private Portals & Query Parameters X-Robots-Tag
  const noindexUrls = [
    'https://www.pakistantravel.agency/partner-hub',
    'https://www.pakistantravel.agency/secure-admin',
    'https://www.pakistantravel.agency/login',
    'https://www.pakistantravel.agency/register',
    'https://www.pakistantravel.agency/search',
    'https://www.pakistantravel.agency/tours?destination=hunza',
    'https://www.pakistantravel.agency/listing/non-existent-tour-9999'
  ];

  console.log('\n--- 2. NOINDEX & X-ROBOTS-TAG HEADERS ---');
  for (const url of noindexUrls) {
    try {
      const res = await fetch(url, { redirect: 'manual' });
      console.log(`${url} -> Status: ${res.status} | X-Robots-Tag: ${res.headers.get('x-robots-tag')}`);
    } catch (e) {
      console.log(`${url} -> Error: ${e.message}`);
    }
  }

  // 3. Sitemap & Robots
  console.log('\n--- 3. ROBOTS.TXT & SITEMAP.XML ---');
  try {
    const robotsRes = await fetch('https://www.pakistantravel.agency/robots.txt');
    const robotsText = await robotsRes.text();
    console.log('robots.txt status:', robotsRes.status);
    console.log('robots.txt content:\n', robotsText.trim());

    const sitemapRes = await fetch('https://www.pakistantravel.agency/sitemap.xml');
    console.log('\nsitemap.xml status:', sitemapRes.status);
    const sitemapText = await sitemapRes.text();
    const urls = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    console.log(`Total URLs in sitemap: ${urls.length}`);
    console.log('Sample URLs from sitemap:', urls.slice(0, 5));
  } catch (e) {
    console.log('Error fetching robots/sitemap:', e.message);
  }

  // 4. Titles and Descriptions Table
  console.log('\n--- 4. TITLES & META DESCRIPTIONS AUDIT TABLE ---');
  console.log('| Route | Title | Title Len | Description | Desc Len | Status |');
  console.log('|---|---|---|---|---|---|');

  const routes = [
    '/',
    '/tours',
    '/destinations',
    '/destinations/hunza',
    '/destinations/skardu',
    '/destinations/swat',
    '/destinations/kumrat',
    '/destinations/murree',
    '/destinations/neelum',
    '/blog',
    '/blog/hunza-best-time-to-visit',
    '/blog/skardu-trip-cost-2026',
    '/faq',
    '/terms',
    '/privacy',
    '/about',
    '/about/editorial-policy',
    '/contact',
    '/partner-info',
    '/list-your-tour',
    '/listing/hunza-valley-attabad-2640',
    '/listing/hunza-valley-attabad-5207'
  ];

  for (const r of routes) {
    try {
      const res = await fetch('https://www.pakistantravel.agency' + r, { cache: 'no-store' });
      const html = await res.text();
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
      const title = titleMatch ? titleMatch[1] : 'NONE';
      const desc = descMatch ? descMatch[1] : 'NONE';

      const titleValid = title.length > 0 && title.length <= 60 && !title.includes('PakistanTravel | PakistanTravel');
      const descValid = desc.length >= 140 && desc.length <= 155 && !desc.toLowerCase().includes('verified');
      const status = titleValid && descValid ? 'PASS' : 'WARN';

      console.log(`| \`${r}\` | ${title.slice(0, 40)} | ${title.length} | ${desc.slice(0, 45)}... | ${desc.length} | ${status} |`);
    } catch (e) {
      console.log(`| \`${r}\` | ERROR | - | ${e.message} | - | FAIL |`);
    }
  }
}

runLiveAudit();
