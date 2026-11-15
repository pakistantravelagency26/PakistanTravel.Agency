import fs from 'fs';

const file = 'src/app/search/page.tsx';
let c = fs.readFileSync(file, 'utf8');
const target = 'url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",';
const repl = 'url: `${siteUrl}/og?title=Search+Northern+Pakistan+Tour+Packages&category=TOUR%20SEARCH&subtitle=Compare+Guided+Tours+Across+Hunza%2C+Skardu%2C+Swat`,';
const target2 = 'images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"],';
const repl2 = 'images: [`${siteUrl}/og?title=Search+Northern+Pakistan+Tour+Packages&category=TOUR%20SEARCH&subtitle=Compare+Guided+Tours+Across+Hunza%2C+Skardu%2C+Swat`],';

c = c.replace(target, repl).replace(target2, repl2);
fs.writeFileSync(file, c);
console.log('Updated search/page.tsx successfully!');
