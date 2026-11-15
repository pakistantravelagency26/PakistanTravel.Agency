async function checkListing(slug) {
  const url = `https://www.pakistantravel.agency/listing/${slug}`;
  const res = await fetch(url, { cache: "no-store" });
  console.log(`\n=== CHECKING LISTING: ${slug} (Status: ${res.status}) ===`);
  const html = await res.text();

  // 1. Duration Days/Nights
  const durationMatch = html.match(/(\d+\s*Days\s*\/\s*\d+\s*Nights|\d+\s*Days)/i);
  console.log("1. Duration text:", durationMatch ? durationMatch[0] : "None");

  // 2. Urdu in booking widget or page
  const urduMatch = html.match(/[\u0600-\u06FF]+/g);
  console.log("2. Urdu detected:", urduMatch ? urduMatch.slice(0, 5) : "None (Clean English)");

  // 3. Babusar route note in Nov-Dec
  const babusarNote = html.match(/Babusar[\s\S]{0,150}(?:closed|divert|Besham|winter|KKH)/i);
  console.log("3. Babusar winter route alert:", babusarNote ? babusarNote[0].replace(/\s+/g, " ") : "Not found");

  // 4. Vendor card
  const vendorMatch = html.match(/(?:Partner since|Responds in|Rating|4\.95)[\s\S]{0,100}/i);
  console.log("4. Vendor card text:", vendorMatch ? vendorMatch[0].replace(/\s+/g, " ") : "Clean");

  // 5. Inclusions
  const inclusionsMatch = html.match(/What's Included[\s\S]{0,300}/i) || html.match(/Package Inclusions[\s\S]{0,300}/i);
  console.log("5. Inclusions section snippet:", inclusionsMatch ? inclusionsMatch[0].replace(/\s+/g, " ") : "None");

  // 6. Title
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  console.log("6. Listing Title:", titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "None");
}

async function run() {
  await checkListing("hunza-valley-attabad-2640");
  await checkListing("hunza-valley-attabad-5207");
}

run();
