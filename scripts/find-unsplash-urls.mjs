import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve('.');
const unsplashUrls = new Map();

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.next', '.git', '.prisma', 'dist'].includes(entry.name)) {
        scanDir(fullPath);
      }
    } else if (/\.(tsx?|jsx?|mjs|json|prisma)$/i.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(/https?:\/\/[^\s"'`)]*unsplash\.com[^\s"'`)]*/gi);
      if (matches) {
        for (const url of matches) {
          const cleanUrl = url.split('&')[0]; // base unsplash photo URL
          const relPath = path.relative(projectRoot, fullPath);
          if (!unsplashUrls.has(cleanUrl)) {
            unsplashUrls.set(cleanUrl, new Set());
          }
          unsplashUrls.get(cleanUrl).add(relPath);
        }
      }
    }
  }
}

scanDir(projectRoot);

console.log(`Found ${unsplashUrls.size} unique Unsplash image URLs across repository:\n`);
let idx = 1;
for (const [url, files] of unsplashUrls.entries()) {
  console.log(`${idx++}. ${url}`);
  console.log(`   Referenced in: ${Array.from(files).join(', ')}`);
}
