import fs from 'fs';
import path from 'path';

function walk(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (['node_modules', '.next', '.git'].includes(item)) continue;
    if (fs.statSync(full).isDirectory()) {
      res = res.concat(walk(full));
    } else if (/\.(tsx|ts|jsx|js|mjs|json|prisma)$/.test(item)) {
      res.push(full);
    }
  }
  return res;
}

const romanUrduPatterns = [
  /\b(apka|aapka|apki|aapki|apke|aapke)\b/i,
  /\b(karein|karna|karwana|karwaye|kare|kar sakti|kar sakte|kar sakta)\b/i,
  /\b(hoga|hogi|hoge|hotay|hoti|hota|hote|huye|huay)\b/i,
  /\b(shukriya|shukria|khushamdeed|khushamdid)\b/i,
  /\b(rabta|maloomat|tasdeeq|adaigi|adaigiyan|wasool)\b/i,
  /\b(bheje|bheja|bhejiye|intizar|intezar)\b/i,
  /\b(zaroorat|zaroori|chahiye|pehle|baad|pehlay)\b/i,
  /\b(taraf|zariye|madad|taawun|sawal|safarnama)\b/i,
  /\b(foran|jaldi|k sath|ke sath|k baad|ke baad|k liye|ke liye)\b/i,
  /\b(yeh|yehi|woh|wohi|aisay|kaisy|kaisay|kyun|kyu)\b/i,
  /\b(nahi|nahin|mat karo|mat karein)\b/i,
  /\b(shamil|shamilat|mukamal|mukammal)\b/i,
  /\b(asalam|salam|walekum|assalam|alaikum)\b/i,
  /\b(tafseel|tafseelat|itinerary|guideline)\b/i,
  /\b(gaya|gaye|gayi|diya|diye|diyi)\b/i
];

const files = walk('src').concat(walk('prisma'));
const matches = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Exclude imports or standard English terms like 'itinerary' or 'guideline' if standalone
    for (const pattern of romanUrduPatterns) {
      if (pattern.test(line)) {
        // filter out false positives in standard English
        const trimmed = line.trim();
        // check if it's really Roman Urdu
        if (
          /\b(apka|aapka|apki|aapki|apke|aapke|karein|karwana|karwaye|hoga|hogi|hotay|shukriya|shukria|khushamdeed|rabta|tasdeeq|adaigi|wasool|bheje|intizar|intezar|zaroorat|chahiye|foran|k sath|ke sath|k baad|ke baad|k liye|ke liye|yehi|wohi|kaisay|nahi|nahin|mukamal|mukammal|asalam|walekum|tafseel|tafseelat|gaya|gaye|diya|diye)\b/i.test(trimmed) ||
          (/\byeh\b/i.test(trimmed) && /\b(tour|status|ho|kar)\b/i.test(trimmed)) ||
          (/\bpar\b/i.test(trimmed) && /\b(website|status|ho)\b/i.test(trimmed))
        ) {
          matches.push({ file: f, line: idx + 1, text: trimmed });
          break;
        }
      }
    }
  });
}

console.log(`=== FOUND ${matches.length} POTENTIAL ROMAN URDU INSTANCES ===`);
for (const m of matches) {
  console.log(`${m.file}:${m.line}: ${m.text.slice(0, 140)}`);
}
