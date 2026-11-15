import fs from 'fs';

const filePath = 'src/app/listing/[slug]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/listing\.averageRating/g, 'listing.avgRating');
fs.writeFileSync(filePath, content, 'utf8');
console.log('Replaced listing.averageRating with listing.avgRating in listing/[slug]/page.tsx');
