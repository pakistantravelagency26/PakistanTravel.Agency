import fs from 'fs';
import path from 'path';

function walk(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (['node_modules', '.next', '.git'].includes(item)) continue;
    if (fs.statSync(full).isDirectory()) {
      res = res.concat(walk(full));
    } else if (/\.(tsx|ts|jsx|js|mjs|json|md|html)$/.test(item)) {
      res.push(full);
    }
  }
  return res;
}

// Broadest possible list of Roman Urdu words
const romanUrduWords = [
  'apka', 'aapka', 'apki', 'aapki', 'apke', 'aapke', 'apna', 'apni', 'apne',
  'karein', 'karwana', 'karwaye', 'karna', 'karo', 'kare', 'krien',
  'hoga', 'hogi', 'hoge', 'hotay', 'hota', 'hoti', 'hote', 'huay', 'huye',
  'cheez', 'cheezein', 'raqam', 'foran', 'zaroorat', 'zaroori', 'chahiye',
  'shukriya', 'shukria', 'khushamdeed', 'rabta', 'tasdeeq', 'adaigi', 'wasool',
  'bheje', 'bheja', 'intizar', 'intezar', 'pehlay', 'pehle', 'baad',
  'yeh', 'yehi', 'woh', 'wohi', 'aisay', 'waisay', 'kaisay', 'kyun', 'kyu',
  'nahi', 'nahin', 'yahan', 'wahan', 'kahan', 'idhar', 'udhar',
  'mukamal', 'mukammal', 'tafseel', 'tafseelat', 'sawal', 'jawab',
  'humara', 'hamara', 'humari', 'hamari', 'humare', 'hamare',
  'wali', 'walay', 'par', 'per', 'mein', 'mai', 'se', 'ko', 'ka', 'ki', 'ke', 'k'
];

// To avoid flagging English words like "se" in search, or "par" in parsing, or "per" in percent,
// we search for word combinations or distinct Roman Urdu words.
const distinctWords = [
  'apka', 'aapka', 'apki', 'aapki', 'apke', 'aapke',
  'karein', 'karwana', 'karwaye', 'krien',
  'hoga', 'hogi', 'hoge', 'hotay',
  'cheez', 'cheezein', 'raqam', 'foran', 'zaroorat', 'chahiye',
  'shukriya', 'shukria', 'khushamdeed', 'rabta', 'tasdeeq', 'adaigi', 'wasool',
  'bheje', 'bheja', 'intizar', 'intezar', 'pehlay',
  'yehi', 'wohi', 'aisay', 'waisay', 'kaisay',
  'nahi', 'nahin', 'yahan', 'wahan', 'kahan', 'idhar', 'udhar',
  'mukamal', 'mukammal', 'tafseel', 'tafseelat',
  'humara', 'hamara', 'humari', 'hamari', 'humare', 'hamare',
  'walay'
];

const regex = new RegExp(`\\b(${distinctWords.join('|')})\\b`, 'i');

const files = walk('src').concat(walk('prisma')).concat(walk('public'));
let found = 0;

for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const lines = c.split('\n');
  lines.forEach((l, idx) => {
    if (regex.test(l)) {
      console.log(`[FOUND] ${f}:${idx+1} -> ${l.trim()}`);
      found++;
    }
  });
}

console.log(`\nScan completed: ${found} instances found.`);
