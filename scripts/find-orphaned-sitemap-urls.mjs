import fs from "fs";

// Load sitemap URLs
const sitemapXml = fs.readFileSync("src/app/sitemap.ts", "utf8");

async function crawlAndCheck() {
  const sitemapRes = await fetch("https://www.pakistantravel.agency/sitemap.xml");
  const xml = await sitemapRes.text();
  const sitemapUrls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1]);

  console.log(`Loaded ${sitemapUrls.length} URLs from sitemap.xml`);

  // Crawl each sitemap URL and extract internal links
  const inboundCount = {};
  sitemapUrls.forEach(u => { inboundCount[u] = new Set(); });

  for (const pageUrl of sitemapUrls) {
    try {
      const res = await fetch(pageUrl);
      const html = await res.text();
      // Find all hrefs
      const hrefMatches = Array.from(html.matchAll(/href=["'](\/[^"'#?]*|https:\/\/www\.pakistantravel\.agency\/[^"'#?]*)/g)).map(m => m[1]);
      for (let href of hrefMatches) {
        if (href.startsWith("/")) {
          href = `https://www.pakistantravel.agency${href === "/" ? "" : href}`;
        }
        // Normalize trailing slash
        href = href.replace(/\/$/, "");
        if (href === "https://www.pakistantravel.agency") href = "https://www.pakistantravel.agency"; // normalized

        const matchingSitemap = sitemapUrls.find(s => s.replace(/\/$/, "") === href);
        if (matchingSitemap && matchingSitemap !== pageUrl) {
          inboundCount[matchingSitemap].add(pageUrl);
        }
      }
    } catch (e) {
      console.error(`Failed to fetch ${pageUrl}:`, e.message);
    }
  }

  console.log("\n=== INBOUND INTERNAL LINKS PER SITEMAP URL ===");
  const orphaned = [];
  const lowLinked = [];

  for (const url of sitemapUrls) {
    const fromPages = Array.from(inboundCount[url]);
    const count = fromPages.length;
    if (count === 0) {
      orphaned.push(url);
    } else if (count === 1) {
      lowLinked.push({ url, from: fromPages[0] });
    }
    console.log(`${url} | Inbound: ${count} | From: ${fromPages.map(p => p.replace("https://www.pakistantravel.agency", "") || "/").join(", ")}`);
  }

  console.log(`\nOrphaned pages (0 inbound internal links): ${orphaned.length}`);
  console.log(orphaned);
  console.log(`\nSingle internal link pages (1 inbound link): ${lowLinked.length}`);
  console.log(lowLinked);
}

crawlAndCheck();
