import fs from 'fs';

const filePath = 'src/data/tourIntentsData.ts';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `"Neelum Valley is also an exceptional destination for nature photographers and families seeking tranquil riverside retreats away from urban congestion. Wooden guest houses in Keran and Sharda offer peaceful balcony views over the flowing river, while local guides provide fascinating stories of regional culture, folklore, and valley traditions. With PakistanTravel's transparent booking platform, travelers receive verified tour vouchers and direct operator contact details."`;

const replacementStr = `"Neelum Valley is also an exceptional destination for nature photographers and families seeking tranquil riverside retreats away from urban congestion. Wooden guest houses in Keran and Sharda offer peaceful balcony views over the flowing river, while local guides provide fascinating stories of regional culture, folklore, and valley traditions. When preparing for a Neelum Valley tour, Pakistani travelers must carry original Computerized National Identity Cards (CNIC) for security checkpoints along the river corridor, while foreign tourists should verify current entry requirements with the Azad Kashmir tourism department. With PakistanTravel's transparent booking platform, travelers receive digital tour vouchers, clear deposit tiers, and direct operator contact details."`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully boosted neelum-valley-tour-packages!');
} else {
  console.error('Target string not found in tourIntentsData.ts');
}
