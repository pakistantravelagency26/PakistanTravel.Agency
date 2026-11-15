async function verifyPartnerInfoLive() {
  const res = await fetch("https://www.pakistantravel.agency/partner-info", { cache: "no-store" });
  const html = await res.text();
  console.log("Has stray math \\ge:", html.includes("\\ge") || html.includes("$\\ge"));
  console.log("Has '100% refund 7 or more days':", html.includes("100% refund 7 or more days before departure"));
  console.log("Has 'hotel inclusions':", html.includes("hotel inclusions"));
  console.log("Has 'accommodation standards':", html.includes("accommodation standards"));
  
  const snippet = html.match(/Review the day-by-day itinerary[\s\S]*?non-refundable within 72 hours/);
  console.log("\nLive snippet:\n", snippet ? snippet[0] : "Snippet not found");
}
verifyPartnerInfoLive();
