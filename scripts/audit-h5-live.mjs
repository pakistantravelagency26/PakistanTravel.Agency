const routes = [
  '/',
  '/how-booking-works',
  '/safety-and-permits',
  '/privacy',
  '/about',
  '/about/editorial-policy',
  '/destinations/fairy-meadows',
  '/destinations/hunza',
  '/destinations/skardu',
  '/destinations/swat',
  '/tours/hunza-tour-packages',
  '/tours/neelum-valley-tour-packages',
  '/blog',
  '/blog/skardu-trip-cost-2026'
];

async function check() {
  console.log(`Checking production routes on https://www.pakistantravel.agency ...\n`);
  for (const r of routes) {
    const url = `https://www.pakistantravel.agency${r}`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'H5-Live-Audit-Agent' } });
      const html = await res.text();
      const status = res.status;
      
      const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      const head = headMatch ? headMatch[1] : '';
      
      const titleMatch = head.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : 'NO TITLE';
      
      const canonicalMatch = head.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
      const canonical = canonicalMatch ? canonicalMatch[1] : 'NO CANONICAL';
      
      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'NO H1';

      console.log(`ROUTE: ${r}`);
      console.log(`  Status: ${status}`);
      console.log(`  Title:  ${title}`);
      console.log(`  Canon:  ${canonical}`);
      console.log(`  H1:     ${h1}`);
      console.log('');
    } catch (e) {
      console.log(`ROUTE: ${r} -> ERROR: ${e.message}`);
    }
  }
}

check();
