import https from "https";

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        const canonical = data.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)?.[1] || "NONE";
        const ogUrl = data.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']*)["']/i)?.[1] || "NONE";
        const hasGTM = data.includes("GTM-PRQQWCK8");
        const hasCookie = data.includes("Cookie Preferences") || data.includes("CookieConsent") || data.includes("cookie-consent");
        const hasVerify = data.includes("google-site-verification");
        const hasUrdu = /[\u0600-\u06FF]/.test(data);
        const hasHotels = /hotels/i.test(data);
        const has4x4Rentals = data.includes("4x4 Mountain Jeeps & Rentals") || data.includes("Jeeps & Rentals");
        const title = data.match(/<title>([^<]*)<\/title>/i)?.[1] || "NONE";

        // Head lines
        const headMatch = data.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
        const headContent = headMatch ? headMatch[1] : "";
        const headLines = headContent.split("\n").map(l => l.trim()).filter(Boolean).slice(0, 40);

        // Body first lines
        const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1] : "";
        const bodyLines = bodyContent.split("\n").map(l => l.trim()).filter(Boolean).slice(0, 20);

        resolve({
          url,
          status: res.statusCode,
          title,
          canonical,
          ogUrl,
          hasGTM,
          hasCookie,
          hasVerify,
          hasUrdu,
          hasHotels,
          has4x4Rentals,
          headLines,
          bodyLines
        });
      });
    }).on("error", (err) => resolve({ url, error: err.message }));
  });
}

async function main() {
  const routes = [
    "/",
    "/tours",
    "/destinations",
    "/destinations/hunza",
    "/destinations/skardu",
    "/destinations/swat",
    "/destinations/kumrat",
    "/destinations/murree",
    "/destinations/neelum",
    "/blog",
    "/blog/hunza-best-time-to-visit",
    "/faq",
    "/terms",
    "/privacy",
    "/about",
    "/contact",
    "/partner-info",
    "/list-your-tour",
    "/listing/hunza-valley-attabad-2640"
  ];

  for (const r of routes) {
    const res = await checkUrl("https://www.pakistantravel.agency" + r);
    console.log(JSON.stringify({
      route: r,
      status: res.status,
      title: res.title,
      canonical: res.canonical,
      ogUrl: res.ogUrl,
      hasGTM: res.hasGTM,
      hasCookie: res.hasCookie,
      hasVerify: res.hasVerify,
      hasUrdu: res.hasUrdu,
      hasHotels: res.hasHotels,
      has4x4Rentals: res.has4x4Rentals
    }));
  }
}

main();
