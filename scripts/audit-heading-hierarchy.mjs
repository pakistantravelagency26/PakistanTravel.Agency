const routes = [
  '/',
  '/tours',
  '/destinations',
  '/destinations/hunza',
  '/destinations/skardu',
  '/destinations/swat',
  '/destinations/kumrat',
  '/destinations/murree',
  '/destinations/neelum',
  '/blog',
  '/blog/hunza-best-time-to-visit',
  '/faq',
  '/terms',
  '/privacy',
  '/about',
  '/about/editorial-policy',
  '/contact',
  '/partner-info',
  '/list-your-tour',
  '/listing/hunza-valley-attabad-2640',
  '/listing/hunza-valley-attabad-5207'
];

async function checkHeadings() {
  console.log('| Route | H1 Count | H1 Text | Heading Outline Issues |');
  console.log('|---|---|---|---|');

  for (const r of routes) {
    try {
      const res = await fetch('https://www.pakistantravel.agency' + r);
      const html = await res.text();

      // Extract all headings in document order
      const headingRegex = /<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi;
      const headings = [];
      let match;
      while ((match = headingRegex.exec(html)) !== null) {
        const tag = match[1].toLowerCase();
        const text = match[2].replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ');
        headings.push({ tag, level: parseInt(tag[1], 10), text });
      }

      const h1s = headings.filter(h => h.tag === 'h1');
      const h1Text = h1s.map(h => h.text).join(' || ') || 'NONE';

      let prevLevel = 0;
      const issues = [];
      if (h1s.length === 0) issues.push('Missing H1');
      if (h1s.length > 1) issues.push(`Multiple H1s (${h1s.length})`);

      for (const h of headings) {
        if (prevLevel > 0 && h.level > prevLevel + 1) {
          issues.push(`Skipped level from H${prevLevel} to H${h.level} ("${h.text.slice(0, 25)}")`);
        }
        prevLevel = h.level;
      }

      const issueSummary = issues.length > 0 ? issues.join('; ') : 'None (clean hierarchy)';
      console.log(`| \`${r}\` | ${h1s.length} | ${h1Text.slice(0, 45)} | ${issueSummary} |`);
    } catch (e) {
      console.log(`| \`${r}\` | ERROR | ${e.message} | Fetch failed |`);
    }
  }
}

checkHeadings();
