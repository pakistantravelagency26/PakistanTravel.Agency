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

const words = [
  'cheez', 'yahan', 'wahan', 'kahan', 'idhar', 'udhar', 'kidhar',
  'saath', 'wala', 'wali', 'walay', 'wale',
  'abhi', 'kabhi', 'jabse', 'pehlay', 'bahir', 'neeche', 'neechay', 'samnay', 'pichay',
  'aisay', 'waisay', 'kaisay', 'itna', 'utna', 'kitna',
  'mera', 'meri', 'mere', 'tera', 'teri', 'tere', 'uska', 'uski', 'uske', 'unka', 'unki', 'unke',
  'hamara', 'hamari', 'hamare', 'apna', 'apni', 'apne',
  'mujhe', 'tujhe', 'unhe', 'hume', 'humko', 'tumko', 'aapko', 'kisko', 'isko', 'usko',
  'batao', 'bataiye', 'dekho', 'dekhiye', 'suno', 'suniye', 'bolo', 'boliye', 'likho', 'likhiye',
  'socho', 'samjho', 'chalo', 'chaliye', 'aaiye', 'jaiye', 'khaiye', 'lijiye', 'dijiye', 'rakhiye',
  'lagao', 'hatao', 'badlo', 'banao', 'chahiye', 'mangwaye', 'daalo', 'rakho', 'kholo', 'band'
];

const regex = new RegExp(`\\b(${words.join('|')})\\b`, 'i');

const files = walk('src').concat(walk('prisma'));
const results = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    // Exclude English words that match substrings or standard terms
    // e.g. 'band' can be English (broadband, band, etc.)
    const trimmed = l.trim();
    if (regex.test(trimmed)) {
      // Filter out standard English words
      if (
        /\b(cheez|yahan|wahan|kahan|idhar|udhar|kidhar|saath|wala|wali|walay|pehlay|bahir|neeche|neechay|samnay|pichay|aisay|waisay|kaisay|itna|utna|kitna|mera|meri|mere|tera|teri|tere|uska|uski|uske|unka|unki|unke|hamara|hamari|hamare|apna|apni|apne|mujhe|tujhe|unhe|hume|humko|tumko|aapko|kisko|isko|usko|batao|bataiye|dekho|dekhiye|suno|suniye|bolo|boliye|likho|likhiye|socho|samjho|chalo|chaliye|aaiye|jaiye|khaiye|lijiye|dijiye|rakhiye|lagao|hatao|badlo|banao|chahiye|mangwaye|daalo|rakho|kholo)\b/i.test(trimmed)
      ) {
        results.push({ file: f, line: idx + 1, text: trimmed });
      }
    }
  });
}

console.log(`=== FOUND ${results.length} ADDITIONAL POTENTIAL ROMAN URDU INSTANCES ===`);
for (const r of results) {
  console.log(`${r.file}:${r.line}: ${r.text.slice(0, 140)}`);
}
