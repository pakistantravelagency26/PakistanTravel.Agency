async function fetchHeadAndBody(url) {
  const res = await fetch(url, { cache: 'no-store' });
  const html = await res.text();

  console.log(`\n===============================================================`);
  console.log(`PAGE: ${url} (HTTP ${res.status})`);
  console.log(`===============================================================`);

  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (headMatch) {
    const headLines = headMatch[1].split('\n').filter(l => l.trim().length > 0).slice(0, 40);
    console.log(`--- FIRST 40 LINES OF <HEAD> ---`);
    console.log(headLines.join('\n'));
  }

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    // Find first h1 and surrounding context
    const h1Match = bodyMatch[1].match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    console.log(`\n--- RELEVANT BODY (H1 & Main Content Snippet) ---`);
    if (h1Match) {
      console.log(`<h1>: ${h1Match[1].replace(/<[^>]*>/g, '').trim()}`);
    }
    // Clean text snippet
    const textSnippet = bodyMatch[1]
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 250);
    console.log(`Body Snippet: ${textSnippet}...`);
  }
}

async function run() {
  await fetchHeadAndBody('https://www.pakistantravel.agency/');
  await fetchHeadAndBody('https://www.pakistantravel.agency/tours');
  await fetchHeadAndBody('https://www.pakistantravel.agency/destinations/hunza');
  await fetchHeadAndBody('https://www.pakistantravel.agency/blog/hunza-best-time-to-visit');
  await fetchHeadAndBody('https://www.pakistantravel.agency/listing/hunza-valley-attabad-2640');
}

run();
