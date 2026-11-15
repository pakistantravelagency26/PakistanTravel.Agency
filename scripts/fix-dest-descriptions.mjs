import fs from 'fs';

let content = fs.readFileSync('src/data/destinationData.ts', 'utf8');

const updates = [
  {
    target: 'seoDescription: "Compare and book guided tour packages across Hunza, Karimabad, Attabad Lake, and Passu Cones from independent local tour operators."',
    replacement: 'seoDescription: "Compare and book guided tour packages across Hunza, Karimabad, Attabad Lake, and Passu Cones directly from independent local mountain tour operators."'
  },
  {
    target: 'seoDescription: "Compare and book guided Skardu tour packages, Deosai Plains excursions, and Upper Kachura trips directly from independent local operators."',
    replacement: 'seoDescription: "Compare and book guided Skardu tour packages, Deosai Plains excursions, and Upper Kachura trips directly from independent local operators in Pakistan."'
  },
  {
    target: 'seoDescription: "Compare and book guided tour packages across Swat, Kalam, Malam Jabba, and Mahodand Lake from independent local tour operators in Pakistan."',
    replacement: 'seoDescription: "Compare and book guided tour packages across Swat Valley, Kalam, Malam Jabba, and Mahodand Lake from independent local tour operators in Pakistan."'
  },
  {
    target: 'seoDescription: "Discover guided Kumrat Valley tour packages, Jahaz Banda treks, and river camping in Upper Dir directly from independent local operators."',
    replacement: 'seoDescription: "Discover guided Kumrat Valley tour packages, Jahaz Banda treks, and scenic pine river camping in Upper Dir directly from independent local tour operators."'
  },
  {
    target: 'seoDescription: "Explore guided Murree and Galyat tour packages, Patriata chairlift excursions, and scenic pine ridge getaways from independent operators."',
    replacement: 'seoDescription: "Explore guided Murree and Galyat tour packages, Patriata chairlift excursions, and scenic pine ridge getaways from independent local tour operators."'
  },
  {
    target: 'seoDescription: "Compare and book guided Neelum Valley tour packages across Keran, Sharda, Arang Kel, and Ratti Gali Lake with independent local operators."',
    replacement: 'seoDescription: "Compare and book guided Neelum Valley tour packages across Keran, Sharda, Arang Kel, and Ratti Gali Lake with independent local operators in Pakistan."'
  }
];

for (const u of updates) {
  if (content.includes(u.target)) {
    content = content.replace(u.target, u.replacement);
    console.log('Updated:', u.replacement.slice(0, 40));
  } else {
    console.warn('Target NOT found:', u.target.slice(0, 40));
  }
}

fs.writeFileSync('src/data/destinationData.ts', content);
console.log('Finished updating destinationData.ts');
