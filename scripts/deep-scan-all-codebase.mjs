import fs from 'fs';
import path from 'path';

function walk(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (['node_modules', '.next', '.git'].includes(item)) continue;
    if (fs.statSync(full).isDirectory()) {
      res = res.concat(walk(full));
    } else if (/\.(tsx|ts|jsx|js|mjs|json|md)$/.test(item)) {
      res.push(full);
    }
  }
  return res;
}

const files = walk('src');
const words = [
  'hotay', 'hoti', 'hota', 'hote', 'hoga', 'hogi', 'hoge',
  'apka', 'aapka', 'apki', 'aapki', 'apke', 'aapke', 'apna', 'apni', 'apne',
  'karein', 'karna', 'karwana', 'karwaye', 'kare', 'karo',
  'cheez', 'raqam', 'foran', 'zaroorat', 'zaroori', 'chahiye',
  'shukriya', 'shukria', 'khushamdeed', 'rabta', 'tasdeeq', 'adaigi', 'wasool',
  'bheje', 'bheja', 'intizar', 'intezar', 'pehle', 'pehlay', 'baad',
  'taraf', 'zariye', 'madad', 'sawal', 'jawab',
  'yeh', 'yehi', 'woh', 'wohi', 'aisay', 'waisay', 'kaisay', 'kyun',
  'nahi', 'nahin', 'yahan', 'wahan', 'kahan', 'idhar', 'udhar',
  'mukamal', 'mukammal', 'tafseel', 'tafseelat'
];

console.log(`Scanning ${files.length} files across src/...`);
let count = 0;

for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  for (const w of words) {
    const r = new RegExp(`\\b${w}\\b`, 'i');
    if (r.test(c)) {
      const lines = c.split('\n');
      lines.forEach((l, i) => {
        if (r.test(l)) {
          // Filter out English words that happen to contain the pattern, or check if it's really Roman Urdu
          const trimmed = l.trim();
          // Filter out false positives
          // e.g. "foran" - in English "for an" (two words) vs "foran"
          // "bad" in English vs "baad"
          // "saw" in English vs "sawal"
          if (
            /\b(hotay|hoga|hogi|hoge|apka|aapka|apki|aapki|apke|aapke|karein|karwana|karwaye|cheez|raqam|foran|zaroorat|shukriya|shukria|khushamdeed|rabta|tasdeeq|adaigi|wasool|bheje|intizar|intezar|pehlay|yehi|wohi|aisay|waisay|kaisay|yahan|wahan|kahan|idhar|udhar|mukamal|mukammal|tafseel|tafseelat)\b/i.test(trimmed) ||
            (/\b(yeh|woh|apna|apni|apne|karo|nahi|nahin)\b/i.test(trimmed) && !/node_modules/i.test(f))
          ) {
            console.log(`[MATCH] ${f}:${i+1} (${w}):`);
            console.log(`   ${trimmed}`);
            count++;
          }
        }
      });
    }
  }
}

console.log(`Scan finished. Total matches found: ${count}`);
