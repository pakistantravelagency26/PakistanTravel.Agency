import fs from 'fs';

let content = fs.readFileSync('src/data/tourIntentsData.ts', 'utf8');

const updates = [
  {
    target: 'metaDescription: "Compare and book guided Hunza tour packages to Karimabad, Attabad Lake, and Passu Cones directly with independent local tour operators."',
    replacement: 'metaDescription: "Compare and book guided Hunza tour packages to Karimabad, Attabad Lake, and Passu Cones directly with independent local tour operators in Pakistan."'
  },
  {
    target: 'metaDescription: "Compare and book guided Skardu tour packages, Deosai Plains safaris, and Upper Kachura excursions with independent local tour operators."',
    replacement: 'metaDescription: "Compare and book guided Skardu tour packages, Deosai Plains safaris, and Upper Kachura excursions with independent local tour operators in Pakistan."'
  },
  {
    target: 'metaDescription: "Discover guided Kumrat Valley tour packages, pine forest camping, and Jahaz Banda treks in Upper Dir with independent local tour operators."',
    replacement: 'metaDescription: "Discover guided Kumrat Valley tour packages, pine forest camping, and scenic Jahaz Banda treks in Upper Dir with independent local tour operators."'
  }
];

for (const u of updates) {
  if (content.includes(u.target)) {
    content = content.replace(u.target, u.replacement);
    console.log('Updated tourIntentsData:', u.replacement.slice(0, 40));
  } else {
    console.warn('Target not found in tourIntentsData:', u.target.slice(0, 40));
  }
}

fs.writeFileSync('src/data/tourIntentsData.ts', content);
console.log('Finished updating tourIntentsData.ts');
