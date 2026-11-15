import fs from 'fs';

let content = fs.readFileSync('src/data/blogData.ts', 'utf8');

const updates = [
  {
    target: 'seoTitle: "Skardu Trip Cost 2026: Budget & Luxury Breakdown",',
    replacement: 'seoTitle: "Skardu Trip Cost Guide 2026",',
  },
  {
    target: 'seoTitle: "Best Time to Visit Hunza Valley: Seasonal Travel Guide",',
    replacement: 'seoTitle: "Best Time to Visit Hunza Valley",',
  },
  {
    target: 'seoTitle: "Kumrat Valley Travel Guide: Route & 4x4 Road Conditions",',
    replacement: 'seoTitle: "Kumrat Valley Travel & Route Guide",',
  },
  {
    target: 'metaDescription: "Plan your trip to Kumrat Valley with our route guide from Islamabad, 4x4 jeep requirements, Jahaz Banda trek details, and camping advice.",',
    replacement: 'metaDescription: "Plan your trip to Kumrat Valley with our complete route guide from Islamabad, 4x4 jeep requirements, Jahaz Banda trek details, and camping advice.",',
  },
  {
    target: 'seoTitle: "Skardu vs Hunza: Which Northern Valley to Choose?",',
    replacement: 'seoTitle: "Skardu vs Hunza Tour Comparison",',
  },
  {
    target: 'seoTitle: "Northern Pakistan Packing List: Mountain Travel Gear",',
    replacement: 'seoTitle: "Northern Pakistan Packing List",',
  }
];

for (const u of updates) {
  if (content.includes(u.target)) {
    content = content.replace(u.target, u.replacement);
    console.log('Updated blogData:', u.replacement.slice(0, 40));
  } else {
    console.warn('Target not found in blogData:', u.target.slice(0, 40));
  }
}

fs.writeFileSync('src/data/blogData.ts', content);
console.log('Finished updating blogData.ts');
