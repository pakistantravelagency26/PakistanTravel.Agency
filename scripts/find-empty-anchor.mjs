import { run } from './full-crawl-audit.mjs';

async function main() {
  const { visited } = await run();
  console.log(`Analyzing ${visited.size} pages for empty anchors...`);

  let count = 0;
  for (const [url, data] of visited.entries()) {
    if (data.status !== 200) continue;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'SemrushBot' } });
      const html = await res.text();
      const aRegex = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
      let m;
      while ((m = aRegex.exec(html)) !== null) {
        const attrs = m[1];
        const body = m[2];
        const textOnly = body.replace(/<[^>]+>/g, '').trim();
        const hasAria = /aria-label=["'][^"']+["']/i.test(attrs);
        const hasImgAlt = /<img\b[^>]*alt=["'][^"']+["']/i.test(body);
        const hasTitle = /title=["'][^"']+["']/i.test(attrs);

        if (!textOnly && !hasAria && !hasImgAlt && !hasTitle) {
          count++;
          console.log(`[NO ANCHOR TEXT #${count}] on ${url}:`);
          console.log(`  <a ${attrs}>${body.slice(0, 120)}</a>\n`);
        }
      }
    } catch(e) {
      console.error(e.message);
    }
  }
  console.log(`Total empty anchors found: ${count}`);
}

await main();
