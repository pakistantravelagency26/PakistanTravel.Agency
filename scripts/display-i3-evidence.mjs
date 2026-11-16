import https from 'https';

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });
  return await res.text();
}

function cleanHead(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return '';
  // Split on tags or newlines
  const tags = headMatch[1].match(/<[^>]+>/g) || [];
  return tags.slice(0, 40).join('\n');
}

async function main() {
  const listingUrl = 'https://www.pakistantravel.agency/listing/hunza-valley-attabad-2640';
  const destUrl = 'https://www.pakistantravel.agency/destinations/hunza';
  const blogUrl = 'https://www.pakistantravel.agency/blog/skardu-trip-cost-2026';
  const howUrl = 'https://www.pakistantravel.agency/how-booking-works';

  console.log('=== LISTING HEAD (40 tags) ===');
  const lHtml = await fetchHtml(listingUrl);
  console.log(cleanHead(lHtml));

  console.log('\n=== LISTING BODY (Relevant snippets: Duration, Vendor, Route, Policy) ===');
  const durMatch = lHtml.match(/<div[^>]*>[\s\S]*?8 Days \/ 7 Nights[\s\S]*?<\/div>/);
  if (durMatch) console.log('Duration snippet:\n', durMatch[0].slice(0, 200));
  const babusarMatch = lHtml.match(/<div[^>]*>[\s\S]*?Babusar[\s\S]*?<\/div>/);
  if (babusarMatch) console.log('Babusar snippet:\n', babusarMatch[0].slice(0, 250));
  const vendorMatch = lHtml.match(/<div[^>]*>[\s\S]*?Partner since 2026[\s\S]*?<\/div>/);
  if (vendorMatch) console.log('Vendor snippet:\n', vendorMatch[0].slice(0, 250));
  const cancelMatch = lHtml.match(/<div[^>]*>[\s\S]*?Cancellation Policy[\s\S]*?<\/div>/);
  if (cancelMatch) console.log('Cancellation Policy snippet:\n', cancelMatch[0].slice(0, 250));

  console.log('\n=== DESTINATIONS/HUNZA HEAD (40 tags) ===');
  const dHtml = await fetchHtml(destUrl);
  console.log(cleanHead(dHtml));

  console.log('\n=== BLOG/SKARDU-TRIP-COST-2026 HEAD (40 tags) ===');
  const bHtml = await fetchHtml(blogUrl);
  console.log(cleanHead(bHtml));

  console.log('\n=== HOW BOOKING WORKS BODY (Relevant policy snippet) ===');
  const hHtml = await fetchHtml(howUrl);
  const hPolicyMatch = hHtml.match(/<h2[^>]*>Standard Platform Cancellation Policy<\/h2>[\s\S]*?<\/p>/);
  if (hPolicyMatch) console.log('Policy snippet:\n', hPolicyMatch[0].slice(0, 300));
  const voucherMatch = hHtml.match(/<p[^>]*>[\s\S]*?direct operator contact phone numbers[\s\S]*?<\/p>/);
  if (voucherMatch) console.log('Voucher snippet:\n', voucherMatch[0].slice(0, 300));
}

await main();
