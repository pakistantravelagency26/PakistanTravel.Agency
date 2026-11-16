import fs from 'fs';
const c = fs.readFileSync('src/app/page.tsx', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('/partner-info') || l.includes('partner-info')) {
    console.log(`Line ${i+1}: ${l}`);
    console.log(lines.slice(i, i+15).join('\n'));
  }
});
