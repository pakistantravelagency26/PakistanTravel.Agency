import fs from 'fs';
import { tourIntentsData } from '../src/data/tourIntentsData.ts';

// Add rich factual paragraph to reach 300+ words
const additions = {
  "hunza-tour-packages": [
    "Practical logistics for Hunza tours center on seasonal roadway accessibility. Between July and late October, overland travelers can take the scenic shortcut through Naran and Kaghan Valley across Babusar Pass (4,173 meters), which connects directly to the Karakoram Highway at Chilas. Outside this seasonal window, journeys follow the all-weather Karakoram Highway through the Indus River canyon via Besham and Kohistan. Packing essentials include layered thermal clothing for high-altitude passes, comfortable hiking boots for village trails, cash for local bazaars in Karimabad and Aliabad, and portable power banks. Booking through PakistanTravel provides digital tour vouchers with verified operator contact information, transparent deposit tiers, and local guidance on the ground."
  ],
  "skardu-tour-packages": [
    "Preparing for a Baltistan expedition requires careful consideration of altitude and flight logistics. Skardu sits at 2,228 meters, while day excursions to Deosai Plateau reach 4,114 meters. Travelers should allow for gradual acclimatization and drink plenty of water. Because flights into Skardu operate under Visual Flight Rules and are weather-contingent, independent operators plan flexible overland contingencies along the Jaglot-Skardu road. Local specialties to experience include traditional Balti walnut cakes, fresh river trout, dried apricots, and handwoven woolen shawls from local craft centers. All packages booked on PakistanTravel include digital vouchers, transparent payment terms, and direct local coordination."
  ],
  "swat-tour-packages": [
    "Swat Valley's comprehensive road network makes it northern Pakistan's most accessible mountain region for weekend getaways and extended family vacations alike. The valley's rich Buddhist heritage is preserved across numerous archaeological sites, including the ancient Butkara Stupa, the Shingardar Stupa, and the Swat Museum in Saidu Sharif, featuring priceless Gandhara art collections. Local markets in Mingora and Kalam offer traditional Swati embroidery, walnut wood furniture, hand-carved handicrafts, and locally produced wildflower honey. Guided packages on PakistanTravel ensure verified transport with experienced mountain drivers, family hotel night stays, and digital vouchers."
  ],
  "swat-kalam-tour-packages": [
    "Kalam serves as an exceptional base for wilderness exploration and day hikes into side valleys like Gabral, Utror, and Matiltan. Traveling beyond Kalam toward Mahodand Lake requires crossing scenic wooden bridges and rocky alpine riverbeds where 4x4 jeeps navigate alongside rushing glacial streams. Visitors can explore local riverside trout hatcheries, sample freshly grilled fish prepared with mountain spices, and camp under star-studded alpine skies. With independent operators on PakistanTravel, packages include pre-arranged 4x4 vehicles, verified hotel rooms, and digital booking vouchers that outline every itinerary inclusion with full transparency."
  ],
  "kumrat-tour-packages": [
    "Travelers venturing to Kumrat Valley should be prepared for authentic wilderness living with limited commercial infrastructure, making guided packages the safest and most reliable way to explore. Electricity in the upper valley is often generator-powered or solar-assisted, and cellular connectivity is predominantly provided by SCOM. Sturdy waterproof hiking boots, warm fleece layers, rain gear, and personal power banks are essential. Guided packages on PakistanTravel ensure travelers have reliable 4x4 transport, licensed local wilderness guides, verified wooden lodge stays, and direct communication with operators."
  ],
  "neelum-tour-packages": [
    "Logistics across Neelum Valley follow the scenic yet winding military and tourism corridor alongside the Line of Control. Travelers enjoy stopping at viewpoints like Titwal and Chilhana where the border river separates communities. Accommodations along the route range from traditional riverside wooden cabins in Keran to scenic hilltop guest houses in Arang Kel. Local cuisine features Kashmiri kulcha, pink salt tea (noon chai), and slow-cooked Kashmiri lamb curries. Booking through PakistanTravel guarantees verified bookings, licensed local drivers, and clear digital tour vouchers with no hidden booking fees."
  ],
  "neelum-valley-tour-packages": [
    "Exploring the full length of Neelum Valley allows travelers to experience the cultural transition from lower Kashmiri settlements to high-altitude Dardic and Shina-speaking communities in Taobat. Photography enthusiasts will find endless inspiration in the traditional tiered wooden architecture, wooden suspension bridges crossing the turquoise river, and wildflower-covered slopes. Independent tour operators on PakistanTravel organize complete end-to-end transport from Islamabad, pre-booked guest house rooms, and dedicated mountain guidance with transparent terms."
  ],
  "gilgit-baltistan-tour-packages": [
    "A grand expedition across Gilgit-Baltistan covers some of the most dramatic mountain terrain on earth. Navigating between Gilgit, Hunza, and Skardu allows travelers to witness the colossal north face of Rakaposhi (7,788m) rising directly from the highway, explore the confluence of the Indus and Gilgit Rivers where three mountain ranges meet, and discover rock petroglyphs carved by ancient Silk Road merchants along the riverbanks. PakistanTravel connects you directly with independent local operators who provide professional 4x4 vehicles, certified local guides, and digital vouchers for peace of mind."
  ],
  "winter-tours-pakistan": [
    "A successful winter tour in northern Pakistan depends on reliable mountain navigation and proper winter gear. Local operators on PakistanTravel use vehicles equipped with winter tire chains and experienced drivers familiar with black ice conditions on mountain passes. Accommodations are carefully selected to provide reliable room heating, hot water, and cozy mountain hospitality. Travelers can enjoy skiing, tubing, and snowboarding at Malam Jabba, take breathtaking chairlift rides over snow-covered pine forests in Patriata, or admire frozen turquoise ice formations along Attabad Lake in Hunza."
  ],
  "fairy-meadows-tours": [
    "Safety and proper preparation are paramount for the journey to Fairy Meadows. The jeep trail from Raikot Bridge is renowned as one of the world's most thrilling mountain tracks and is operated strictly by certified local village drivers with decades of terrain experience. Travelers should pack warm thermals, hiking poles, headlamps, and personal medications. Staying at wooden cottages at the base of Nanga Parbat offers an unforgettable stargazing experience beneath the Milky Way. Packages on PakistanTravel ensure verified cottage bookings, jeep transfers, and local guide coordination."
  ]
};

for (const [slug, paragraphs] of Object.entries(additions)) {
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
console.log('Successfully expanded all tour intents with additional paragraphs!');
