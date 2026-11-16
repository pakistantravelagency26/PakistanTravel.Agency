import https from 'https';

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });
  return await res.text();
}

function extractHead40(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return 'No <head> tag found';
  const lines = headMatch[1].trim().split('\n').map(l => l.trim()).filter(Boolean);
  return lines.slice(0, 40).join('\n');
}

async function run() {
  const pages = [
    { name: 'Listing: /listing/hunza-valley-attabad-2640', url: 'https://www.pakistantravel.agency/listing/hunza-valley-attabad-2640' },
    { name: 'Destination: /destinations/hunza', url: 'https://www.pakistantravel.agency/destinations/hunza' },
    { name: 'Blog: /blog/skardu-trip-cost-2026', url: 'https://www.pakistantravel.agency/blog/skardu-trip-cost-2026' },
    { name: 'How Booking Works: /how-booking-works', url: 'https://www.pakistantravel.agency/how-booking-works' },
  ];

  for (const p of pages) {
    console.log(`\n======================================================`);
    console.log(`PAGE: ${p.name}`);
    console.log(`URL: ${p.url}`);
    console.log(`======================================================`);
    const html = await fetchHtml(p.url);
    console.log('\n--- FIRST 40 LINES OF RENDERED <HEAD> ---');
    console.log(extractHead40(html));
  }
}

await run();
