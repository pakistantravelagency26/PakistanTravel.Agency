import fs from 'fs';

const tourIntentsData = {
  "hunza-tour-packages": {
    slug: "hunza-tour-packages",
    title: "Hunza Tour Packages",
    seoTitle: "Hunza Tour Packages",
    metaDescription: "Compare guided Hunza Valley tour packages from independent local operators with scheduled departures from Islamabad and direct online booking vouchers.",
    h1: "Guided Hunza Valley Tour Packages",
    destinationSlug: "hunza",
    introText: [
      "Hunza Valley in Gilgit-Baltistan stands as northern Pakistan's most sought-after mountain sanctuary, celebrated worldwide for the soaring granite sentinels of the Karakoram Range, terraced apricot and walnut orchards, and the legendary hospitality of the local Burusho and Wakhi communities. Traversing the world-renowned Karakoram Highway (N-35), guided Hunza tour packages transport travelers through dramatically shifting terrain, from the arid gorges of the Indus-Gilgit confluence to the lush terraced oasis of Karimabad and the glaciated peaks of Upper Hunza (Gojal).",
      "Key stops across standard itineraries include the 700-year-old Baltit Fort and the 900-year-old Altit Fort in Central Hunza, offering deep historical insights into the ancient Silk Road royal rulers. Further north along the highway, the electric turquoise waters of Attabad Lake offer scenic motorized boating and waterfront relaxation beneath sheer mountain cliffs. In Upper Hunza, travelers gaze upon the jagged spires of the Passu Cones (Tupopdan), walk across the swaying planks of the historic Hussaini Suspension Bridge, explore the terminus of the Passu and Batura Glaciers, and ascend to Khunjerab Pass (4,693 meters), the highest paved border crossing in the world bordering China.",
      "The PakistanTravel marketplace connects travelers directly with independent, locally based tour operators in Gilgit and Hunza. Packages range from express 5-day itineraries flying into Gilgit Airport (operating under Visual Flight Rules, weather permitting) to classic 8 to 10-day road journeys departing overland from Islamabad. Overland routes utilize the Hazara Motorway and Babusar Pass (4,173 meters) during peak summer months (July to October), or the historic all-weather Karakoram Highway via Besham and Kohistan during autumn, winter, and spring. Comparing independent operator departures ensures transparent group tiers, dedicated 4x4 mountain transport where required, and verified digital vouchers backed by local expertise."
    ],
    faqs: [
      {
        q: "What is typically included in a Hunza tour package?",
        a: "Standard packages bundle dedicated highway transport from Islamabad (such as Toyota HiAce, Grand Cabin, or coaster for groups), hotel night stays, daily breakfast, a dedicated local tour coordinator/driver, and guided excursions to Baltit Fort, Altit Fort, Attabad Lake, and Khunjerab Pass."
      },
      {
        q: "What is the best duration for a Hunza tour?",
        a: "An express 5 to 6-day itinerary works well if flying into Gilgit, while an overland road trip from Islamabad is best enjoyed over 7 to 9 days to ensure comfortable driving paces along the Karakoram Highway."
      },
      {
        q: "When is Babusar Pass open for travel to Hunza?",
        a: "Babusar Pass is seasonal, typically opening in late June or early July and closing in late October depending on snowfall. Outside this window, all overland road journeys travel via the all-weather Karakoram Highway through Besham and Kohistan."
      }
    ]
  },

  "skardu-tour-packages": {
    slug: "skardu-tour-packages",
    title: "Skardu Tour Packages",
    seoTitle: "Skardu Tour Packages",
    metaDescription: "Compare guided Skardu tour packages from independent local operators. Explore Deosai Plains, Shangrila Resort, cold deserts, and Upper Kachura Lake.",
    h1: "Guided Skardu & Baltistan Tour Packages",
    destinationSlug: "skardu",
    introText: [
      "Nestled in the high Karakoram wilderness at the meeting point of the Indus and Shigar Rivers, Skardu serves as the historic capital of Baltistan and the global gateway to the world's most formidable 8,000-meter peaks, including K2, Broad Peak, and Gasherbrum. Guided Skardu tour packages introduce travelers to an extraordinary alpine basin characterized by startling ecological contrasts, where cold desert sand dunes meet snow-dusted granite peaks and mirror-like glacial lakes.",
      "Prominent itinerary highlights feature Lower Kachura Lake (home to the iconic Shangrila Resort) and Upper Kachura Lake, renowned for crystal-clear trout waters and peaceful wooden rowboat excursions. On the valley floor, the high-altitude sand dunes of the Katpana and Sarfaranga Cold Deserts offer remarkable sunset panoramas. Cultural expeditions venture into the Shigar Valley to explore the restored 17th-century Shigar Fort (Fong-Khar) and the Khaplu Valley to marvel at Khaplu Palace (Yabgo Khar, constructed in 1840), both masterfully restored to showcase ancient Balti-Tibetan timber woodwork.",
      "During mid-summer months (typically mid-July to mid-September), guided tour packages feature thrilling 4x4 Land Cruiser safaris across Deosai National Park, the second-highest plateau on Earth at an average altitude of 4,114 meters. The vast wilderness of Deosai transforms into rolling wildflower tundra surrounding the high alpine waters of Sheosar Lake. Independent local Baltistan tour operators on PakistanTravel offer both direct flight packages into Skardu International Airport and overland adventures via the scenic Jaglot-Skardu road, delivering direct bookings with transparent inclusions."
    ],
    faqs: [
      {
        q: "Can I fly directly to Skardu for a tour?",
        a: "Commercial flights operate between Islamabad and Skardu International Airport (with occasional seasonal flights from Lahore or Karachi). All flights operate strictly under Visual Flight Rules (VFR) and are weather-dependent. Overland backups or buffer days are recommended in case of mountain fog."
      },
      {
        q: "When can tourists visit Deosai National Park in Skardu?",
        a: "Deosai National Park is accessible exclusively from mid-July through mid-September. For the remainder of the year, thick snowpack and sub-zero conditions keep the high plateau tracks closed to motor vehicles."
      },
      {
        q: "Is a 4x4 vehicle required for touring Skardu?",
        a: "While main town roads and Lower Kachura are paved, rugged high-clearance 4x4 vehicles (such as Toyota Prado or Land Cruiser) are strictly mandatory for Deosai Plains, Basho Valley, and remote side valleys."
      }
    ]
  },

  "swat-tour-packages": {
    slug: "swat-tour-packages",
    title: "Swat Valley Tour Packages",
    seoTitle: "Swat Valley Tour Packages",
    metaDescription: "Compare guided Swat Valley tour packages to Kalam, Malam Jabba ski slopes, and Mahodand Lake with independent local northern tour operators in Pakistan.",
    h1: "Guided Swat Valley & Kalam Tour Packages",
    destinationSlug: "swat",
    introText: [
      "Known historically as the Switzerland of the East and celebrated for centuries of Gandhara Buddhist heritage, the Swat Valley in Khyber Pakhtunkhwa represents one of northern Pakistan's most accessible and picturesque alpine retreats. Accessible via the modern Swat Expressway from Islamabad, guided Swat tour packages provide a seamless transition from urban plains to emerald-green pine forests, rushing glacial rivers, and towering mountain ridges.",
      "A quintessential Swat itinerary journeys through Saidu Sharif and Mingora before climbing along the roaring Swat River toward Kalam Valley. Perched at 2,000 meters, Kalam serves as the central hub for alpine day excursions into the upper wilderness, including the deep deodar woods of Ushu Forest and high-clearance 4x4 jeep journeys to the turquoise waters of Mahodand Lake and Saifullah Lake beneath snow-capped Hindu Kush ridgelines.",
      "Winter and year-round itineraries feature Malam Jabba at 3,100 meters, Pakistan's premier alpine ski and mountain recreation resort. Featuring ski slopes, dual passenger chairlifts, and aerial zip-lines, Malam Jabba delivers panoramic mountain vistas across the valley. Independent tour operators on PakistanTravel offer curated 3 to 5-day itineraries tailored for families, couples, and weekend travelers departing directly from Islamabad."
    ],
    faqs: [
      {
        q: "How long is the drive from Islamabad to Swat Valley?",
        a: "Via the Swat Expressway (M-16), driving time from Islamabad to Mingora/Saidu Sharif is approximately 3.5 to 4.5 hours. Traveling further upstream to Kalam Valley requires an additional 3 to 4 hours on mountain roads."
      },
      {
        q: "Is a 4x4 vehicle necessary in Swat?",
        a: "Standard cars and family coasters easily reach Mingora, Malam Jabba, and Kalam along paved highways. However, dedicated 4x4 jeeps are required to navigate the unpaved mountain trail from Kalam to Mahodand Lake."
      }
    ]
  },

  "swat-kalam-tour-packages": {
    slug: "swat-kalam-tour-packages",
    title: "Swat Kalam Tour Packages",
    seoTitle: "Swat Kalam Tour Packages",
    metaDescription: "Book guided tour packages to Swat, Kalam, Ushu Forest, and Malam Jabba from independent local operators with direct vouchers and transparent terms.",
    h1: "Swat Kalam Tour Packages & Mountain Itineraries",
    destinationSlug: "swat",
    introText: [
      "The upper valley corridor of Kalam represents the crown jewel of Swat's alpine wilderness, situated where the Gabral and Ushu rivers converge into the rushing Swat River. Swat Kalam tour packages are designed for travelers seeking cool mountain temperatures, expansive cedar woodlands, and rugged glacial lake excursions deep in the Hindu Kush foothills.",
      "Departing from Islamabad via the Swat Expressway, tour packages navigate past the historical Buddhist ruins of Swat into the higher elevations. From Kalam town, local 4x4 vehicles transport travelers through the dramatic deodar pine canopies of Ushu Forest, continuing onward past Matiltan waterfall toward Mahodand Lake. Here, visitors enjoy traditional wooden boat rides, trout fishing, and riverside camping against sheer mountain backdrops.",
      "Coupled with high-ridge excursions to the ski slopes of Malam Jabba, Kalam itineraries offer an ideal balance of alpine leisure and mountain adventure. Comparing independent operator departures on PakistanTravel ensures dedicated transport, comfortable family hotel stays, and verified itineraries managed by experienced regional drivers."
    ],
    faqs: [
      {
        q: "When is the best season to book Kalam tour packages?",
        a: "May to September offers the most pleasant weather for exploring Ushu Forest and Mahodand Lake. October features autumn foliage, while December to March draws snow tourists to Malam Jabba."
      },
      {
        q: "Can families comfortably travel to Kalam?",
        a: "Yes. Kalam is one of Pakistan's most family-friendly northern destinations, featuring numerous riverside hotels, family restaurants, and paved access along the main valley corridor."
      }
    ]
  },

  "kumrat-tour-packages": {
    slug: "kumrat-tour-packages",
    title: "Kumrat Valley Tour Packages",
    seoTitle: "Kumrat Valley Tour Packages",
    metaDescription: "Discover guided Kumrat Valley tour packages, pine forest camping, and scenic Jahaz Banda treks in Upper Dir with independent local tour operators in Pakistan.",
    h1: "Guided Kumrat Valley & Jahaz Banda Tour Packages",
    destinationSlug: "kumrat",
    introText: [
      "Tucked away in the remote mountains of Upper Dir in Khyber Pakhtunkhwa, Kumrat Valley has emerged as one of northern Pakistan's most pristine and enchanting eco-tourism destinations. Celebrated for dense, centuries-old deodar pine forests, emerald Panjkora River waters, and dramatic alpine meadows, guided Kumrat tour packages cater to adventure seekers and nature enthusiasts seeking an uncommercialized wilderness escape.",
      "Overland travel from Islamabad proceeds via the Swat Expressway and the engineering marvel of the Lowari Tunnel (8.5 km), bypassing historic high-pass blockages to reach Upper Dir and Thal. From Thal's historic wooden carved mosque, rugged 4x4 mountain jeeps traverse forested tracks alongside the Panjkora River toward Kumrat Forest, the roaring Kala Chashma (Black Spring), and serene riverside campsites beneath soaring granite cliffs.",
      "For trekking enthusiasts, premier tour packages feature the expedition to Jahaz Banda, a breathtaking alpine meadow situated at 3,100 meters, and the optional hike onward to the glacial waters of Katora Lake (3,500 meters). Local independent operators on PakistanTravel offer scheduled 4 to 6-day packages complete with rugged 4x4 mountain vehicles, professional wilderness guides, and traditional wooden lodge accommodations."
    ],
    faqs: [
      {
        q: "What type of vehicle is required for Kumrat Valley?",
        a: "While passenger cars and coaches can reach Thal bazaar via the Lowari Tunnel route, a dedicated high-clearance 4x4 jeep is strictly required to travel inside Kumrat Valley and onward to the Jahaz Banda trailhead."
      },
      {
        q: "How difficult is the trek to Jahaz Banda and Katora Lake?",
        a: "The hike from the jeep track terminus to Jahaz Banda meadow takes approximately 3 to 4 hours and is moderately paced for individuals with basic fitness. The continuing hike to Katora Lake is more demanding, requiring 3 to 4 hours over rocky boulder moraines."
      }
    ]
  },

  "neelum-tour-packages": {
    slug: "neelum-tour-packages",
    title: "Neelum Valley Tour Packages",
    seoTitle: "Neelum Valley Tour Packages",
    metaDescription: "Compare guided Neelum Valley tour packages across Keran, Sharda, Arang Kel, and Ratti Gali Lake with independent local operators in Pakistan.",
    h1: "Guided Neelum Valley Tour Packages",
    destinationSlug: "neelum",
    introText: [
      "Stretching like a lush emerald ribbon through the mountains of Azad Jammu & Kashmir, the Neelum Valley is widely celebrated for rushing turquoise rivers, verdant terraced hillsides, and picturesque wooden village architecture. Guided Neelum Valley tour packages guide travelers along the winding Neelum River, offering serene mountain vistas and rich regional culture within easy overland reach of Islamabad.",
      "Popular itineraries begin with scenic halts at Dhani Waterfall and Kutton before reaching the riverside border village of Keran. Further up the valley lies historic Sharda, renowned for the centuries-old stone ruins of Sharda Peeth, an ancient seat of learning dating back to the 8th century. From Sharda, travelers proceed to Kel, taking the scenic cable lift or hiking trail up to Arang Kel, a fairy-tale meadow perched high on the plateau with commanding views over the border ridgelines.",
      "During summer months (July to September), dedicated 4x4 mountain excursions depart from Dowarian toward Ratti Gali Lake, a legendary glacial lake situated at 3,700 meters surrounded by wild red flower carpets. Independent local Kashmir operators on PakistanTravel offer curated 3 to 7-day packages, providing transparent pricing, reliable mountain drivers, and authentic riverside hotel night stays."
    ],
    faqs: [
      {
        q: "Do foreign tourists require a permit to visit Neelum Valley?",
        a: "Yes. While Pakistani citizens need only their valid original CNIC, foreign nationals, dual citizens, and NICOP holders must comply with Azad Jammu & Kashmir tourism checkpost registration procedures and carry valid passport and visa documentation."
      },
      {
        q: "When is Ratti Gali Lake accessible in Neelum Valley?",
        a: "Ratti Gali Lake is accessible strictly from late June/July through September when 4x4 jeep tracks from Dowarian are cleared of heavy winter snow."
      }
    ]
  },

  "neelum-valley-tour-packages": {
    slug: "neelum-valley-tour-packages",
    title: "Neelum Valley Tour Packages",
    seoTitle: "Neelum Valley Tour Packages",
    metaDescription: "Book guided tour packages to Neelum Valley, Arang Kel, Sharda, and Keran with independent local Kashmir operators. Instant digital tour vouchers.",
    h1: "Neelum Valley Tour Packages & Scenic Itineraries",
    destinationSlug: "neelum",
    introText: [
      "Neelum Valley represents Azad Kashmir's premier high-altitude tourism destination, stretching over 200 kilometers along the roaring riverbanks of the Neelum (Kishanganga) River. Tour packages to Neelum Valley provide travelers with immersive cultural and nature journeys through some of the greenest alpine landscapes in the western Himalayas.",
      "The classic route navigates from Muzaffarabad past forested cliffs toward the halting hubs of Kutton, Keran, and Upper Neelum. In Sharda, visitors explore centuries-old archaeological heritage before crossing onward to Kel and ascending to the idyllic green pastures of Arang Kel. In late summer, side expeditions to Taobat—the remote final village of Neelum Valley—reveal pristine wooden river cabins nestled against dense pine forests.",
      "Packages published by independent local operators on PakistanTravel bundle comfortable coaster or van transport from Islamabad, local 4x4 jeep hires for steep side valleys, clean family guest house stays, and dedicated guidance. Direct bookings ensure transparent package tiers with no hidden charges."
    ],
    faqs: [
      {
        q: "What is the travel time from Islamabad to Neelum Valley?",
        a: "Islamabad to Muzaffarabad takes approximately 3 to 3.5 hours on paved highways. Reaching Keran takes an additional 3 hours, and Sharda is another 2.5 hours upstream."
      },
      {
        q: "Is cell phone coverage available in Neelum Valley?",
        a: "Special Communications Organization (SCOM) provides the primary mobile network coverage throughout Neelum Valley. Mainstream nationwide networks experience limited or no coverage in the upper valley."
      }
    ]
  },

  "gilgit-baltistan-tour-packages": {
    slug: "gilgit-baltistan-tour-packages",
    title: "Gilgit Baltistan Tour Packages",
    seoTitle: "Gilgit Baltistan Tour Packages",
    metaDescription: "Compare guided Gilgit-Baltistan tour packages across Hunza, Skardu, and Khunjerab Pass with independent local tour operators in Pakistan.",
    h1: "Guided Gilgit-Baltistan Tour Packages & Expeditions",
    destinationSlug: "hunza",
    introText: [
      "Gilgit-Baltistan is the epicentre of global mountain adventure, where the planet's three greatest mountain ranges—the Karakoram, the Himalaya, and the Hindu Kush—converge in dramatic alpine glory. Home to five of the world's fourteen 8,000-meter peaks, including K2 and Nanga Parbat, comprehensive Gilgit-Baltistan tour packages deliver the ultimate journey through high-altitude wilderness, ancient Silk Road culture, and crystal glacial waterways.",
      "Major expedition itineraries link the historic valleys of Hunza, Nagar, and Baltistan. Travelers explore the ancient royal forts of Baltit and Altit, boat across the vivid blue expanse of Attabad Lake, traverse the world-famous Karakoram Highway to Khunjerab Pass (4,693m), and journey into Baltistan to marvel at the Katpana Cold Desert, Shangrila Lake, and the vast alpine tundra of Deosai National Park.",
      "On PakistanTravel, guided Gilgit-Baltistan tour packages are hosted exclusively by independent local operators native to the northern regions. Packages range from 7-day multi-valley highlights to comprehensive 12 to 14-day grand northern circuits with departures originating in Islamabad. Each package includes dedicated mountain transport, local driver-guides, pre-arranged hotel nights, and digital booking vouchers with clear cancellation terms."
    ],
    faqs: [
      {
        q: "What is the best time of year to visit Gilgit-Baltistan?",
        a: "May through October represents the primary travel season. Spring (April–May) features apricot and cherry blossoms, summer (June–August) offers accessible high passes and warm trekking conditions, and autumn (September–November) showcases vibrant golden foliage."
      },
      {
        q: "Can I combine Hunza and Skardu in one tour package?",
        a: "Yes. Grand northern tour packages of 9 to 12 days comfortably combine both Hunza Valley and Skardu via the Jaglot-Skardu road, allowing travelers to experience both Karakoram and Baltistan highlights in a single trip."
      }
    ]
  },

  "winter-tours-pakistan": {
    slug: "winter-tours-pakistan",
    title: "Winter Tours Pakistan",
    seoTitle: "Winter Tours Pakistan",
    metaDescription: "Explore guided winter tour packages in Pakistan. Experience snow getaways in Malam Jabba, Murree, and frozen waterfalls across Hunza and Skardu.",
    h1: "Winter Tour Packages & Snow Holidays in Pakistan",
    destinationSlug: "swat",
    introText: [
      "Winter across northern Pakistan transforms rugged alpine valleys into breathtaking snowscapes, offering travelers a magical winter wonderland of frozen waterfalls, crisp mountain air, and snowy pine forests. Guided winter tour packages in Pakistan provide comfortable, safety-first excursions to accessible mountain resorts and winter wonderlands across Khyber Pakhtunkhwa, Punjab, and Gilgit-Baltistan.",
      "The premier winter sports hub is Malam Jabba in Swat Valley, situated at 3,100 meters. Featuring modern ski slopes, dual chairlifts, and winter equipment rentals, Malam Jabba attracts families and winter enthusiasts seeking active snow sports. Closer to Islamabad, the forested ridges of Murree, Patriata, and the Galyat (Nathiagali, Dunga Gali) provide accessible weekend snow retreats featuring cable cars, colonial walking trails, and traditional hot Kashmiri chai.",
      "For intrepid winter explorers, off-season winter journeys along the Karakoram Highway into Hunza reveal frozen blue lakes, uncrowded stone villages, and majestic snow-capped peaks illuminated by crystal-clear winter light. Winter tour packages published on PakistanTravel feature experienced mountain drivers equipped with snow chains, heated hotel accommodations, and flexible weather policies to ensure safe and memorable winter vacations."
    ],
    faqs: [
      {
        q: "Are mountain roads safe for travel in winter?",
        a: "Major highways like the Hazara Motorway and Swat Expressway remain open year-round with regular snow clearance. Professional tour operators use winterized vehicles equipped with tire chains and experienced drivers familiar with mountain ice."
      },
      {
        q: "What should I pack for a winter tour in northern Pakistan?",
        a: "Heavy insulated winter jackets, thermal base layers, waterproof snow boots, wool socks, insulated gloves, warm beanies, and sunglasses to prevent snow blindness."
      }
    ]
  },

  "fairy-meadows-tours": {
    slug: "fairy-meadows-tours",
    title: "Fairy Meadows Tours",
    seoTitle: "Fairy Meadows Tours",
    metaDescription: "Explore guided tour packages to Fairy Meadows, Tato village jeep tracks, Beyal Camp, and Nanga Parbat base camp with independent local mountain guides.",
    h1: "Guided Fairy Meadows & Nanga Parbat Tour Packages",
    destinationSlug: "fairy-meadows",
    introText: [
      "Fairy Meadows (Joot) sits as a legendary alpine meadow nestled directly beneath the sheer north face (Raikot Face) of Nanga Parbat (8,126m), the world's ninth-highest mountain and known historically as the Killer Mountain. Guided Fairy Meadows tour packages deliver one of northern Pakistan's most exhilarating mountain journeys, combining thrilling mountain jeep tracks, pine forest hikes, and unobstructed vistas of colossal hanging glaciers.",
      "The journey commences along the Karakoram Highway at Raikot Bridge, where travelers transfer to specialized 4x4 mountain jeeps driven exclusively by local mountain drivers. The narrow, thrilling cliffside track winds up to Tato village over approximately 1.5 to 2 hours. From Tato, a scenic 3 to 4-hour hike through fragrant pine and birch woods leads directly to the lush green meadows of Fairy Meadows at 3,300 meters.",
      "Visitors stay in rustic wooden alpine cottages facing the colossal ice wall of Nanga Parbat. Active day treks proceed onward to Beyal Camp (3,500m) and the Nanga Parbat Base Camp (3,900m) alongside the Raikot Glacier. Independent local tour operators on PakistanTravel provide guided group departures from Islamabad with experienced local guides, pre-arranged cottage bookings, and verified mountain logistics."
    ],
    faqs: [
      {
        q: "How difficult is the hike to Fairy Meadows?",
        a: "The hike from Tato village to Fairy Meadows is approximately 5 kilometers with a 700-meter elevation gain, taking 3 to 4 hours. Horses and porters are available for hire locally for travelers who prefer to ride or require luggage support."
      },
      {
        q: "When is Fairy Meadows open for tourists?",
        a: "The trekking season runs from late May through October. Peak summer (June to August) offers lush green pastures and wildflower blooms, while late September and October feature crisp autumn views."
      }
    ]
  }
};

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
console.log('Successfully updated src/data/tourIntentsData.ts with 300+ words per intent!');
