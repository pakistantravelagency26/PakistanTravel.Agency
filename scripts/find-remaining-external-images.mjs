import fs from 'fs';
import path from 'path';

function walk(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (item === 'node_modules' || item === '.next' || item === '.git') continue;
    if (fs.statSync(full).isDirectory()) {
      res = res.concat(walk(full));
    } else if (/\.(tsx|ts|jsx|js|mjs|json)$/.test(item)) {
      res.push(full);
    }
  }
  return res;
}

const files = walk('src');
const urlRegex = /https:\/\/(images\.unsplash\.com|res\.cloudinary\.com)[^\s"'>\)]+/g;
const externalImages = new Map();

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    const cleanUrl = match[0].replace(/[;,]+$/, '');
    if (!externalImages.has(cleanUrl)) {
      externalImages.set(cleanUrl, []);
    }
    externalImages.get(cleanUrl).push(f);
  }
}

console.log(`=== FOUND ${externalImages.size} UNIQUE REMAINING EXTERNAL IMAGE URLS ===`);
for (const [url, fileList] of externalImages.entries()) {
  console.log(`- ${url}`);
  console.log(`  used in: ${fileList.slice(0, 3).join(', ')}`);
}
