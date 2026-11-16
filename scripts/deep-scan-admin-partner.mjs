import fs from 'fs';
import path from 'path';

function walk(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (['node_modules', '.next', '.git'].includes(item)) continue;
    if (fs.statSync(full).isDirectory()) {
      res = res.concat(walk(full));
    } else if (/\.(tsx|ts|jsx|js|mjs)$/.test(item)) {
      res.push(full);
    }
  }
  return res;
}

const files = walk('src/app/secure-admin').concat(walk('src/app/partner-hub'));
const words = ['hotay', 'k sath', 'apna', 'cheez', 'raqam', 'foran', 'karein', 'kare', 'hoga', 'hogi', 'karo', 'yeh', 'woh', 'yahan', 'wahan', 'shukriya', 'tasdeeq', 'maloomat'];

for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  for (const w of words) {
    const r = new RegExp(`\\b${w}\\b`, 'i');
    if (r.test(c)) {
      console.log(`Found "${w}" in ${f}`);
      const lines = c.split('\n');
      lines.forEach((l, i) => {
        if (r.test(l)) {
          console.log(`  Line ${i+1}: ${l.trim()}`);
        }
      });
    }
  }
}
