import fs from 'fs';
import path from 'path';

function walk(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (['node_modules', '.next', '.git'].includes(item)) continue;
    if (fs.statSync(full).isDirectory()) {
      res = res.concat(walk(full));
    } else if (/\.(tsx|ts|jsx|js|mjs|json)$/.test(item)) {
      res.push(full);
    }
  }
  return res;
}

const files = walk('src');
const urduPairs = [
  /\b(ka|ki|ke|k)\s+(apna|apni|apne|sath|baad|liye|baray|mutabiq)\b/i,
  /\b(jo|jis|jin)\s+(web|website|tour|booking|customer|vendor)\b/i,
  /\b(aur|ya|phir)\s+(vendor|customer|tour|paisa|raqam|status)\b/i,
  /\b(ho|hoga|hogi|hoge|kar|karein)\s+(ga|gi|ge|kar|ke)\b/i,
  /\b(foran|jaldi)\s+(website|web|active|live|hoga)\b/i,
  /\b(par|pe)\s+(jaye|hoga|active|click)\b/i
];

console.log('Scanning for Roman Urdu grammatical pairs...');
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    for (const p of urduPairs) {
      if (p.test(l)) {
        console.log(`${f}:${idx+1} -> ${l.trim()}`);
        break;
      }
    }
  });
}
console.log('Pair scan complete.');
