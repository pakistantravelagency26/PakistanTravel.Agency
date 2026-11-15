import fs from "fs";

const BASE_URL = "https://www.pakistantravel.agency";

async function auditAllRoutes() {
  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`, { cache: "no-store" });
  const xml = await sitemapRes.text();
  const sitemapUrls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1]);

  console.log(`Auditing ${sitemapUrls.length} routes from sitemap...`);

  const results = [];

  for (const url of sitemapUrls) {
    const route = url.replace(BASE_URL, "") || "/";
    try {
      const res = await fetch(url, { cache: "no-store" });
      const html = await res.text();

      // Canonical
      const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                             html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
      const canonical = canonicalMatch ? canonicalMatch[1] : "MISSING";

      // og:url
      const ogUrlMatch = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:url["']/i);
      const ogUrl = ogUrlMatch ? ogUrlMatch[1] : "MISSING";

      // og:image
      const ogImgMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      const ogImg = ogImgMatch ? ogImgMatch[1] : "MISSING";
      const ownHostImg = ogImg.startsWith(BASE_URL) || ogImg.startsWith("/");

      // twitter:card
      const twCardMatch = html.match(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:card["']/i);
      const twCard = twCardMatch ? twCardMatch[1] : "MISSING";

      // GTM
      const gtmPresent = html.includes("googletagmanager.com/gtm.js") || html.includes("GTM-");

      // Cookie Preferences
      const cookiePresent = html.includes("Cookie Preferences") || html.includes("cookie_consent");

      // verification meta
      const verifPresent = html.includes('name="google-site-verification"');

      // Urdu present
      const urduPresent = html.includes("اردو") || /[\u0600-\u06FF]/.test(html.slice(0, 5000));

      // Hotel/Rental present in visible content (ignore next/static script hashes)
      // Check head and main layout
      const bodyContent = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
      const hotelRentalPresent = /luxury hotels & resorts|mountain jeeps & rentals|list your tour \/ hotel/i.test(bodyContent);

      // Title
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : "";
      const titleLength = title.length;

      results.push({
        route,
        canonical: canonical === url ? "MATCH" : canonical,
        ogUrl: ogUrl === url ? "MATCH" : ogUrl,
        ownHostImg: ownHostImg ? "YES" : "NO (" + ogImg.slice(0, 25) + "…)",
        twCard,
        gtm: gtmPresent ? "YES" : "NO",
        cookie: cookiePresent ? "YES" : "NO",
        verif: verifPresent ? "YES" : "NO",
        urdu: urduPresent ? "YES" : "NO",
        hotelRental: hotelRentalPresent ? "YES" : "NO",
        titleLen: titleLength,
      });
    } catch (e) {
      results.push({
        route,
        error: e.message
      });
    }
  }

  console.table(results.slice(0, 25));
  console.table(results.slice(25));
}

auditAllRoutes().catch(console.error);
