import https from "https";

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        resolve({
          url,
          status: res.statusCode,
          age: res.headers["age"],
          cache: res.headers["x-vercel-cache"],
          canonical: data.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)?.[1] || "NONE",
          ogUrl: data.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']*)["']/i)?.[1] || "NONE",
          hasGTM: data.includes("GTM-PRQQWCK8"),
          hasCookie: data.includes("Cookie Preferences"),
          hasVerify: data.includes("google-site-verification"),
          hasUrdu: /[\u0600-\u06FF]/.test(data),
          hasHotelsNav: data.includes("type=HOTEL") || data.includes("/hotels"),
          hasLuxuryHotels: data.includes("Luxury Hotels"),
          has4x4Rentals: data.includes("4x4 Mountain Jeeps & Rentals")
        });
      });
    });
  });
}

async function main() {
  const urls = [
    "https://www.pakistantravel.agency/contact",
    "https://www.pakistantravel.agency/partner-info",
    "https://www.pakistantravel.agency/list-your-tour",
    "https://www.pakistantravel.agency/blog",
    "https://www.pakistantravel.agency/tours",
    "https://www.pakistantravel.agency/"
  ];
  for (const u of urls) {
    const res = await fetchUrl(u);
    console.log(JSON.stringify(res, null, 2));
  }
}

main();
