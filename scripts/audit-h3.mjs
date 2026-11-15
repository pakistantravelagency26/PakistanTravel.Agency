const BASE_URL = "https://www.pakistantravel.agency";

async function fetchRoute(path) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "AntigravityH3Audit/1.0",
      "Cache-Control": "no-cache",
    },
    cache: "no-store",
  });
  const html = await res.text();
  return { status: res.status, html, age: res.headers.get("age"), vercelId: res.headers.get("x-vercel-id") };
}

async function audit() {
  console.log("=== H3 PRODUCTION AUDIT: https://www.pakistantravel.agency ===\n");

  // 1. Audit Listing 1: hunza-valley-attabad-2640
  console.log("--- 1. AUDITING /listing/hunza-valley-attabad-2640 ---");
  const l1 = await fetchRoute("/listing/hunza-valley-attabad-2640");
  console.log("Status:", l1.status, "| Age:", l1.age);
  console.log("Title: '8-Day Autumn Classic Hunza & Attabad Lake Tour':", l1.html.includes("8-Day Autumn Classic Hunza &amp; Attabad Lake Tour") || l1.html.includes("8-Day Autumn Classic Hunza & Attabad Lake Tour"));
  console.log("Duration '8 Days / 7 Nights':", l1.html.includes("8 Days / 7 Nights"));
  console.log("Nights <= Days - 1:", !l1.html.includes("8 Days / 9 Nights"));
  console.log("Departure '2026-11-15 → 2026-11-22':", l1.html.includes("2026-11-15") && l1.html.includes("2026-11-22"));
  console.log("Tier Sharing Room (PKR 49,500):", l1.html.includes("49,500"));
  console.log("Tier Private Room (PKR 104,000):", l1.html.includes("104,000"));
  console.log("Tier Solo Room (PKR 68,000):", l1.html.includes("68,000"));
  console.log("Structured Itinerary present:", l1.html.includes("Day-by-Day Itinerary"));
  console.log("Route Stops present:", l1.html.includes("Tour Journey &amp; Sightseeing Route") || l1.html.includes("Tour Journey & Sightseeing Route"));
  console.log("Babusar winter advisory present:", l1.html.includes("Babusar Pass is closed during winter") || l1.html.includes("Babusar Pass"));
  console.log("Identification & Permits present:", l1.html.includes("Identification, Permits &amp; Checkpoints") || l1.html.includes("Identification, Permits & Checkpoints"));
  console.log("What to Bring checklist present:", l1.html.includes("What to Bring"));
  console.log("Vendor Business Name 'Tours Khourshem':", l1.html.includes("Tours Khourshem"));
  console.log("Urdu characters count:", (l1.html.match(/[\u0600-\u06FF]/g) || []).length);

  // 2. Audit Listing 2: hunza-valley-attabad-5207
  console.log("\n--- 2. AUDITING /listing/hunza-valley-attabad-5207 ---");
  const l2 = await fetchRoute("/listing/hunza-valley-attabad-5207");
  console.log("Status:", l2.status, "| Age:", l2.age);
  console.log("Title: '10-Day Grand Hunza Valley, Khunjerab Pass & Nagar Tour':", l2.html.includes("10-Day Grand Hunza Valley, Khunjerab Pass &amp; Nagar Tour") || l2.html.includes("10-Day Grand Hunza Valley, Khunjerab Pass & Nagar Tour"));
  console.log("Duration '10 Days / 9 Nights':", l2.html.includes("10 Days / 9 Nights"));
  console.log("Departure '2026-12-06 → 2026-12-15':", l2.html.includes("2026-12-06") && l2.html.includes("2026-12-15"));
  console.log("Tier Sharing Room (PKR 58,000):", l2.html.includes("58,000"));
  console.log("Tier Private Room (PKR 122,000):", l2.html.includes("122,000"));
  console.log("Tier Solo Room (PKR 79,000):", l2.html.includes("79,000"));
  console.log("Structured Itinerary present:", l2.html.includes("Day-by-Day Itinerary"));
  console.log("Vendor Business Name 'Tours Khourshem':", l2.html.includes("Tours Khourshem"));
  console.log("Urdu characters count:", (l2.html.match(/[\u0600-\u06FF]/g) || []).length);

  // 3. Audit /tours
  console.log("\n--- 3. AUDITING /tours ---");
  const tours = await fetchRoute("/tours");
  console.log("Status:", tours.status, "| Age:", tours.age);
  console.log("Contains both differentiated tours:", tours.html.includes("8-Day Autumn Classic") && tours.html.includes("10-Day Grand Hunza"));
}

audit().catch(console.error);
