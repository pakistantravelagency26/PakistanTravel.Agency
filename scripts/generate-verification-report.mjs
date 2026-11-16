import { run } from './full-crawl-audit.mjs';

const GENERIC_ANCHORS = [
  'learn more',
  'read more',
  'click here',
  'read',
  'read article',
  'view all',
  'explore',
  'more'
];

async function generateReport() {
  const { visited, sitemapUrls } = await run();

  const publicPages = Array.from(visited.values()).filter(page => page.status > 0);

  // Semrush category counters
  let orphanedSitemapPages = 0;
  let singleInboundLinkPages = 0;
  let nonDescriptiveAnchors = 0;
  let noAnchorText = 0;
  let brokenPages = 0;
  let canonicalMismatches = 0;
  let missingTitles = 0;
  let longTitles = 0;
  let missingDescriptions = 0;
  let missingH1 = 0;

  const urlRows = [];

  for (const page of publicPages) {
    const isSitemap = sitemapUrls.has(page.url);
    const inboundCount = page.inboundLinks.length;

    if (page.status >= 400) brokenPages++;
    if (isSitemap && inboundCount === 0) orphanedSitemapPages++;
    if (inboundCount === 1) singleInboundLinkPages++;
    if (!page.title) missingTitles++;
    if (page.title.length > 60) longTitles++;
    if (!page.description) missingDescriptions++;
    if (!page.h1 && page.status === 200 && !page.url.endsWith('.txt') && !page.url.endsWith('.xml')) missingH1++;
    if (page.canonical && page.canonical !== page.url && page.status === 200) canonicalMismatches++;

    // Anchor text analysis
    for (const inb of page.inboundLinks) {
      const aLower = inb.anchor.toLowerCase().trim();
      if (!aLower || aLower === '') {
        noAnchorText++;
      } else if (GENERIC_ANCHORS.includes(aLower)) {
        nonDescriptiveAnchors++;
      }
    }

    urlRows.push({
      url: page.url,
      status: page.status,
      canonical: page.canonical || 'N/A',
      robots: page.robots || 'index, follow',
      title: page.title || 'N/A',
      titleLen: page.title ? page.title.length : 0,
      h1: page.h1 ? page.h1.slice(0, 35) : 'N/A',
      inboundCount,
      sampleInboundFrom: page.inboundLinks.slice(0, 3).map(l => {
        try {
          return new URL(l.from).pathname;
        } catch {
          return l.from;
        }
      }).join(', '),
      sampleAnchors: page.inboundLinks.slice(0, 3).map(l => `"${l.anchor.slice(0, 25)}"`).join(', ')
    });
  }

  console.log('\n================================================================');
  console.log('SEMRUSH SITE AUDIT COMPARISON METRICS');
  console.log('================================================================\n');

  console.log(`| Category / Semrush Issue | Previous (Audit Export) | Current (Live Crawl) | Status |`);
  console.log(`|---|---|---|---|`);
  console.log(`| Links with non-descriptive anchor text | 48 pages | ${nonDescriptiveAnchors} | ${nonDescriptiveAnchors === 0 ? 'DROPPED TO 0' : 'ATTENTION'} |`);
  console.log(`| Links with no anchor text | 1 (/privacy) | ${noAnchorText} | ${noAnchorText === 0 ? 'DROPPED TO 0' : 'ATTENTION'} |`);
  console.log(`| Pages with only one internal link | 20 pages | ${singleInboundLinkPages} | ${singleInboundLinkPages === 0 ? 'DROPPED TO 0' : 'ATTENTION'} |`);
  console.log(`| Orphaned sitemap pages | 10 pages | ${orphanedSitemapPages} | ${orphanedSitemapPages === 0 ? 'DROPPED TO 0' : 'ATTENTION'} |`);
  console.log(`| Broken internal links (4xx/5xx) | - | ${brokenPages} | ${brokenPages === 0 ? '0 ERRORS' : 'ATTENTION'} |`);
  console.log(`| Canonical tag mismatches | - | ${canonicalMismatches} | ${canonicalMismatches === 0 ? '0 ERRORS' : 'ATTENTION'} |`);
  console.log(`| Titles > 60 characters | 48 pages | ${longTitles} | ${longTitles === 0 ? 'DROPPED TO 0' : 'ATTENTION'} |`);
  console.log(`| Missing / Empty meta descriptions | - | ${missingDescriptions} | ${missingDescriptions === 0 ? '0 ERRORS' : 'ATTENTION'} |`);
  console.log(`| Missing H1 | - | ${missingH1} | ${missingH1 === 0 ? '0 ERRORS' : 'ATTENTION'} |`);

  console.log('\n================================================================');
  console.log('DETAILED CRAWL TABLE (ALL PUBLIC & SITEMAP PAGES)');
  console.log('================================================================\n');

  console.log('| URL | Status | Inbound | Canonical Match? | Title (Len) | Robots | Sample Anchors |');
  console.log('|---|---|---|---|---|---|---|');
  for (const r of urlRows) {
    const canMatch = r.canonical === r.url ? 'MATCH' : (r.canonical === 'N/A' ? 'N/A' : 'DIFF');
    const uPath = r.url.replace('https://www.pakistantravel.agency', '') || '/';
    console.log(`| \`${uPath}\` | ${r.status} | ${r.inboundCount} | ${canMatch} | ${r.title.slice(0, 30)} (${r.titleLen}) | ${r.robots.slice(0, 20)} | ${r.sampleAnchors.slice(0, 40)} |`);
  }
}

await generateReport();
