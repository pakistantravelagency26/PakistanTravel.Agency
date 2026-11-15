import fs from 'fs';
import path from 'path';

function searchInDir(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name !== 'node_modules' && item.name !== '.next') searchInDir(full);
    } else if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((l, i) => {
        if (l.includes('"/search') || l.includes("'/search") || l.includes('`/search')) {
          console.log(`${full}:${i + 1}: ${l.trim()}`);
        }
      });
    }
  }
}
searchInDir('src');
