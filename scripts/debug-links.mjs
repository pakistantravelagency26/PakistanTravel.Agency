const res = await fetch('https://www.pakistantravel.agency/blog');
const html = await res.text();
const aMatches = html.match(/<a\b[^>]*href=["'][^"']*hunza[^"']*["'][^>]*>[\s\S]*?<\/a>/gi);
console.log('Matches on /blog:', aMatches);
