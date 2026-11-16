import https from 'https';

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });
  const text = await res.text();
  return { status: res.status, text };
}

async function run() {
  console.log('================================================================');
  console.log('PART I3: LIVE PRODUCTION VERIFICATION (https://www.pakistantravel.agency)');
  console.log('================================================================\n');

  // 1. Check /og endpoint status
  const ogRes = await fetch('https://www.pakistantravel.agency/og?title=Hunza+Travel+Guide&category=DESTINATION');
  console.log(`[TEST 1: Dynamic /og endpoint] Status: ${ogRes.status}, Content-Type: ${ogRes.headers.get('content-type')}`);

  // 2. Check /destinations
  console.log('\n--- 2. Checking /destinations ---');
  const dRes = await fetchPage('https://www.pakistantravel.agency/destinations');
  console.log(`Status: ${dRes.status}`);
  const dOgMatch = dRes.text.match(/<meta property="og:image" content="([^"]+)"/);
  console.log(`og:image: ${dOgMatch ? dOgMatch[1] : 'NOT FOUND'}`);

  // 3. Check /destinations/hunza
  console.log('\n--- 3. Checking /destinations/hunza ---');
  const dhRes = await fetchPage('https://www.pakistantravel.agency/destinations/hunza');
  console.log(`Status: ${dhRes.status}`);
  const dhOgMatch = dhRes.text.match(/<meta property="og:image" content="([^"]+)"/);
  console.log(`og:image: ${dhOgMatch ? dhOgMatch[1] : 'NOT FOUND'}`);

  // 4. Check /blog/skardu-trip-cost-2026
  console.log('\n--- 4. Checking /blog/skardu-trip-cost-2026 ---');
  const bRes = await fetchPage('https://www.pakistantravel.agency/blog/skardu-trip-cost-2026');
  console.log(`Status: ${bRes.status}`);
  const bOgMatch = bRes.text.match(/<meta property="og:image" content="([^"]+)"/);
  console.log(`og:image: ${bOgMatch ? bOgMatch[1] : 'NOT FOUND'}`);

  // 5. Check /listing/hunza-valley-attabad-2640
  console.log('\n--- 5. Checking /listing/hunza-valley-attabad-2640 ---');
  const lRes = await fetchPage('https://www.pakistantravel.agency/listing/hunza-valley-attabad-2640');
  console.log(`Status: ${lRes.status}`);
  const lOgMatch = lRes.text.match(/<meta property="og:image" content="([^"]+)"/);
  console.log(`og:image: ${lOgMatch ? lOgMatch[1] : 'NOT FOUND'}`);

  // 6. Check Listing 2640 body for claims & bugs
  const hasUrdu = /[\u0600-\u06FF]/.test(lRes.text);
  const hasBabusarAlert = lRes.text.includes('Babusar') && (lRes.text.includes('winter') || lRes.text.includes('Closed'));
  const hasPartner2026 = lRes.text.includes('Partner since 2026');
  const hasOldGuaranteed = lRes.text.includes('Guaranteed seat reservation') || lRes.text.includes('Cancellation Guarantee');
  const hasNewConfirmed = lRes.text.includes('Confirmed seat reservation') && lRes.text.includes('Cancellation Policy');
  console.log(`- Duration text present: ${lRes.text.includes('8 Days / 7 Nights')}`);
  console.log(`- Urdu characters detected: ${hasUrdu ? 'YES (FAIL)' : 'NONE (PASS)'}`);
  console.log(`- Babusar winter alert present: ${hasBabusarAlert ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`- Vendor card 'Partner since 2026': ${hasPartner2026 ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`- Unprovable claims removed: ${!hasOldGuaranteed && hasNewConfirmed ? 'YES (PASS)' : 'FAIL'}`);

  // 7. Check /how-booking-works
  console.log('\n--- 6. Checking /how-booking-works ---');
  const hbwRes = await fetchPage('https://www.pakistantravel.agency/how-booking-works');
  console.log(`Status: ${hbwRes.status}`);
  console.log(`- 'Standard Platform Cancellation Policy' present: ${hbwRes.text.includes('Standard Platform Cancellation Policy') ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`- 'Cancellation Guarantee' absent: ${!hbwRes.text.includes('Cancellation Guarantee') ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`- 'direct operator contact' present: ${hbwRes.text.includes('direct operator contact') ? 'YES (PASS)' : 'NO (FAIL)'}`);
}

await run();
