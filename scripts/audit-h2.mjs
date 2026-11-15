const BASE_URL = "https://www.pakistantravel.agency";

async function fetchRoute(path) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "AntigravityH2Audit/1.0",
      "Cache-Control": "no-cache",
    },
    cache: "no-store",
  });
  const html = await res.text();
  return { status: res.status, html, age: res.headers.get("age") };
}

function extractHeadAndBody(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headLines = headMatch ? headMatch[1].trim().split("\n").slice(0, 40).map(l => l.trim()).filter(Boolean) : [];
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodySnippet = bodyMatch ? bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/\s+/g, " ").trim().slice(0, 300) : "";
  return { headLines, bodySnippet };
}

async function audit() {
  console.log("=== H2 PRODUCTION AUDIT: https://www.pakistantravel.agency ===\n");

  // 1. Check /terms
  console.log("--- 1. AUDITING /terms ---");
  const terms = await fetchRoute("/terms");
  console.log("Status:", terms.status, "| Age:", terms.age);
  console.log("Contains 'Last updated: November 15, 2026':", terms.html.includes("Last updated: November 15, 2026"));
  console.log("Contains 'independent local tour operators':", terms.html.includes("independent local tour operators"));
  console.log("Contains 'A flat 10% platform commission':", terms.html.includes("A flat 10% platform commission"));
  console.log("Contains '8. User Accounts & Security':", terms.html.includes("8. User Accounts &amp; Security") || terms.html.includes("8. User Accounts"));
  console.log("Contains '10. Dispute Resolution':", terms.html.includes("10. Dispute Resolution"));
  console.log("Contains '11. Governing Law & Jurisdiction':", terms.html.includes("11. Governing Law"));
  console.log("Contains 'Islamic Republic of Pakistan':", terms.html.includes("Islamic Republic of Pakistan"));
  console.log("Contains '12. Modifications to Terms':", terms.html.includes("12. Modifications to Terms"));

  // 2. Check /list-your-tour
  console.log("\n--- 2. AUDITING /list-your-tour ---");
  const listTour = await fetchRoute("/list-your-tour");
  console.log("Status:", listTour.status, "| Age:", listTour.age);
  console.log("Contains 'Flat 10% Platform Commission':", listTour.html.includes("Flat 10% Platform Commission"));
  console.log("Contains '10% Platform Commission':", listTour.html.includes("10%") && listTour.html.includes("Platform Commission"));
  console.log("Contains '0.1%':", listTour.html.includes("0.1%"));
  console.log("Contains 'customized tour commission':", /customized.*tour commission/i.test(listTour.html));

  // 3. Check / (Homepage)
  console.log("\n--- 3. AUDITING / (Homepage) ---");
  const home = await fetchRoute("/");
  console.log("Status:", home.status, "| Age:", home.age);
  console.log("Contains 'departures from Islamabad, Lahore, and Karachi':", home.html.includes("departures from Islamabad, Lahore, and Karachi"));
  console.log("Contains 'scheduled departures from Islamabad':", home.html.includes("scheduled departures from Islamabad"));
  console.log("Contains 'Verified Tour Operator Marketplace':", home.html.includes("Verified Tour Operator Marketplace"));
  console.log("Contains 'Northern Pakistan Tour Marketplace':", home.html.includes("Northern Pakistan Tour Marketplace"));

  // 4. Check /tours
  console.log("\n--- 4. AUDITING /tours ---");
  const tours = await fetchRoute("/tours");
  console.log("Status:", tours.status, "| Age:", tours.age);
  console.log("Contains 'verified independent operators with guaranteed departures':", tours.html.includes("verified independent operators with guaranteed departures"));
  console.log("Contains 'spring and summer departures':", tours.html.includes("spring and summer departures"));
  console.log("Available Tour Packages Count in HTML:", (tours.html.match(/Available Tour Packages \((\d+)\)/) || [])[1] || "N/A");

  // 5. Check /listing/hunza-valley-attabad-2640
  console.log("\n--- 5. AUDITING /listing/hunza-valley-attabad-2640 ---");
  const listing = await fetchRoute("/listing/hunza-valley-attabad-2640");
  console.log("Status:", listing.status, "| Age:", listing.age);
  console.log("Contains 'Typically responds within 2 hours':", listing.html.includes("Typically responds within 2 hours"));
  console.log("Contains 'Certified Alpine Guide':", listing.html.includes("Certified Alpine Guide"));
  console.log("Contains 'Local Mountain Guide':", listing.html.includes("Local Mountain Guide"));
  console.log("Contains 'Free cancellation until 3 days before':", listing.html.includes("Free cancellation until 3 days before"));
  console.log("Contains 7+ days cancellation policy:", listing.html.includes("100% refund for cancellations made 7 or more days before departure"));
  console.log("Partner Since Year in HTML:", (listing.html.match(/Partner since (\d{4})/) || [])[1] || "Hidden/None");

  // 6. Check /blog/skardu-trip-cost-2026
  console.log("\n--- 6. AUDITING Blog Post Author ---");
  const blog = await fetchRoute("/blog/skardu-trip-cost-2026");
  console.log("Status:", blog.status, "| Age:", blog.age);
  console.log("Contains 'Regional Destination Specialists':", blog.html.includes("Regional Destination Specialists"));
  console.log("Contains 'PakistanTravel Editorial Team':", blog.html.includes("PakistanTravel Editorial Team"));
}

audit().catch(console.error);
