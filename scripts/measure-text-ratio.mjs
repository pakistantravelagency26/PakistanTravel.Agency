async function measureRatio() {
  const urls = [
    "https://www.pakistantravel.agency/",
    "https://www.pakistantravel.agency/destinations",
    "https://www.pakistantravel.agency/terms",
    "https://www.pakistantravel.agency/faq",
    "https://www.pakistantravel.agency/destinations/hunza"
  ];

  console.log("=== TEXT TO HTML RATIO MEASUREMENTS ===");
  for (const u of urls) {
    const res = await fetch(u);
    const html = await res.text();
    const totalBytes = Buffer.byteLength(html, "utf8");

    // Extract visible text (strip scripts, styles, tags)
    const textOnly = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const textBytes = Buffer.byteLength(textOnly, "utf8");
    const ratio = ((textBytes / totalBytes) * 100).toFixed(2);

    // Analyze contributors
    const scriptMatches = html.match(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi) || [];
    const scriptBytes = scriptMatches.reduce((acc, s) => acc + Buffer.byteLength(s, "utf8"), 0);
    const scriptPercent = ((scriptBytes / totalBytes) * 100).toFixed(2);

    console.log(`\nURL: ${u}`);
    console.log(`  Total HTML size: ${(totalBytes / 1024).toFixed(1)} KB`);
    console.log(`  Visible text size: ${(textBytes / 1024).toFixed(1)} KB`);
    console.log(`  Text-to-HTML Ratio: ${ratio}%`);
    console.log(`  Script payloads size: ${(scriptBytes / 1024).toFixed(1)} KB (${scriptPercent}% of page)`);
  }
}

measureRatio();
