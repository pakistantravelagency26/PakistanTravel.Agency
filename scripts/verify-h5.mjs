import { tourIntentsData } from '../src/data/tourIntentsData.ts';
import { destinationsData } from '../src/data/destinationData.ts';

console.log('--- TOUR INTENTS WORD COUNTS ---');
for (const [slug, data] of Object.entries(tourIntentsData)) {
  const introWords = (data.introText || []).join(' ').split(/\s+/).filter(Boolean).length;
  console.log(`${slug}: ${introWords} words -> ${introWords >= 300 ? 'PASS (>=300)' : 'FAIL (<300)'}`);
}

console.log('\n--- DESTINATIONS LIST (total: ' + Object.keys(destinationsData).length + ') ---');
for (const slug of Object.keys(destinationsData)) {
  console.log(`- ${slug} (${destinationsData[slug].name})`);
}
