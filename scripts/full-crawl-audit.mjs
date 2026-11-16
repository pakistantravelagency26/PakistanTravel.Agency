import https from 'https';

const BASE_URL = 'https://www.pakistantravel.agency';

async function fetchUrl(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 SemrushBot-Audit',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      redirect: 'manual'
    });

    const status = res.status;
    const xRobotsTag = res.headers.get('x-robots-tag') || '';
    const contentType = res.headers.get('content-type') || '';
    const location = res.headers.get('location') || '';

    let html = '';
    if (status >= 200 && status < 300 && contentType.includes('text/html')) {
      html = await res.text();
    } else if (contentType.includes('text/plain') || contentType.includes('application/xml')) {
      html = await res.text();
    }

    return { status, xRobotsTag, contentType, location, html };
  } catch (err) {
    return { status: 0, error: err.message, xRobotsTag: '', contentType: '', location: '', html: '' };
  }
}

function normalizeUrl(rawUrl, baseUrl = BASE_URL) {
  try {
    const u = new URL(rawUrl, baseUrl);
    if (u.hostname !== 'www.pakistantravel.agency') {
      return null; // external
    }
    // Remove hash
    u.hash = '';
    let p = u.pathname;
    // Strip trailing slash unless it's the root '/'
    if (p.length > 1 && p.endsWith('/')) {
      p = p.slice(0, -1);
    }
    u.pathname = p;
    return u.toString();
  } catch (e) {
    return null;
  }
}

async function run() {
  console.log('Fetching sitemap.xml...');
  const sitemapRes = await fetchUrl(`${BASE_URL}/sitemap.xml`);
  const sitemapUrls = new Set();
  const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  let locMatch;
  while ((locMatch = locRegex.exec(sitemapRes.html)) !== null) {
    const norm = normalizeUrl(locMatch[1]);
    if (norm) sitemapUrls.add(norm);
  }
  console.log(`Found ${sitemapUrls.size} URLs in sitemap.xml`);

  const pages = new Map(); // url -> { url, status, location, canonical, robots, title, description, h1, inboundLinks: [{ from, anchor }], outlinks: [] }
  function getOrCreatePage(u) {
    if (!pages.has(u)) {
      pages.set(u, {
        url: u,
        status: 0,
        location: '',
        canonical: '',
        robots: '',
        title: '',
        description: '',
        h1: '',
        inboundLinks: [],
        outlinks: []
      });
    }
    return pages.get(u);
  }

  const crawled = new Set();
  const queue = [normalizeUrl(BASE_URL), ...sitemapUrls];
  for (const u of queue) getOrCreatePage(u);

  while (queue.length > 0) {
    const currentUrl = queue.shift();
    if (crawled.has(currentUrl)) continue;
    crawled.add(currentUrl);

    console.log(`Crawling (${crawled.size}/${queue.length + crawled.size}): ${currentUrl}`);
    const res = await fetchUrl(currentUrl);
    const pageData = getOrCreatePage(currentUrl);

    pageData.status = res.status;
    pageData.location = res.location;
    pageData.robots = res.xRobotsTag;

    if (res.html && res.contentType.includes('text/html')) {
      // canonical
      const canMatch = res.html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                       res.html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
      if (canMatch) pageData.canonical = canMatch[1];

      // robots meta
      const robMatch = res.html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
      if (robMatch) {
        pageData.robots = pageData.robots ? `${pageData.robots}, ${robMatch[1]}` : robMatch[1];
      }

      // title
      const tMatch = res.html.match(/<title[^>]*>([^<]*)<\/title>/i);
      if (tMatch) pageData.title = tMatch[1].trim();

      // description
      const dMatch = res.html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
      if (dMatch) pageData.description = dMatch[1].trim();

      // h1
      const h1Match = res.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1Match) pageData.h1 = h1Match[1].replace(/<[^>]+>/g, '').trim();

      // find links
      const aRegex = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
      let aMatch;
      while ((aMatch = aRegex.exec(res.html)) !== null) {
        const attrs = aMatch[1];
        const rawAnchor = aMatch[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const hrefMatch = attrs.match(/href=["']([^"'#][^"']*)["']/i);
        if (hrefMatch) {
          const rawHref = hrefMatch[1];
          const normHref = normalizeUrl(rawHref, currentUrl);
          if (normHref && !normHref.includes('/_next/') && !normHref.includes('/api/')) {
            pageData.outlinks.push({ to: normHref, anchor: rawAnchor });

            const targetPage = getOrCreatePage(normHref);
            targetPage.inboundLinks.push({ from: currentUrl, anchor: rawAnchor });

            if (!crawled.has(normHref) && !queue.includes(normHref)) {
              queue.push(normHref);
            }
          }
        }
      }
    }
  }

  return { visited: pages, sitemapUrls };
}

export { run };
