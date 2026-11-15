const targets = [
  { name: 'H5.1 /destinations/fairy-meadows', url: 'https://www.pakistantravel.agency/destinations/fairy-meadows' },
  { name: 'H5.2 /tours/neelum-valley-tour-packages', url: 'https://www.pakistantravel.agency/tours/neelum-valley-tour-packages' },
  { name: 'H5.3 /about/editorial-policy', url: 'https://www.pakistantravel.agency/about/editorial-policy' },
  { name: 'H5.5 /privacy', url: 'https://www.pakistantravel.agency/privacy' },
  { name: 'H5.6 /how-booking-works', url: 'https://www.pakistantravel.agency/how-booking-works' },
  { name: 'H5.6 /safety-and-permits', url: 'https://www.pakistantravel.agency/safety-and-permits' },
  { name: 'H5.6 /about', url: 'https://www.pakistantravel.agency/about' }
];

async function run() {
  for (const t of targets) {
    console.log(`================================================================`);
    console.log(`TARGET: ${t.name} (${t.url})`);
    console.log(`================================================================`);
    try {
      const res = await fetch(t.url);
      const text = await res.text();
      
      const headMatch = text.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      if (headMatch) {
        const headLines = headMatch[1].trim().split('\n').map(l => l.trim()).filter(Boolean).slice(0, 40);
        console.log(`--- FIRST 40 LINES OF <HEAD> ---`);
        console.log(headLines.join('\n'));
      }
      
      const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        const bodyText = bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, '').trim();
        const snippet = bodyText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 450);
        console.log(`\n--- RELEVANT BODY SNIPPET ---`);
        console.log(snippet);
      }
      console.log('\n');
    } catch (e) {
      console.error('Fetch error:', e.message);
    }
  }
}

run();
