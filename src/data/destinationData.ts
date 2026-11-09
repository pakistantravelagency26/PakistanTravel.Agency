export interface DestinationSeoData {
  slug: string;
  name: string;
  province: string;
  heroImage: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  keyFacts?: {
    altitude: string;
    bestSeason: string;
    distanceFromIslamabad: string;
    roadCondition: string;
  };
  overview: string[];
  bestTimeToVisit: {
    peakSeason: string;
    peakDescription: string;
    shoulderSeason: string;
    shoulderDescription: string;
    offSeason: string;
    offDescription: string;
  };
  approximateCosts: {
    budgetPerDay: string;
    midRangePerDay: string;
    luxuryPerDay: string;
    notes: string;
  };
  topAttractions: {
    name: string;
    description: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

export const destinationsData: Record<string, DestinationSeoData> = {
  hunza: {
    slug: "hunza",
    name: "Hunza Valley",
    province: "Gilgit-Baltistan",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80",
    tagline: "The Jewel of the Karakoram Highway & Ancient Terraced Mountain Valleys",
    seoTitle: "Hunza Valley Tour Packages",
    seoDescription: "Compare and book guided tour packages across Hunza, Karimabad, Attabad Lake, and Passu Cones from independent local tour operators.",
    keyFacts: {
      altitude: "2,438 meters (Karimabad) to 2,500+ meters (Upper Hunza / Gojal)",
      bestSeason: "May to October (Blossom: April; Autumn foliage: October)",
      distanceFromIslamabad: "Approx 590 km (14–16 hours via Babusar in summer, 16–18 hours via KKH Besham; or 45-min flight to Gilgit + 2 hours drive)",
      roadCondition: "Fully paved asphalt along the Karakoram Highway (N-35). Suitable for all vehicle types along the main highway."
    },
    overview: [
      "Perched high amidst the majestic Karakoram Range in northern Gilgit-Baltistan, Hunza Valley stands as one of the most mesmerizing mountain sanctuaries on earth. Famed globally for its exceptionally welcoming Wakhi and Burusho communities, pristine turquoise glacial waters, and soaring 7,000-meter sentinels like Rakaposhi, Ladyfinger Peak, and Ultar Sar, Hunza captures the imagination of travelers seeking both serenity and high-altitude adventure.",
      "The historical heartbeat of Hunza beats within Karimabad, once the royal capital of the princely state of Hunza. Here, two ancient stone fortresses—Baltit Fort (over 700 years old with Tibetan architectural influences) and the 900-year-old Altit Fort—stand as testaments to centuries of Silk Road heritage. Walking through the stone alleyways of Karimabad, visitors discover family-run apricot oil presses, walnut wood workshops, and gemstone boutiques.",
      "Upper Hunza, known locally as Gojal, unfolds into breathtaking glacial landscapes. The world-famous Attabad Lake, formed in 2010 following a massive mountain landslide, dazzles visitors with electric turquoise water framed by towering slate cliffs. Further north, the jagged cathedral spires of the Passu Cones (Tupopdan) pierce the alpine sky alongside the vast Passu Glacier and the daring Passu suspension bridge swaying gently across the glacial river.",
      "Beyond scenic wonders, Hunza is renowned for culinary excellence rooted in organic mountain agriculture. Savor traditional chapshuro (Karakoram meat pies baked over stone fires), ghol-ghol, apricot kernel soup, and fresh cherries plucked right from terrace orchards. With exceptionally high literacy rates and exemplary mountain hospitality, Hunza consistently ranks as one of Pakistan's safest and most rewarding travel destinations for families, couples, and solo travelers alike."
    ],
    bestTimeToVisit: {
      peakSeason: "May to August (Summer)",
      peakDescription: "Pleasant temperatures ranging between 18°C and 28°C. Ideal for exploring lakes, river jet-skiing at Attabad Lake, Khunjerab Pass excursions, and high-altitude treks.",
      shoulderSeason: "September to October (Autumn Blossom)",
      shoulderDescription: "World-renowned autumn foliage transforms the valley into shades of gold, amber, and crimson. Cooler nights with clear mountain views and minimal tourist crowds.",
      offSeason: "November to March (Winter & Cherry Blossom)",
      offDescription: "Crisp snowy landscapes with frozen waterfalls. Mid-March to late April introduces the spectacular pink cherry blossom season across Karimabad and Gulmit."
    },
    approximateCosts: {
      budgetPerDay: "PKR 7,500 – 12,000",
      midRangePerDay: "PKR 18,000 – 35,000",
      luxuryPerDay: "PKR 45,000 – 85,000+",
      notes: "Estimated package costs are based on 2026 market rates and fluctuate with season and itinerary duration. Dedicated 4x4 private transport and certified guide are included in guided tour packages."
    },
    topAttractions: [
      { name: "Baltit & Altit Forts", description: "Ancient royal stone citadels offering panoramic views of Rakaposhi and the valley terraces." },
      { name: "Attabad Lake & Boating", description: "Deep turquoise glacial lake offering scenic boating and waterfront viewpoints." },
      { name: "Passu Cones & Glacier", description: "Iconic serrated mountain peaks and adjacent accessible glaciers located along the Karakoram Highway." },
      { name: "Eagle's Nest Duikar", description: "Highest elevated viewpoint in Central Hunza, celebrated for breathtaking 360-degree sunrises and sunsets." },
      { name: "Hussaini & Passu Suspension Bridges", description: "Thrilling hanging wooden rope bridges crossing the river with dramatic mountain backdrops." },
      { name: "Khunjerab National Park & Border", description: "The highest paved international border crossing in the world at 4,693 meters, bordering China." }
    ],
    faqs: [
      {
        q: "How do I reach Hunza Valley from Islamabad?",
        a: "You can either fly into Gilgit Airport (45-minute commercial flight under Visual Flight Rules, weather permitting) followed by a 2-hour drive on the Karakoram Highway, or travel overland via the Hazara Motorway and Babusar Pass (open late June/July to late October) or via KKH Besham."
      },
      {
        q: "When is Babusar Pass open for travel to Hunza?",
        a: "Babusar Pass (4,173 meters) is strictly weather-dependent. It typically opens in late June or early July after heavy snow is cleared, and closes in late October with the first major autumn snowfall. Outside this window, all overland travel must use the Karakoram Highway via Besham and Kohistan."
      },
      {
        q: "Is Hunza safe for solo and family travelers?",
        a: "Yes. Hunza is widely recognized as one of the safest regions in South Asia, characterized by high literacy, progressive community culture, and welcoming hospitality."
      }
    ]
  },

  skardu: {
    slug: "skardu",
    name: "Skardu & Baltistan",
    province: "Gilgit-Baltistan",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=80",
    tagline: "The Realm of 8,000m Giants, Cold Deserts & Turquoise Alpine Lakes",
    seoTitle: "Skardu Tour Packages",
    seoDescription: "Compare and book guided Skardu tour packages, Deosai Plains excursions, and Upper Kachura trips directly from independent local operators.",
    keyFacts: {
      altitude: "2,228 meters (Skardu town) to 4,114 meters (Deosai National Park plateau)",
      bestSeason: "May to October (Deosai plateau road strictly accessible mid-July to mid-September)",
      distanceFromIslamabad: "Approx 630 km (16–18 hours via Jaglot-Skardu highway, or 1 hour direct commercial flight to Skardu Airport)",
      roadCondition: "Paved Karakoram Highway and dual-lane Jaglot-Skardu road. High-clearance 4x4 vehicles strictly required for Deosai Plains, Basho Valley, and Bilamik."
    },
    overview: [
      "Set against the rugged granite battlements of the central Karakoram, Skardu is the historic capital of Baltistan and Pakistan's premier high-altitude adventure center. Lying at the confluence of the mighty Indus and Shigar Rivers, this expansive alpine basin presents startling geographical contrasts: high-elevation cold desert sand dunes immediately bordered by snow-capped 7,000-meter peaks and shimmering glacial lakes.",
      "Skardu serves as the starting springboard for worldwide expeditions to K2, Broad Peak, Gasherbrum I & II, and the legendary Trango Towers. Beyond mountaineering expeditions, Skardu has evolved into a premier northern vacation hub. Travelers explore the Katpana and Sarfaranga Cold Deserts, where snow-dusted dunes meet craggy alpine cliffs under crystal-clear night skies.",
      "Just south of the valley lies Deosai National Park, affectionately nicknamed 'The Land of the Giants'. Spanning over 3,000 square kilometers at an average elevation of 4,114 meters, it is the second-highest alpine plateau on Earth. During mid-summer, Deosai transforms into rolling wildflower grasslands surrounding Sheosar Lake, while providing habitat for the Himalayan Brown Bear.",
      "In the lower valleys of Shigar and Khaplu, ancient Balti culture thrives. The 400-year-old Shigar Fort (Fong-Khar) and 19th-century Khaplu Palace have been restored into heritage accommodations, preserving traditional Tibetan-Mughal timber carvings and lush royal orchards."
    ],
    bestTimeToVisit: {
      peakSeason: "June to August (Mid-Summer)",
      peakDescription: "Warm daytime temperatures around 20°C to 28°C. Deosai National Park opens after snow clearance, lakes are accessible, and direct commercial flights operate from Islamabad, Lahore, and Karachi.",
      shoulderSeason: "September to October (Autumn Foliage)",
      shoulderDescription: "Vibrant yellow poplars and orange apricot orchards set against clear blue skies. Crisp mountain air and minimal tourist traffic.",
      offSeason: "November to March (Winter Snow)",
      offDescription: "Freezing temperatures and snow across the basin. Flights operate under VFR rules and face frequent cancellations during fog or low clouds."
    },
    approximateCosts: {
      budgetPerDay: "PKR 8,500 – 14,000",
      midRangePerDay: "PKR 22,000 – 42,000",
      luxuryPerDay: "PKR 55,000 – 110,000+",
      notes: "Estimated package costs are based on 2026 market rates. Dedicated 4x4 mountain vehicles (Land Cruiser / Prado) are included in guided tour itineraries for accessing Deosai Plains, Basho Valley, and Upper Kachura Lake."
    },
    topAttractions: [
      { name: "Deosai Plains & Sheosar Lake", description: "Second-highest alpine plateau on Earth, famed for Himalayan brown bears and wild flower carpets (mid-July to mid-September)." },
      { name: "Shangrila Resort & Lower Kachura Lake", description: "Iconic heart-shaped mountain lake surrounded by pagoda villas and orchards." },
      { name: "Upper Kachura Lake", description: "Pristine natural glacial lake famous for crystal trout fishing and wooden boat rides." },
      { name: "Sarfaranga & Katpana Cold Deserts", description: "Dramatic high-altitude sand dunes framed by rugged snow-capped peaks." },
      { name: "Shigar Fort & Khaplu Palace", description: "Centuries-old restored Balti royal palaces showcasing historic timber craftsmanship." }
    ],
    faqs: [
      {
        q: "Are there direct flights to Skardu?",
        a: "Direct commercial flights operate from Islamabad, and seasonally from Lahore and Karachi, to Skardu International Airport. All flights operate strictly under Visual Flight Rules (VFR) and are weather-dependent. Flights are frequently canceled or delayed during winter fog, poor visibility, or mountain cloud cover. Travelers should always maintain 1 to 2 buffer days in their itinerary."
      },
      {
        q: "When is Deosai National Park road open?",
        a: "Deosai National Park (average elevation 4,114 meters) is strictly accessible from mid-July through mid-September depending on snow clearance. In winter, spring, and early summer, heavy snowdrifts and sub-zero temperatures keep the plateau tracks closed to motor vehicles."
      },
      {
        q: "Do I need a 4x4 vehicle in Skardu?",
        a: "While main town roads between Skardu, Shigar, and Shangrila are paved, reaching Deosai Plains, Basho Valley, Bilamik, and Upper Kachura access tracks strictly requires high-clearance 4x4 vehicles."
      }
    ]
  },

  swat: {
    slug: "swat",
    name: "Swat Valley & Kalam",
    province: "Khyber Pakhtunkhwa",
    heroImage: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1600&auto=format&fit=crop&q=80",
    tagline: "The Switzerland of the East: Alpine Meadows, Glacial Lakes & Buddhist Heritage",
    seoTitle: "Swat Valley Tour Packages",
    seoDescription: "Compare and book guided tour packages across Swat, Kalam, Malam Jabba, and Mahodand Lake from independent local tour operators in Pakistan.",
    keyFacts: {
      altitude: "980 meters (Mingora) to 2,000+ meters (Kalam) and 3,100 meters (Malam Jabba ski resort)",
      bestSeason: "April to October (Spring/Summer), December to February (Malam Jabba ski season)",
      distanceFromIslamabad: "Approx 245 km (3.5–4.5 hours via the modern Swat Motorway M-16)",
      roadCondition: "Fully paved modern motorway (M-16) and dual carriageway up to Bahrain. Bahrain to Kalam is paved with seasonal road maintenance. Kalam to Mahodand Lake requires 4x4 jeeps."
    },
    overview: [
      "Nestled in the foothills of the Hindu Kush range in northern Khyber Pakhtunkhwa, Swat Valley has long captured the hearts of mountain travelers. Revered as the historic center of the ancient Gandhara Buddhist civilization, Swat combines deep archaeological heritage with lush alpine meadows, dense pine forests, and rushing glacial streams.",
      "The lower valley centers around the twin towns of Mingora and Saidu Sharif, where the Swat Museum preserves precious Gandharan Buddhist sculptures and ancient relics from monasteries like Butkara I and Shingardar Stupa. Continuing northward along the Swat River, orchards of peaches, persimmons, and apples cover the valley terraces.",
      "As you climb higher past Bahrain, the scenery transforms dramatically into alpine wilderness around Kalam. Sitting at 2,000 meters above sea level, Kalam serves as the central hub for treks into upper glacial valleys including Ushu, Matiltan, and the turquoise glacial waters of Mahodand and Kundol Lakes.",
      "To the east, the mountain ridge of Malam Jabba hosts Pakistan's premier alpine ski resort at an elevation of 3,100 meters. Featuring a modern ski slope, dual chairlifts, and a mountain zip-line, Malam Jabba attracts winter sports enthusiasts from across the country."
    ],
    bestTimeToVisit: {
      peakSeason: "May to August (Summer)",
      peakDescription: "Pleasant mountain temperatures (20°C to 28°C) offering an ideal retreat from plains heat. All high-altitude alpine lakes are accessible.",
      shoulderSeason: "September to November (Autumn)",
      shoulderDescription: "Crisp autumn mornings with golden foliage in upper orchards. Low tourist traffic and pleasant driving conditions.",
      offSeason: "December to March (Winter Snow & Skiing)",
      offDescription: "Malam Jabba transforms into an active ski and snowboard center with sub-zero temperatures and snowy landscapes."
    },
    approximateCosts: {
      budgetPerDay: "PKR 6,000 – 10,000",
      midRangePerDay: "PKR 15,000 – 28,000",
      luxuryPerDay: "PKR 35,000 – 65,000+",
      notes: "Estimated package costs are based on 2026 market rates. Guided tour packages include hotel accommodation, private transport, and local 4x4 mountain vehicles for Mahodand Lake."
    },
    topAttractions: [
      { name: "Malam Jabba Ski Resort & Chairlift", description: "Scenic mountain ridge at 3,100m featuring ski slopes, chairlift rides, and alpine zip-lines." },
      { name: "Kalam Valley Pine Meadows", description: "Charming mountain town surrounded by dense pine forests, rushing waterfalls, and trout streams." },
      { name: "Mahodand & Saifullah Lakes", description: "Turquoise glacial lakes in the upper Ushu Valley framed by snow-covered mountain peaks (accessible by 4x4)." },
      { name: "Swat Museum & Buddhist Relics", description: "Internationally renowned collection of Gandharan Buddhist art, stone carvings, and stupa ruins." },
      { name: "White Palace (Sufed Mahal) Marghazar", description: "Historic 1940s royal residence of the Wali of Swat built entirely from white marble." }
    ],
    faqs: [
      {
        q: "How long does it take to drive to Swat from Islamabad?",
        a: "Thanks to the modern Swat Motorway (M-16), driving from Islamabad to Mingora takes approximately 3.5 to 4 hours. Continuing onward to Kalam adds another 2.5 to 3 hours along the Swat River road."
      },
      {
        q: "Is a 4x4 vehicle required for Swat Valley?",
        a: "A regular sedan car can comfortably drive to Mingora, Malam Jabba, and Kalam along paved roads. However, accessing upper lakes like Mahodand or Kundol requires local high-clearance 4x4 jeeps due to unpaved dirt and boulder tracks."
      }
    ]
  },

  kumrat: {
    slug: "kumrat",
    name: "Kumrat Valley & Dir",
    province: "Khyber Pakhtunkhwa",
    heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80",
    tagline: "Dense Deodar Pine Wilderness, Roaring Rivers & Alpine Glacial Tarns",
    seoTitle: "Kumrat Valley Tour Packages",
    seoDescription: "Discover guided Kumrat Valley tour packages, Jahaz Banda treks, and river camping in Upper Dir directly from independent local operators.",
    keyFacts: {
      altitude: "2,400 meters (Kumrat Forest) to 3,100 meters (Jahaz Banda) and 3,500 meters (Katora Lake)",
      bestSeason: "June to September (Jahaz Banda trek and Katora Lake accessible after snow melts)",
      distanceFromIslamabad: "Approx 370 km (8–10 hours via Swat Motorway, Dir, and Thal)",
      roadCondition: "Paved highway from Islamabad/Peshawar to Upper Dir and Thal. From Thal into Kumrat Forest, standard cars CANNOT travel; high-clearance 4x4 vehicles are strictly required."
    },
    overview: [
      "Tucked away in the secluded Upper Dir district of Khyber Pakhtunkhwa, Kumrat Valley is one of Pakistan's most pristine alpine wildernesses. Famous for its towering deodar pine forest canopy, roaring Panjkora River, and emerald-colored glacial tarns, Kumrat provides an authentic escape for eco-travelers, campers, and wilderness adventurers.",
      "The gateway to Kumrat begins at the historic village of Thal, famous for its centuries-old wooden Friday Mosque, built entirely of deodar cedar without a single iron nail and adorned with intricate geometric timber carvings. Crossing from Thal into the valley, the paved road gives way to rugged 4x4 mountain trails flanked by rushing glacial waters.",
      "The valley floor is defined by the dense Kumrat Forest, where deodar pine trees reach towering heights above carpets of wild moss and alpine ferns. Riverside wooden huts, eco-campsites, and glamping pods sit right along the Panjkora River, where visitors enjoy campfire dinners under star-filled skies.",
      "For mountain hikers and trekkers, Kumrat offers the legendary trek to Jahaz Banda (Ship Meadow) and Katora Lake (Bowl Lake). Jahaz Banda sits at an altitude of 3,100 meters, opening into an expansive amphitheater of lush green pastures surrounded by snow peaks and grazing horses. Further up a demanding stone trail lies Katora Lake at 3,500 meters, a mesmerizing glacial cirque whose diamond-clear waters reflect towering granite walls."
    ],
    bestTimeToVisit: {
      peakSeason: "June to August (Summer)",
      peakDescription: "Pleasant temperatures (16°C to 24°C). The trail to Jahaz Banda is lush green, rivers are full, and camping conditions are comfortable.",
      shoulderSeason: "September to October (Early Autumn)",
      shoulderDescription: "Cooler crisp mountain air with quiet trails. Glacial streams run crystal-clear with golden tints appearing in high meadows.",
      offSeason: "November to April (Heavy Snow Isolation)",
      offDescription: "Kumrat receives heavy winter snowfall, completely closing upper tracks to general tourism. Recommended only for experienced winter mountaineering expeditions."
    },
    approximateCosts: {
      budgetPerDay: "PKR 5,500 – 9,500",
      midRangePerDay: "PKR 14,000 – 26,000",
      luxuryPerDay: "PKR 30,000 – 55,000+",
      notes: "Estimated costs are based on 2026 market rates. 4x4 mountain jeeps and camping arrangements are included in organized tour packages from Thal into Kumrat Forest and Jahaz Banda."
    },
    topAttractions: [
      { name: "Dense Kumrat Pine Forest", description: "Towering deodar cedar forest canopy along the crystal-clear roaring Panjkora River." },
      { name: "Jahaz Banda High Alpine Meadow", description: "Expansive green plateau at 3,100m offering horse-riding, shepherd huts, and panoramic snowy views." },
      { name: "Katora Glacial Lake", description: "Spectacular emerald-blue alpine cirque lake at 3,500m surrounded by towering granite spires." },
      { name: "Historic Wooden Mosque of Thal", description: "Centuries-old architectural landmark crafted entirely from carved cedar logs." },
      { name: "Kumrat Waterfall & Do Janga", description: "Spectacular cascading glacial waterfall and the confluence point of two roaring mountain torrents." }
    ],
    faqs: [
      {
        q: "What is the road condition to Kumrat Valley?",
        a: "The road is fully paved from Islamabad and Peshawar up to Upper Dir and Thal village. From Thal into Kumrat Valley, standard cars cannot traverse; high-clearance 4x4 jeeps are strictly required due to unpaved dirt and river-stone tracks."
      },
      {
        q: "Can families visit Kumrat Valley?",
        a: "Yes. Families can comfortably visit riverside resorts, glamping pods, and wooden cottages in the main Kumrat Forest on guided 4x4 packages. The trek up to Jahaz Banda and Katora Lake, however, is moderately strenuous and best suited for active hikers."
      }
    ]
  },

  murree: {
    slug: "murree",
    name: "Murree & Galyat",
    province: "Punjab & KP",
    heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80",
    tagline: "Colonial Hill Stations, Pine Ridges & Winter Snowscapes",
    seoTitle: "Murree Tour Packages",
    seoDescription: "Explore guided Murree and Galyat tour packages, Patriata chairlift excursions, and scenic pine ridge getaways from independent operators.",
    keyFacts: {
      altitude: "2,291 meters (Murree Mall Road) to 2,800+ meters (Mukshpuri & Miranjani Peaks)",
      bestSeason: "May to September (Cool summer escape), December to February (Winter snowfall)",
      distanceFromIslamabad: "Approx 65 km (1.5 hours via the modern Murree Expressway E-75)",
      roadCondition: "Fully paved multi-lane expressway (E-75) and mountain dual carriageways. Winter blizzards require snow chains and cautious driving."
    },
    overview: [
      "Perched in the Pir Panjal mountain range just 65 kilometers northeast of Islamabad, Murree and the neighboring Galyat hill stations have served as Pakistan's most accessible highland retreats for over a century. Established as a colonial summer hill station in the 1850s, Murree combines old-world heritage architecture with pine-covered ridges.",
      "The town's famous spine is Mall Road, a vibrant pedestrian promenade lined with mountain handicraft shops, traditional cafes, and hillside viewpoints looking across the rolling hills of Hazara and Rawalpindi. Nearby, the historic Holy Trinity Church and colonial bungalows reflect 19th-century history.",
      "To the north, the Galyat range connects Murree with Abbottabad through scenic mountain roads winding through Changla Gali, Dunga Gali, and Nathiagali. In Nathiagali, visitors hike the famous Pipeline Track—a gentle, pine-canopied trail following historic water pipelines into Ayubia National Park.",
      "For mountain hikers, Mukshpuri Peak (2,800 meters) and Miranjani Peak (2,960 meters) offer rewarding day treks through fragrant pine and cedar woods, rewarding hikers with panoramic vistas across the Jhelum valley and snow-covered Kashmir ranges."
    ],
    bestTimeToVisit: {
      peakSeason: "May to August (Summer Escape)",
      peakDescription: "Cool mountain temperatures (18°C to 25°C) providing rapid relief from scorching summer heat across Punjab and Sindh.",
      shoulderSeason: "September to November (Autumn)",
      shoulderDescription: "Pleasant sunny days and cool crisp evenings. Deciduous trees mix with evergreen pines for colorful mountain walks.",
      offSeason: "December to February (Winter Snow)",
      offDescription: "Winter snowfalls draw visitors for snow activities, chairlift rides in Patriata, and hot Kashmiri chai along Mall Road."
    },
    approximateCosts: {
      budgetPerDay: "PKR 5,000 – 8,500",
      midRangePerDay: "PKR 12,000 – 24,000",
      luxuryPerDay: "PKR 30,000 – 60,000+",
      notes: "Estimated package costs are based on 2026 market rates. Guided tour packages include private transport from Islamabad, hotel stay, and guided excursions to Patriata and Nathiagali."
    },
    topAttractions: [
      { name: "Patriata (New Murree) Chairlift & Cable Car", description: "Scenic double chairlift and cable car gliding across pine forest canopies to a mountain summit." },
      { name: "Nathiagali & Ayubia National Park", description: "Lush hill resort featuring cooler climate, wild monkeys, and the famous shaded Pipeline Walk." },
      { name: "Mukshpuri & Miranjani Peak Treks", description: "Scenic alpine trails leading to panoramic viewpoints overlooking Kashmir and Hazara." },
      { name: "Mall Road Promenade", description: "Historic pedestrian ridge offering local snacks, mountain shawls, and sunset viewpoints." }
    ],
    faqs: [
      {
        q: "How far is Murree from Islamabad?",
        a: "Murree is approximately 65 km from Islamabad. The drive via the four-lane Murree Expressway (E-75) takes about 1 to 1.5 hours in normal traffic conditions."
      },
      {
        q: "What is the best time to see snow in Murree?",
        a: "Snowfall typically occurs between late December and mid-February. Weather forecasts should be monitored closely before traveling, as severe winter storms can lead to traffic jams."
      }
    ]
  },

  neelum: {
    slug: "neelum",
    name: "Neelum Valley & Kashmir",
    province: "Azad Kashmir",
    heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80",
    tagline: "Verdant Kashmir Valleys, Ancient Stone Shrines & Turquoise Alpine Glacial Tarns",
    seoTitle: "Neelum Valley Tour Packages",
    seoDescription: "Compare and book guided Neelum Valley tour packages across Keran, Sharda, Arang Kel, and Ratti Gali Lake with independent local operators.",
    keyFacts: {
      altitude: "1,600 meters (Kutton) to 2,000+ meters (Kel) and 3,700 meters (Ratti Gali Lake)",
      bestSeason: "May to October (Alpine lakes accessible late June to mid-September)",
      distanceFromIslamabad: "Approx 240 km (6–8 hours to Keran via Muzaffarabad and the Neelum Valley road)",
      roadCondition: "Paved highway from Muzaffarabad up to Keran. Road past Keran to Sharda and Kel has rough, unpaved sections. Ratti Gali Lake and Baboon Valley strictly require high-clearance 4x4 jeeps."
    },
    overview: [
      "Carving a dramatic 200-kilometer arc through the western Himalayas of Azad Jammu & Kashmir, Neelum Valley is celebrated as the emerald jewel of Pakistani Kashmir. Flanked by soaring pine-forested slopes, terraced rice paddies, and roaring glacial torrents of the Neelum (Kishanganga) River, this lush borderland blends pristine nature with ancient historical heritage.",
      "The journey commences from Muzaffarabad, following the winding river road through picturesque hamlets like Kutton, Kundal Shahi, and Athmuqam. In Keran, the river acts as the de facto Line of Control, where visitors stroll along quiet riverside lawns admiring village life on the opposite Kashmir bank.",
      "Further up the valley lies Sharda, named after the Hindu goddess of wisdom. Here stand the impressive stone ruins of Sharda Peeth, a 6th-century temple and university that was once one of the most revered centers of Vedic scholarship in South Asia. Today, the roofless stone sanctum stands proudly against snowy Himalayan backdrops.",
      "Continuing to Kel, the gateway to Upper Neelum, travelers board a scenic cable-car trolley across the river gorge and hike up to Arang Kel. Perched on an elevated plateau at 2,500 meters, this car-free alpine meadow is celebrated for traditional wooden log houses, wildflower fields, and breathtaking views of the surrounding peaks."
    ],
    bestTimeToVisit: {
      peakSeason: "May to August (Summer)",
      peakDescription: "Pleasant temperatures (18°C to 26°C), rushing waterfalls, and blooming terraced fields. Glacial lakes including Ratti Gali and Chitta Katha open for high-altitude trekking.",
      shoulderSeason: "September to October (Autumn Foliage)",
      shoulderDescription: "Chilly crisp air with golden walnut and chinar trees blazing in amber colors against deep blue autumn skies.",
      offSeason: "December to March (Winter Snow)",
      offDescription: "Heavy snowfall blankets upper valleys like Kel and Taobat, creating stunning winter landscapes accessible primarily by 4x4 vehicles."
    },
    approximateCosts: {
      budgetPerDay: "PKR 6,000 – 10,000",
      midRangePerDay: "PKR 15,000 – 28,000",
      luxuryPerDay: "PKR 32,000 – 60,000+",
      notes: "Estimated package costs are based on 2026 market rates. 4x4 mountain jeeps are included in guided tour packages to access high-altitude alpine lakes such as Ratti Gali and Baboon Valley."
    },
    topAttractions: [
      { name: "Arang Kel Plateau Village", description: "Car-free plateau meadow accessible by cable-lift and hike, perched above the roaring river." },
      { name: "Ratti Gali Alpine Glacial Lake", description: "Iconic red-flower glacial tarn at 3,700 meters, famous for crystal reflection and summer tent camps." },
      { name: "Sharda Peeth Ancient Temple", description: "Historic 6th-century university ruins and stone sanctum celebrated for ancient Himalayan scholarship." },
      { name: "Keran Riverside Promenade", description: "Picturesque riverside resort town facing the opposite Kashmir bank across the calm turquoise river." },
      { name: "Taobat Border Valley", description: "The final tranquil village of Neelum Valley, famed for traditional log houses and trout streams." }
    ],
    faqs: [
      {
        q: "What travel documents are required to visit Neelum Valley?",
        a: "Pakistani citizens require their original CNIC. Foreign nationals and international passport holders require an entry permit / NOC issued by the AJK tourism and interior authorities."
      },
      {
        q: "When is Ratti Gali Lake accessible?",
        a: "The 4x4 jeep track from Dowarian to Ratti Gali base camp is open from late June to mid-September, when winter snowdrifts have melted sufficiently."
      }
    ]
  },

  "fairy-meadows": {
    slug: "fairy-meadows",
    name: "Fairy Meadows & Nanga Parbat",
    province: "Gilgit-Baltistan",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=80",
    tagline: "Alpine Pine Meadows at the Foot of Nanga Parbat's 8,126m Raikot Face",
    seoTitle: "Fairy Meadows Tour Packages",
    seoDescription: "Explore guided tour packages to Fairy Meadows, Tato village jeep tracks, Beyal Camp, and Nanga Parbat base camp with independent local mountain guides.",
    keyFacts: {
      altitude: "3,300 meters (Fairy Meadows) to 3,850 meters (Beyal Camp) and 3,967 meters (Nanga Parbat Base Camp)",
      bestSeason: "Mid-June to late September (Trail closed by heavy snow from late October through May)",
      distanceFromIslamabad: "Approx 430 km to Raikot Bridge (12–15 hours via KKH / Babusar in summer) + 1.5 hours 4x4 jeep track to Tato + 3–4 hours trek",
      roadCondition: "Paved KKH to Raikot Bridge. From Raikot Bridge to Tato village is an extremely narrow, unpaved cliffside track strictly operated by local union 4x4 jeeps (no private vehicles permitted). Tato to Fairy Meadows is a steep 5 km walking/pony trail."
    },
    overview: [
      "Nestled directly beneath the towering northern Raikot face of Nanga Parbat (8,126 meters)—the world's ninth-highest mountain and the western anchor of the Himalayas—Fairy Meadows is one of the most iconic wilderness trekking destinations in Asia. Known locally as Joot, the lush alpine meadows offer unobstructed, dramatic panoramas of tumbling glaciers, seracs, and sheer ice walls rising over 4,000 vertical meters above the valley floor.",
      "The adventure begins at Raikot Bridge on the Karakoram Highway. From here, travelers transfer into rugged, locally operated 4x4 mountain jeeps for a cliffside drive along the Raikot Gorge to Tato village. From Tato, the final leg is an exhilarating 5-kilometer hike through fragrant pine and deodar forests alongside mountain torrents, arriving at the broad green pastures of Fairy Meadows.",
      "Traditional log cabins, wooden cottages, and organized campsites dot the meadow edges, offering panoramic sunset views as the evening light paints Nanga Parbat's snowy summit in brilliant gold and crimson. Strolling through the meadows, visitors encounter grazing horses, mountain streams, and the warm hospitality of the local Shina-speaking mountain community.",
      "For active hikers, Fairy Meadows serves as the base for the day trek to Beyal Camp (3,850 meters) and the Nanga Parbat Base Camp (3,967 meters). Continuing past Beyal Camp along the edge of the Raikot Glacier, trekkers walk right up to the historic German climbers' memorial viewpoint, standing face-to-face with sheer glacial amphitheaters."
    ],
    bestTimeToVisit: {
      peakSeason: "July to August (Mid-Summer)",
      peakDescription: "Warmest daytime temperatures (15°C to 22°C), clear trails up to Beyal Camp and Nanga Parbat Base Camp, and vibrant alpine wildflowers.",
      shoulderSeason: "September to early October (Autumn Crisp)",
      shoulderDescription: "Crisp mountain air, crystal-clear skies, and golden autumn birch trees. Nights are freezing and require heavy thermal insulation.",
      offSeason: "Late October to May (Heavy Snow Cover)",
      offDescription: "Heavy winter snow blankets the meadows and Tato jeep track. Most cottages close down; accessible only to specialized mountaineers."
    },
    approximateCosts: {
      budgetPerDay: "PKR 7,000 – 11,000",
      midRangePerDay: "PKR 18,000 – 32,000",
      luxuryPerDay: "PKR 40,000 – 75,000+",
      notes: "TODO: 2026 local Raikot jeep union fixed round-trip fares and porter/pony rates are set by the local union and fluctuate seasonally. Guided tour packages include the round-trip Tato jeep, meadow cottage accommodation, meals, and trail guides."
    },
    topAttractions: [
      { name: "Nanga Parbat Raikot Face Viewpoint", description: "Unobstructed panorama of the 8,126-meter mountain wall rising directly above pine meadows." },
      { name: "Beyal Camp Alpine Pasture", description: "Tranquil higher-altitude meadow at 3,850 meters with wooden tea huts and close glacier views." },
      { name: "Nanga Parbat Base Camp & Glacier Trek", description: "Demanding day hike across glacial moraines to the historic German mountaineering base camp." },
      { name: "Raikot Gorge 4x4 Jeep Track", description: "World-famous cliffside mountain jeep track winding from the Indus River up to Tato village." }
    ],
    faqs: [
      {
        q: "Can I drive my own car to Fairy Meadows?",
        a: "No. Private vehicles cannot travel beyond Raikot Bridge on the Karakoram Highway. From Raikot Bridge to Tato village, travelers must hire a vehicle from the local 4x4 jeep union. From Tato, the remainder of the journey is on foot or by rented pony."
      },
      {
        q: "How difficult is the hike from Tato to Fairy Meadows?",
        a: "The hike from Tato to Fairy Meadows is approximately 5 km with an elevation gain of around 700 meters. For average hikers, it takes 3 to 4 hours. Travelers with limited fitness can hire local riding ponies or horses at Tato."
      },
      {
        q: "Is Fairy Meadows suitable for young children or elderly travelers?",
        a: "Because the journey involves a cliffside jeep track and a high-altitude hike above 3,300 meters, it is best suited for children aged 8+ and active adults. Elderly travelers with respiratory or mobility limitations should consult a physician regarding altitude."
      }
    ]
  },

  "naran-kaghan": {
    slug: "naran-kaghan",
    name: "Naran & Kaghan Valley",
    province: "Khyber Pakhtunkhwa",
    heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80",
    tagline: "Alpine Lakes, Rushing Kunhar River & Gateway to Babusar Pass",
    seoTitle: "Naran Kaghan Tour Packages",
    seoDescription: "Compare guided tour packages to Naran, Kaghan, Lake Saiful Malook, and Babusar Pass from independent local operators. Plan your mountain journey.",
    keyFacts: {
      altitude: "2,409 meters (Naran town) to 3,224 meters (Saiful Malook) and 4,173 meters (Babusar Top)",
      bestSeason: "June to September (Babusar Pass and upper glacial lakes open late June/July after snow clearing)",
      distanceFromIslamabad: "Approx 240 km (5–7 hours via Hazara Motorway M-15 and N-15)",
      roadCondition: "Fully paved asphalt on the N-15 highway up to Naran and Babusar Pass during the summer opening season. The mountain track from Naran town to Lake Saiful Malook is rough and unpaved, requiring local 4x4 jeeps."
    },
    overview: [
      "Stretching along the roaring Kunhar River in the Mansehra district of Khyber Pakhtunkhwa, the Kaghan and Naran Valley has been one of Pakistan's favorite alpine summer playgrounds for generations. Framed by steep pine-forested slopes, roaring waterfalls, and snow-fed lakes, Naran serves as both a vibrant mountain tourism center and the southern gateway to Gilgit-Baltistan via the Babusar Pass.",
      "The main town of Naran buzzes with activity from June through September, offering lively bazaars, traditional riverside trout restaurants, and family-friendly guesthouses. From the town center, fleets of local 4x4 jeeps ferry visitors up the steep mountain track to Lake Saiful Malook, celebrated in folklore as the mythical meeting place of Prince Saiful Malook and fairy princess Badi-ul-Jamal, with the imposing pyramid of Malika Parbat (5,290m) mirrored on its turquoise surface.",
      "Heading further up the valley along the scenic N-15 highway, travelers encounter tranquil high-altitude attractions including the tears-shaped Lulusar Lake, the alpine bowl of Dudipatsar National Park, and the vast wildflower meadows of Besal and Gitidas.",
      "At the head of the valley rises the 4,173-meter Babusar Pass, connecting Khyber Pakhtunkhwa directly to the Karakoram Highway at Chilas. The pass offers panoramic views of Himalayan and Karakoram peaks before descending into the Indus river valley."
    ],
    bestTimeToVisit: {
      peakSeason: "July to August (Mid-Summer)",
      peakDescription: "Warm pleasant temperatures (15°C to 24°C). Saiful Malook and Lulusar lakes are fully melted, and Babusar Pass is open to vehicular traffic.",
      shoulderSeason: "September to October (Early Autumn)",
      shoulderDescription: "Crisp autumn weather with golden grass on high pastures. Tourist crowds dissipate, though Babusar Pass closes with the first heavy snow in late October.",
      offSeason: "November to May (Winter Snow Closure)",
      offDescription: "Heavy winter snow and avalanches block the N-15 past Balakot or Kaghan. Tourism is largely dormant until spring snow clearing begins."
    },
    approximateCosts: {
      budgetPerDay: "PKR 5,500 – 9,000",
      midRangePerDay: "PKR 14,000 – 26,000",
      luxuryPerDay: "PKR 32,000 – 58,000+",
      notes: "Estimated package costs are based on 2026 market rates. Guided tour packages include hotel accommodation, private transport via the Hazara Motorway, and local 4x4 excursions to Lake Saiful Malook."
    },
    topAttractions: [
      { name: "Lake Saiful Malook", description: "Famous folklore glacial lake at 3,224 meters framed by the towering peak of Malika Parbat." },
      { name: "Babusar Pass (4,173m)", description: "High-altitude mountain pass connecting Kaghan to Gilgit-Baltistan with panoramic mountain views." },
      { name: "Lulusar Lake & National Park", description: "Crescent-shaped high-altitude lake and primary headwaters of the roaring Kunhar River." },
      { name: "Dudipatsar Lake Trek", description: "Pristine 'White Lake' nestled in Dudipatsar National Park, accessible via a rewarding summer day trek from Besal." }
    ],
    faqs: [
      {
        q: "When is Babusar Pass open for travel?",
        a: "Babusar Pass (4,173m) is strictly weather-dependent. It typically opens in late June or early July after road clearance and closes in late October with the first heavy autumn snowfall."
      },
      {
        q: "Can I drive my own car to Lake Saiful Malook?",
        a: "No. The 8 km track from Naran to Lake Saiful Malook is a steep, rocky mountain jeep trail that requires high ground clearance and 4x4 capability. Visitors must hire a local union 4x4 jeep from Naran town."
      }
    ]
  },

  naltar: {
    slug: "naltar",
    name: "Naltar Valley & Lakes",
    province: "Gilgit-Baltistan",
    heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80",
    tagline: "Emerald Glacial Lakes, Pine Sanctuaries & Winter Ski Slopes",
    seoTitle: "Naltar Valley Tour Packages",
    seoDescription: "Book guided tour packages to Naltar Valley, colorful Bashkiri alpine lakes, and pine forests in Gilgit-Baltistan with experienced local tour guides.",
    keyFacts: {
      altitude: "2,880 meters (Naltar Bala) to 3,150 meters (Naltar Bashkiri Lakes)",
      bestSeason: "June to October (Summer for lakes), December to February (Winter for ski competitions)",
      distanceFromIslamabad: "Approx 530 km (13–15 hours overland via KKH, or 45-min flight to Gilgit under VFR rules + 2 hours 4x4 drive from Nomal)",
      roadCondition: "Paved Karakoram Highway to Nomal village turnoff. The 35 km track from Nomal to Naltar Valley is unpaved, rough, and rocky, strictly requiring high-clearance 4x4 vehicles."
    },
    overview: [
      "Hidden in a forested side valley approximately 40 kilometers northwest of Gilgit, Naltar Valley is celebrated for its lush greenery, rare pine and deodar forests, and a string of multi-colored glacial lakes known collectively as the Bashkiri (Naltar) Lakes. In stark contrast to the barren, rugged rock faces characteristic of the Indus gorge, Naltar resembles an alpine forest oasis in the Karakoram.",
      "The valley is divided into two primary villages: Naltar Payeen (Lower Naltar) and Naltar Bala (Upper Naltar). Upper Naltar is home to Pakistan's oldest alpine ski slope, managed by the Pakistan Air Force, where national and international ski tournaments are held every winter on natural snow.",
      "During summer, the main attraction is the rugged 4x4 track leading beyond the ski resort to the three Bashkiri Lakes. Each lake displays a distinct hue ranging from deep emerald green to vibrant turquoise and crystal azure, created by submerged alpine algae, glacial silt, and mineral reflections.",
      "Naltar is also renowned for wildlife conservation. The Naltar Wildlife Sanctuary protects endangered species including the snow leopard, Himalayan ibex, and flare-horned markhor amidst dense sub-alpine conifer woodlands."
    ],
    bestTimeToVisit: {
      peakSeason: "July to August (Mid-Summer)",
      peakDescription: "Pleasant temperatures (18°C to 25°C). The three Bashkiri lakes are thawed, showcasing brilliant emerald and azure colors.",
      shoulderSeason: "September to October (Autumn Foliage)",
      shoulderDescription: "Cooler days and vivid golden foliage on forest edges. Quiet camping conditions and clear mountain vistas.",
      offSeason: "December to February (Ski Tournament Season)",
      offDescription: "Sub-zero temperatures with heavy natural snow cover. The PAF ski resort comes alive for competitive skiing."
    },
    approximateCosts: {
      budgetPerDay: "PKR 7,000 – 11,000",
      midRangePerDay: "PKR 18,000 – 32,000",
      luxuryPerDay: "PKR 42,000 – 75,000+",
      notes: "Estimated package costs are based on 2026 market rates. Guided tour packages include private 4x4 mountain jeeps from Gilgit or Nomal, hotel/cottage accommodation, and local guides."
    },
    topAttractions: [
      { name: "Bashkiri (Naltar) Lakes", description: "Three high-altitude glacial lakes famed for their emerald green and electric turquoise colors." },
      { name: "Naltar Ski Resort Slope", description: "Historic winter sports facility hosting national and international skiing competitions." },
      { name: "Naltar Wildlife Sanctuary", description: "Protected conifer forest reserve protecting snow leopards, ibex, and endemic bird species." },
      { name: "Pari Lake (Bashkiri 3)", description: "The highest and most secluded of the Naltar lakes, surrounded by rugged scree slopes and glaciers." }
    ],
    faqs: [
      {
        q: "Can I drive a sedan car to Naltar Valley?",
        a: "No. The road from Nomal village up into Naltar Valley is unpaved, steep, and full of river rocks. High-clearance 4x4 vehicles are mandatory."
      },
      {
        q: "How far is Naltar from Gilgit city?",
        a: "Naltar is approximately 40 km from Gilgit. The drive takes about 1.5 to 2 hours in a 4x4 jeep via Nomal."
      }
    ]
  },

  astore: {
    slug: "astore",
    name: "Astore Valley & Rama Meadows",
    province: "Gilgit-Baltistan",
    heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80",
    tagline: "Untamed Alpine Valleys, Rama Lake & Southern Gateway to Deosai",
    seoTitle: "Astore Valley Tour Packages",
    seoDescription: "Discover guided tour packages to Astore Valley, Rama Lake, pine meadows, and the southern entrance to Deosai Plains with independent local operators.",
    keyFacts: {
      altitude: "2,600 meters (Astore town) to 3,150 meters (Rama Meadows) and 3,800 meters (Chilam Deosai gate)",
      bestSeason: "June to October (Rama Lake accessible June–Sept; Chilam route across Deosai open mid-July to mid-September)",
      distanceFromIslamabad: "Approx 480 km (12–14 hours via KKH and Jaglot-Astore road)",
      roadCondition: "Paved KKH to Jaglot junction. Jaglot to Astore is partially paved with ongoing widening and prone to seasonal rockfall. Rama Lake, Minimarg, and Chilam-Deosai tracks strictly require 4x4 jeeps."
    },
    overview: [
      "Stretching across the southern reaches of Gilgit-Baltistan, Astore Valley is an untamed wilderness renowned for diverse alpine landscapes, cedar forests, rushing rivers, and direct access to both Nanga Parbat's eastern Rupal Face and the vast Deosai plateau. Far less commercialized than Hunza or Skardu, Astore offers authentic off-the-beaten-path mountain experiences.",
      "The regional administrative center of Astore town serves as the launching base for excursions into neighboring side valleys. Rising above the town lies the celebrated Rama Valley, where thick pine and cedar forests open into Rama Meadows at 3,150 meters, offering clear views of Chongra Peak and Nanga Parbat. A short hike beyond the meadows leads to the turquoise waters of Rama Lake.",
      "To the south, the valley leads to Chilam, the official southern checkpoint and entry gateway to Deosai National Park. Traversing from Astore into Deosai brings travelers to Sheosar Lake before descending into Skardu.",
      "Beyond Chilam lie the border valleys of Minimarg, Domel, and Rainbow Lake (Rainbow Jheel). With traditional wooden cabins and lush flower-filled meadows, these high-altitude border sanctuaries require special security permits and local guidance."
    ],
    bestTimeToVisit: {
      peakSeason: "July to August (Mid-Summer)",
      peakDescription: "Warm pleasant temperatures (16°C to 24°C). Rama Lake is thawed, wildflowers blanket Rama Meadows, and the road to Deosai via Chilam is fully open.",
      shoulderSeason: "September to October (Autumn)",
      shoulderDescription: "Crisp autumn mornings with golden poplars and amber grasses. Ideal for landscape photography with clear mountain visibility.",
      offSeason: "November to May (Winter Snow Isolation)",
      offDescription: "Heavy winter snowdrifts close the Rama Lake track and Deosai gate. Local travel is restricted to 4x4 chains in lower valleys."
    },
    approximateCosts: {
      budgetPerDay: "PKR 6,500 – 10,500",
      midRangePerDay: "PKR 16,000 – 30,000",
      luxuryPerDay: "PKR 38,000 – 68,000+",
      notes: "Estimated package costs are based on 2026 market rates. Guided tour packages include private 4x4 transport, hotel/guest house accommodations in Astore and Rama, and permit coordination for border zones."
    },
    topAttractions: [
      { name: "Rama Meadows & Forest Rest House", description: "Serene pine-canopied high pasture at 3,150 meters offering views of Chongra Peak." },
      { name: "Rama Alpine Glacial Lake", description: "Turquoise glacial tarn situated at the base of Nanga Parbat's eastern ridge." },
      { name: "Chilam Checkpost & Deosai South Gate", description: "Southern road entrance to the 4,114-meter Deosai National Park plateau leading to Sheosar Lake." },
      { name: "Rupal Valley & Nanga Parbat South Face", description: "Deep valley leading to the sheer 4,600-meter vertical Rupal Face, the highest mountain wall in the world." }
    ],
    faqs: [
      {
        q: "How do I reach Astore from the Karakoram Highway?",
        a: "Turn off the Karakoram Highway at Jaglot (south of Gilgit). The Jaglot-Astore road follows the Astore River for approximately 55 km into Astore town, taking around 2 to 3 hours."
      },
      {
        q: "Can I travel from Astore directly to Skardu?",
        a: "Yes, during mid-July to mid-September, you can cross from Astore (via Chilam) across the Deosai National Park plateau to Skardu in a high-clearance 4x4 jeep. This road is closed by heavy snow for the rest of the year."
      }
    ]
  },

  "chitral-kalash": {
    slug: "chitral-kalash",
    name: "Chitral & Kalash Valleys",
    province: "Khyber Pakhtunkhwa",
    heroImage: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1600&auto=format&fit=crop&q=80",
    tagline: "Ancient Indigenous Kalash Culture, Tirich Mir (7,708m) & Lowari Tunnel",
    seoTitle: "Chitral & Kalash Tour Packages",
    seoDescription: "Compare guided cultural tour packages to Chitral, Bumburet, Rumbur, and Kalash spring and autumn festivals with independent local tour operators.",
    keyFacts: {
      altitude: "1,494 meters (Chitral town) to 1,670–2,300 meters (Kalash valleys: Bumburet, Rumbur, Birir)",
      bestSeason: "May to October (Chilam Joshi festival in May; Uchal in August; Choimus in December)",
      distanceFromIslamabad: "Approx 380 km (8–10 hours via Swat Motorway, Dir, and the 10.4 km Lowari Tunnel)",
      roadCondition: "Fully paved modern highway through the Lowari Tunnel (N-45) up to Chitral and Ayun. Ayun to Bumburet, Rumbur, and Birir valleys is unpaved gravel and river-stone track requiring high-clearance or 4x4 vehicles."
    },
    overview: [
      "Nestled in the deep valleys of the Hindu Kush range in northwestern Khyber Pakhtunkhwa, Chitral is a region of distinct cultural heritage, dominated by the majestic pyramid of Tirich Mir (7,708 meters)—the highest peak in the Hindu Kush. Historically an independent princely state, Chitral features royal forts, polo grounds, and traditional Kho culture.",
      "The most internationally celebrated aspect of the region is the indigenous Kalash community living in three secluded valleys southwest of Chitral town: Bumburet, Rumbur, and Birir. The Kalash are an ancient non-Muslim Indo-Aryan polytheistic people who have preserved their distinct spiritual traditions, music, sacred cypress shrines, and distinctive black woven robes adorned with colorful cowrie-shell headpieces (kupasi) for millennia.",
      "Seasonal festivals are central to Kalash life and draw cultural travelers from around the world. The Chilam Joshi festival in May welcomes spring with traditional rhythmic dancing and rituals; Uchal in August celebrates the wheat and barley harvest; and the winter solstice festival of Choimus in December marks the new year with sacred torchlit ceremonies.",
      "Thanks to the 10.4-kilometer Lowari Tunnel, all-weather road access between Islamabad and Chitral has transformed what was once a multi-day hazardous mountain journey into a smooth 8 to 10-hour drive through Dir."
    ],
    bestTimeToVisit: {
      peakSeason: "May to August (Spring & Summer Festivals)",
      peakDescription: "Pleasant warm days (22°C to 30°C). Chilam Joshi (May) and Uchal (August) festivals bring vibrant music, dancing, and cultural celebrations.",
      shoulderSeason: "September to October (Autumn Harvest)",
      shoulderDescription: "Mild sunny days, walnut and apple harvests, and golden foliage along river valleys. Low tourist numbers.",
      offSeason: "November to March (Winter & Choimus)",
      offDescription: "Snow covers the valleys. In late December, the Choimus festival offers unique winter solstice cultural experiences for intrepid travelers."
    },
    approximateCosts: {
      budgetPerDay: "PKR 6,500 – 10,500",
      midRangePerDay: "PKR 16,000 – 28,000",
      luxuryPerDay: "PKR 35,000 – 62,000+",
      notes: "Estimated package costs are based on 2026 market rates. Cultural tour packages include transport, traditional guest houses, local Kalash community guides, and festival access."
    },
    topAttractions: [
      { name: "Kalash Valleys (Bumburet, Rumbur, Birir)", description: "Secluded cultural valleys home to the indigenous Kalash community and their living traditions." },
      { name: "Chitral Shahi Mosque & Fort", description: "Historic 19th-century royal riverside mosque featuring intricate pink-marble minarets and timber woodwork." },
      { name: "Tirich Mir Viewpoints", description: "Panoramic views of the towering 7,708-meter mountain summit, highest in the Hindu Kush." },
      { name: "Chitral Polo Ground", description: "Historic venue for fast-paced, unruled traditional mountain polo played by local rival teams." }
    ],
    faqs: [
      {
        q: "Is Chitral open year-round by road?",
        a: "Yes. Since the completion of the 10.4 km Lowari Tunnel, the road between Islamabad, Dir, and Chitral remains open throughout the winter, bypassing the old snowbound Lowari Pass."
      },
      {
        q: "What cultural etiquette should visitors observe in the Kalash Valleys?",
        a: "Visitors must respect local traditions: always ask before photographing community members (especially women), avoid touching sacred temples or altars marked as taboo (bashali or dewa), and support the local economy by hiring local Kalash guides."
      }
    ]
  },

  "shogran-siri-paye": {
    slug: "shogran-siri-paye",
    name: "Shogran & Siri Paye Meadows",
    province: "Khyber Pakhtunkhwa",
    heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80",
    tagline: "Rolling Alpine Pastures, Makra Peak Views & Pine Forest Ridges",
    seoTitle: "Shogran Siri Paye Tour Packages",
    seoDescription: "Explore guided tour packages to Shogran plateau, Siri Paye alpine meadows, and pine-fringed viewpoints in Kaghan Valley from independent operators.",
    keyFacts: {
      altitude: "2,362 meters (Shogran plateau) to 3,058 meters (Siri Paye Meadows)",
      bestSeason: "May to October (Lush green pastures and horse-riding; snow play in December to February)",
      distanceFromIslamabad: "Approx 210 km (4.5–6 hours via Hazara Motorway M-15 to Balakot and Kewai)",
      roadCondition: "Paved highway to Kewai on N-15. Kewai to Shogran is a steep, winding paved mountain road. Shogran to Siri Paye is a rough, unpaved rocky dirt track strictly requiring local 4x4 jeeps or hiking."
    },
    overview: [
      "Perched on a green mountain plateau 2,362 meters above the Kaghan Valley, Shogran is one of the most accessible and picturesque alpine hill stations in northern Pakistan. Surrounded by dense conifer pine forests, rolling lawns, and panoramic views of Musa ka Musalla and the snowy pyramid of Makra Peak (3,885m), Shogran provides a refreshing retreat just a few hours from Islamabad.",
      "The journey begins with an ascent from Kewai on the main Kaghan highway, climbing through dense cedar woods to the Shogran plateau. Here, hillside resorts, wooden cottages, and family guesthouses offer peaceful mountain stays overlooking the deep Kunhar River valley below.",
      "From Shogran, the adventure continues upward via a rugged 4x4 mountain track to Siri Paye. Siri, a small alpine pond surrounded by grazing pastures, leads to the expansive green amphitheater of Paye Meadows at 3,058 meters. Carpeted in wild yellow buttercups and purple iris during early summer, Paye Meadows is celebrated for horse-riding, photography, and hiking.",
      "For mountaineers, Paye Meadows serves as the launching base for the demanding day hike up to the summit of Makra Peak (3,885 meters), which rewards climbers with panoramic vistas of Kaghan, Kashmir, and Nanga Parbat on clear days."
    ],
    bestTimeToVisit: {
      peakSeason: "June to August (Summer Green)",
      peakDescription: "Pleasant temperatures (18°C to 24°C). The meadows are lush green, alpine flowers are in full bloom, and horse-riding is in full swing.",
      shoulderSeason: "September to October (Autumn Foliage)",
      shoulderDescription: "Crisp clear mountain days with golden hues spreading across the pastures. Quiet trails and crisp starlit nights.",
      offSeason: "December to March (Winter Snow)",
      offDescription: "Heavy winter snow blankets Shogran and Siri Paye. Accessible via 4x4 chains from Kewai for snow play and winter photography."
    },
    approximateCosts: {
      budgetPerDay: "PKR 5,000 – 8,500",
      midRangePerDay: "PKR 13,000 – 24,000",
      luxuryPerDay: "PKR 28,000 – 52,000+",
      notes: "Estimated package costs are based on 2026 market rates. Guided tour packages include private transport from Islamabad, hotel stay on Shogran plateau, and 4x4 jeep safari up to Siri Paye."
    },
    topAttractions: [
      { name: "Siri Paye Alpine Meadows", description: "Expansive high-altitude meadow at 3,058 meters framed by Makra Peak and pine ridges." },
      { name: "Shogran Forest Plateau", description: "Lush mountain plateau offering panoramic vistas across the Kunhar River valley." },
      { name: "Makra Peak (3,885m) Day Hike", description: "Rewarding mountain summit hike offering 360-degree views across Kaghan and Azad Kashmir." },
      { name: "Kewai Waterfall Rest Stop", description: "Charming roadside waterfall on the Kaghan highway where cafes set tables right inside cold mountain streams." }
    ],
    faqs: [
      {
        q: "How do I reach Siri Paye from Shogran?",
        a: "The track from Shogran to Siri Paye is a rugged, unpaved mountain road approximately 6 km long. Visitors must hire a local union 4x4 jeep or hike on foot."
      },
      {
        q: "Is Shogran accessible in winter?",
        a: "Yes. While snow covers the road, local 4x4 jeeps with tire chains operate between Kewai and Shogran, allowing visitors to enjoy winter snow stays."
      }
    ]
  },

  gilgit: {
    slug: "gilgit",
    name: "Gilgit & Bagrot Valley",
    province: "Gilgit-Baltistan",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80",
    tagline: "Ancient Silk Road Crossroads, Glacial Confluences & Mountain Junction",
    seoTitle: "Gilgit Tour Packages",
    seoDescription: "Compare guided tour packages to Gilgit city, ancient Kargah Buddha, Bagrot Valley glaciers, and Karakoram junction points with local operators.",
    keyFacts: {
      altitude: "1,500 meters (Gilgit city) to 2,500+ meters (Bagrot Valley / Haramosh)",
      bestSeason: "April to October (Spring apricot blossom in April; mild summer; vivid autumn in October)",
      distanceFromIslamabad: "Approx 510 km (12–14 hours via Babusar in summer, 15–18 hours via KKH Besham in winter; or 45-minute flight to Gilgit Airport under VFR rules)",
      roadCondition: "Fully paved modern Karakoram Highway (N-35) directly through Gilgit city. Side valleys such as Bagrot and Danyore feature partially paved and unpaved gravel roads."
    },
    overview: [
      "Serving as the administrative, commercial, and transport capital of Gilgit-Baltistan, Gilgit has stood for millennia as a historic trading hub along the ancient Silk Road. Situated at the confluence of the Gilgit and Hunza Rivers, this vibrant mountain city is surrounded by towering sentinels of the Karakoram and Hindu Kush ranges.",
      "Just 10 kilometers west of the city center lies Kargah, famous for the 7th-century Kargah Buddha (Yashani)—a monumental 50-foot Buddhist relief figure carved directly into a sheer cliff face, standing as a silent testament to Gilgit's golden age as a thriving monastic sanctuary along Silk Road pilgrimage routes.",
      "South of the city lies the world-famous Mountain Junction Point, where the world's three great mountain systems—the Karakoram, the Himalaya, and the Hindu Kush—converge at the confluence of the Indus and Gilgit Rivers. Nearby, travelers can cross the historic Danyore Suspension Bridge, a dramatic single-lane hanging wooden bridge leading through a carved mountain tunnel.",
      "For wilderness lovers, the neighboring Bagrot Valley unfolds directly beneath the icy battlements of Rakaposhi and Dobani Peak. Here, traditional stone and timber mountain villages, apricot orchards, and accessible glacial tongues offer deep insight into pastoral life in the high Karakoram."
    ],
    bestTimeToVisit: {
      peakSeason: "May to September (Summer)",
      peakDescription: "Warm pleasant temperatures (22°C to 32°C). Central hub for all onward expeditions to Hunza, Skardu, Phander, and Khunjerab Pass.",
      shoulderSeason: "October to November (Autumn Harvest)",
      shoulderDescription: "Mild sunny days with chinar and poplar trees turning vibrant shades of amber and gold across the city terraces.",
      offSeason: "December to March (Winter Season)",
      offDescription: "Cool crisp mountain winter with occasional snow on surrounding ridges. Commercial flights operate under VFR rules weather permitting."
    },
    approximateCosts: {
      budgetPerDay: "PKR 6,000 – 9,500",
      midRangePerDay: "PKR 15,000 – 28,000",
      luxuryPerDay: "PKR 35,000 – 65,000+",
      notes: "Estimated package costs are based on 2026 market rates. Guided tour packages include private transport along the KKH, local hotel accommodations, and guided cultural excursions to Kargah and Bagrot."
    },
    topAttractions: [
      { name: "Kargah Buddha Rock Relief", description: "7th-century monumental rock carving celebrating ancient Buddhist Silk Road monastic heritage." },
      { name: "3 Mountain Ranges Junction Point", description: "Geographic meeting point of the Karakoram, Himalaya, and Hindu Kush mountain ranges." },
      { name: "Bagrot Valley & Glaciers", description: "Lush agricultural valley set beneath Rakaposhi with authentic mountain stone villages." },
      { name: "Historic Danyore Suspension Bridge & Tunnel", description: "Dramatic single-lane wooden suspension bridge connecting Gilgit to Danyore through a stone tunnel." }
    ],
    faqs: [
      {
        q: "Are flights to Gilgit Airport reliable?",
        a: "Commercial flights from Islamabad to Gilgit operate under Visual Flight Rules (VFR) and are strictly weather-dependent. Flights can be delayed or canceled due to mountain cloud cover or turbulence over the Indus gorge. Travelers should always maintain flexible contingency days."
      },
      {
        q: "Can Gilgit serve as a base for exploring northern Pakistan?",
        a: "Yes. Gilgit is the central transport hub of Gilgit-Baltistan, making it the ideal transit hub for day trips and onward travel to Hunza, Naltar, Ghizer/Phander, Astore, and Skardu."
      }
    ]
  }
};
