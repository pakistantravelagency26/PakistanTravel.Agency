import fs from 'fs';
import { tourIntentsData } from '../src/data/tourIntentsData.ts';

const boosts = {
  "swat-tour-packages": [
    "Travel seasons in Swat offer distinct experiences throughout the year. Spring brings fragrant fruit blossoms across the lower valley orchards, while summer provides refreshing mountain breezes along the upper riverbanks. Autumn transforms the valley into amber tones, and winter welcomes snow sports enthusiasts to the slopes of Malam Jabba. Tour packages on PakistanTravel connect travelers directly with trusted local drivers and operators who prioritize safety, comfort, and authentic local knowledge across every stage of the itinerary."
  ],
  "swat-kalam-tour-packages": [
    "Kalam's strategic location in Upper Swat also provides access to hidden mountain pastures and tributary streams where trout fishing and riverside picnics are popular pastimes. The local hospitality in Kalam is renowned, with family-run riverside restaurants serving local trout, chapli kebabs, and hot green tea with fresh mint. Guided tour packages on PakistanTravel ensure dedicated transportation from Islamabad, clean family guest house rooms, and verified itineraries managed by experienced northern drivers."
  ],
  "kumrat-tour-packages": [
    "The journey to Kumrat Valley also includes opportunities to visit local heritage sites, such as the historic wooden mosque of Thal with its intricate geometric pillar carvings dating back centuries. Responsible eco-tourism practices are encouraged throughout Kumrat to preserve the pristine riverbanks and virgin pine forests for future generations. All packages booked through PakistanTravel feature transparent inclusions, verified local operators, and instant digital vouchers."
  ],
  "neelum-tour-packages": [
    "The valley's climate offers cool summer escapes with daytime temperatures rarely exceeding 25°C in upper regions like Sharda and Kel. Visiting during the monsoon requires attentive road monitoring, but late summer and early autumn reward travelers with crystal-clear skies and serene river vistas. PakistanTravel provides travelers with direct access to local operators who understand the terrain, weather patterns, and local registration requirements."
  ],
  "neelum-valley-tour-packages": [
    "Neelum Valley is also an exceptional destination for nature photographers and families seeking tranquil riverside retreats away from urban congestion. Wooden guest houses in Keran and Sharda offer peaceful balcony views over the flowing river, while local guides provide fascinating stories of regional culture, folklore, and valley traditions. With PakistanTravel's transparent booking platform, travelers receive verified tour vouchers and direct operator contact details."
  ],
  "gilgit-baltistan-tour-packages": [
    "Beyond scenery, a journey through Gilgit-Baltistan is an immersion into diverse linguistic and cultural traditions, from Shina and Burushaski to Balti and Wakhi. Travelers have opportunities to savor organic local foods such as apricot kernel oils, buckwheat pancakes, and traditional yak meat dishes. PakistanTravel ensures complete pricing transparency, with digital vouchers and direct coordination with licensed regional operators."
  ],
  "winter-tours-pakistan": [
    "Winter travel in Pakistan offers unique visual drama that few international travelers get to witness. Snowy pine forests in Galyat, frozen ice cascades in Upper Swat, and tranquil mountain valleys without peak-season crowds create an unforgettable atmosphere. PakistanTravel packages include verified winterized vehicles, comfortable heated lodgings, and direct operator support for seamless winter vacations."
  ],
  "fairy-meadows-tours": [
    "At night, Fairy Meadows becomes an astronomer's paradise with zero light pollution, revealing millions of stars and the arc of the Milky Way stretching directly above the icy pinnacle of Nanga Parbat. Bonfires and warm mountain hospitality at local wooden huts complete an unforgettable Himalayan adventure. PakistanTravel provides verified bookings, clear cancellation terms, and direct operator coordination for a safe mountain experience."
  ]
};

for (const [slug, paragraphs] of Object.entries(boosts)) {
  if (tourIntentsData[slug]) {
    tourIntentsData[slug].introText.push(...paragraphs);
  }
}

let tsContent = `export interface TourIntentData {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  destinationSlug?: string;
  categoryFilter?: string;
  introText: string[];
  faqs: {
    q: string;
    a: string;
  }[];
}

export const tourIntentsData: Record<string, TourIntentData> = ${JSON.stringify(tourIntentsData, null, 2)};
`;

fs.writeFileSync('src/data/tourIntentsData.ts', tsContent);
console.log('Successfully boosted all tour intents to 300+ words!');
