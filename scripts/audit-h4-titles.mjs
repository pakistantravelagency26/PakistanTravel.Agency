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
  '/blog/autumn-in-hunza-valley-complete-guide',
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

async function audit() {
  for (const r of routes) {
    try {
      const res = await fetch('https://www.pakistantravel.agency' + r);
      const text = await res.text();
      const titleMatch = text.match(/<title>([^<]*)<\/title>/i);
      const descMatch = text.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                        text.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
      const title = titleMatch ? titleMatch[1] : 'NONE';
      const desc = descMatch ? descMatch[1] : 'NONE';
      console.log(r);
      console.log('  Title (' + title.length + '): ' + title);
      console.log('  Desc  (' + desc.length + '): ' + desc);
    } catch (e) {
      console.log(r, 'ERROR', e.message);
    }
  }
}
audit();
