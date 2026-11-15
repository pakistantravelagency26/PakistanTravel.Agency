async function checkLiveListYourTour() {
  const res = await fetch("https://www.pakistantravel.agency/list-your-tour", { cache: "no-store" });
  console.log("Status:", res.status);
  const html = await res.text();
  console.log("HTML length:", html.length);
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  console.log("Title:", titleMatch ? titleMatch[1] : "No title");
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/);
  console.log("Canonical:", canonicalMatch ? canonicalMatch[0] : "No canonical");
  console.log("Has Urdu link:", html.includes("اردو"));
  console.log("Has Hotel/Rental:", /hotel|rental/i.test(html));
  console.log("\nFirst 40 lines of HTML:");
  console.log(html.split("\n").slice(0, 40).join("\n"));
}
checkLiveListYourTour();
