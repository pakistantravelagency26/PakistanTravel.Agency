export interface TourIntentData {
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

export const tourIntentsData: Record<string, TourIntentData> = {
  "hunza-tour-packages": {
    slug: "hunza-tour-packages",
    title: "Hunza Tour Packages",
    seoTitle: "Hunza Tour Packages",
    metaDescription: "Compare and book guided Hunza tour packages to Karimabad, Attabad Lake, and Passu Cones directly with independent local tour operators.",
    h1: "Guided Hunza Valley Tour Packages",
    destinationSlug: "hunza",
    introText: [
      "Hunza Valley in Gilgit-Baltistan is renowned globally for soaring Karakoram peaks, ancient stone fortresses, and crystal turquoise waters. Traversing the legendary Karakoram Highway (N-35), guided Hunza tour packages connect travelers to historic Karimabad, the royal citadels of Baltit and Altit Forts, the electric blue expanse of Attabad Lake, and the dramatic spires of the Passu Cones.",
      "The marketplace features tour packages organized directly by independent local tour operators based in Gilgit and Hunza. Options range from 5-day express itineraries flying into Gilgit Airport (operating under Visual Flight Rules, weather permitting) to comprehensive 8 to 10-day overland expeditions from Islamabad crossing Babusar Pass in summer or the Karakoram Highway via Besham in winter.",
      "Every tour package specifies included accommodations, private transport (such as Toyota HiAce, Grand Cabin, or 4x4 Prado), meal plans, and guided sightseeing. Travelers communicate directly with independent operators before departure, ensuring tailored schedules for families, couples, and photography groups."
    ],
    faqs: [
      {
        q: "What is typically included in a Hunza tour package?",
        a: "Standard packages include dedicated private transport from Islamabad or Gilgit, hotel accommodations, breakfast, a local driver-guide, and sightseeing excursions to Baltit Fort, Attabad Lake, Passu Glacier, and Khunjerab Pass."
      },
      {
        q: "What is the best duration for a Hunza tour?",
        a: "A 5-day tour is ideal if flying into Gilgit, while an overland journey by road from Islamabad is best enjoyed over 7 to 9 days to allow comfortable travel paces."
      }
    ]
  },

  "skardu-tour-packages": {
    slug: "skardu-tour-packages",
    title: "Skardu Tour Packages",
    seoTitle: "Skardu Tour Packages",
    metaDescription: "Compare and book guided Skardu tour packages, Deosai Plains safaris, and Upper Kachura excursions with independent local tour operators.",
    h1: "Guided Skardu & Baltistan Tour Packages",
    destinationSlug: "skardu",
    introText: [
      "Skardu represents the crown jewel of high-altitude mountain basins in northern Pakistan. Surrounded by the giants of the central Karakoram and situated along the Indus River, guided Skardu tour packages showcase dramatic landscapes ranging from the Katpana and Sarfaranga Cold Deserts to Lower Kachura (Shangrila), Upper Kachura Lake, and restored heritage palaces in Shigar and Khaplu.",
      "A primary highlight of summer itineraries is the 4x4 safari across Deosai National Park, the second-highest alpine plateau on Earth at an average elevation of 4,114 meters. The Deosai track is strictly accessible from mid-July to mid-September, when wildflower blooms surround Sheosar Lake and snowdrifts have melted.",
      "Packages listed on our platform are hosted by verified independent tour operators from Baltistan. Because commercial flights to Skardu International Airport operate under Visual Flight Rules (VFR) and are weather-dependent, operators offer flexible contingency routing via the Jaglot-Skardu road."
    ],
    faqs: [
      {
        q: "When can tour packages visit Deosai National Park?",
        a: "Deosai Plains is strictly accessible from mid-July through mid-September depending on seasonal snow clearance. Outside this window, tours focus on Skardu basin, Shigar, Khaplu, and Kachura."
      },
      {
        q: "Are flights included in Skardu packages?",
        a: "Many operators offer package options with commercial flight tickets from Islamabad or provide land-only packages where travelers book flights independently."
      }
    ]
  },

  "swat-tour-packages": {
    slug: "swat-tour-packages",
    title: "Swat Tour Packages",
    seoTitle: "Swat Tour Packages",
    metaDescription: "Explore guided tour packages to Swat Valley, Kalam, Malam Jabba ski slopes, and Mahodand Lake with independent local northern tour operators.",
    h1: "Guided Swat Valley Tour Packages",
    destinationSlug: "swat",
    introText: [
      "Swat Valley combines lush alpine meadows, Gandharan Buddhist archaeological heritage, and modern expressway accessibility. Connected smoothly to Islamabad via the Swat Motorway (M-16), guided Swat tour packages offer refreshing getaways across Mingora, Saidu Sharif, the pine-clad heights of Kalam, and the winter ski slopes of Malam Jabba.",
      "Summer tour packages feature 4x4 mountain excursions from Kalam through dense cedar forests to the turquoise waters of Mahodand and Saifullah Lakes. Cultural travelers can explore 2,000-year-old Buddhist stupas and the Swat Museum, while winter packages center on snow sports, chairlifts, and zip-lining at Malam Jabba at 3,100 meters.",
      "Marketplace listings connect travelers with independent local operators offering private sedan, van, or 4x4 transport, family-friendly hotel lodgings, and tailored itineraries suitable for 3 to 5-day vacations."
    ],
    faqs: [
      {
        q: "How many days are needed for a Swat tour?",
        a: "A 3 to 4-day tour package covers Mingora, Malam Jabba, and Kalam comfortably. Adding Mahodand Lake or upper valleys is best done with a 4 to 5-day itinerary."
      },
      {
        q: "Is Swat suitable for travel throughout the year?",
        a: "Yes. Swat offers lush greenery from April to October, pleasant spring blossoms, and snow skiing at Malam Jabba from December to February."
      }
    ]
  },

  "kumrat-tour-packages": {
    slug: "kumrat-tour-packages",
    title: "Kumrat Valley Tour Packages",
    seoTitle: "Kumrat Valley Tour Packages",
    metaDescription: "Discover guided Kumrat Valley tour packages, pine forest camping, and Jahaz Banda treks in Upper Dir with independent local tour operators.",
    h1: "Guided Kumrat Valley Tour Packages",
    destinationSlug: "kumrat",
    introText: [
      "Kumrat Valley in Upper Dir is renowned as one of Pakistan's most pristine alpine pine wildernesses. Towering deodar cedar forest canopies, the crystal currents of the roaring Panjkora River, and secluded glacial lakes make Kumrat an authentic eco-adventure destination for travelers seeking unspoiled nature.",
      "Standard cars can only reach Thal village on paved highways. From Thal onward into Kumrat Forest and Taki Top, guided packages provide specialized high-clearance 4x4 mountain jeeps. For trekking enthusiasts, packages incorporate the iconic hike to the high alpine meadow of Jahaz Banda (3,100m) and the emerald glacial amphitheater of Katora Lake (3,500m).",
      "Tour packages on our marketplace are arranged by independent regional operators providing campsite or cottage lodgings, 4x4 transportation, campfire meals, and experienced local trail guides."
    ],
    faqs: [
      {
        q: "Do Kumrat tour packages provide 4x4 transport past Thal?",
        a: "Yes. Because regular cars cannot traverse the boulder tracks past Thal, guided Kumrat packages include dedicated 4x4 mountain jeeps."
      },
      {
        q: "What accommodation is provided in Kumrat?",
        a: "Accommodations range from riverside wooden cottages and glamping pods in Kumrat Forest to alpine tents and shepherd huts at Jahaz Banda."
      }
    ]
  },

  "neelum-tour-packages": {
    slug: "neelum-tour-packages",
    title: "Neelum Valley Tour Packages",
    seoTitle: "Neelum Valley Tour Packages",
    metaDescription: "Compare guided Neelum Valley tour packages across Keran, Sharda, Arang Kel, and Ratti Gali Lake with independent local mountain tour operators.",
    h1: "Guided Neelum Valley Tour Packages",
    destinationSlug: "neelum",
    introText: [
      "Carving an emerald arc through the western Himalayas of Azad Jammu & Kashmir, Neelum Valley is celebrated for terraced orchards, roaring glacial streams, and ancient heritage. Guided Neelum Valley tour packages take travelers from Muzaffarabad along the river border through scenic hamlets including Kutton, Keran, historic Sharda Peeth, and Kel.",
      "Highlights of Neelum itineraries include riding the river cable trolley and hiking up to the car-free alpine meadow of Arang Kel at 2,500 meters, as well as seasonal 4x4 excursions to the high-altitude glacial tarn of Ratti Gali Lake at 3,700 meters (open late June to mid-September).",
      "Independent tour operators listed on PakistanTravel coordinate mountain transport, local riverside guesthouses, and required documentation for Pakistani citizens and international travelers."
    ],
    faqs: [
      {
        q: "When is the best season for Neelum Valley tours?",
        a: "May to October offers the best conditions. Upper routes to Arang Kel and Ratti Gali Lake are accessible during summer, while autumn brings golden chinar foliage."
      },
      {
        q: "What travel documents are required for Neelum Valley?",
        a: "Pakistani citizens require their original CNIC. Foreign passport holders require an entry permit/NOC issued by regional authorities."
      }
    ]
  },

  "fairy-meadows-tours": {
    slug: "fairy-meadows-tours",
    title: "Fairy Meadows Tour Packages",
    seoTitle: "Fairy Meadows Tour Packages",
    metaDescription: "Explore guided tour packages to Fairy Meadows, Tato village jeep tracks, Beyal Camp, and Nanga Parbat base camp with local mountain operators.",
    h1: "Guided Fairy Meadows & Nanga Parbat Tours",
    destinationSlug: "fairy-meadows",
    introText: [
      "Fairy Meadows provides an incomparable wilderness setting directly beneath the towering 8,126-meter Raikot face of Nanga Parbat, the ninth-highest mountain on Earth. Known locally as Joot, these alpine meadows offer unobstructed panoramas of massive glaciers and sheer vertical ice walls.",
      "The adventure starts at Raikot Bridge on the Karakoram Highway. Guided packages coordinate authorized local union 4x4 jeeps up the narrow cliffside track to Tato village, followed by a guided 3 to 4-hour hike through pine woods up to Fairy Meadows at 3,300 meters. Active hikers can continue onward to Beyal Camp (3,850m) and the Nanga Parbat Base Camp viewpoint.",
      "Tour packages on PakistanTravel include round-trip Raikot jeeps, wooden meadow cottages, trail logistics, and experienced local Shina-speaking guides from mid-June through late September."
    ],
    faqs: [
      {
        q: "How difficult is the Fairy Meadows trek?",
        a: "The trek from Tato to Fairy Meadows is 5 km with a 700-meter elevation gain, taking 3 to 4 hours. Riding horses or ponies can be hired at Tato for travelers seeking riding assistance."
      },
      {
        q: "When are Fairy Meadows tours available?",
        a: "Tours operate from mid-June through late September. In winter and early spring, heavy snowdrifts close the trails and meadow cottages."
      }
    ]
  },

  "family-tours-pakistan": {
    slug: "family-tours-pakistan",
    title: "Family Tour Packages Pakistan",
    seoTitle: "Family Tour Packages Pakistan",
    metaDescription: "Compare family tour packages across northern Pakistan with comfortable transport, vetted hotels, and relaxed itineraries from local operators.",
    h1: "Northern Pakistan Family Tour Packages",
    categoryFilter: "family",
    introText: [
      "Traveling with family across northern Pakistan requires well-paced itineraries, comfortable modern transport, and reliable family-friendly accommodations. Family tour packages on PakistanTravel are structured specifically to balance scenic discovery with comfortable driving hours and child-friendly activities.",
      "Popular family circuits include the smooth highway journey along the Karakoram Highway to Hunza, leisurely lake boating on Attabad Lake, cable-car rides in Patriata, and cultural tours in Swat and Kalam. Itineraries avoid grueling off-road boulder treks unless specifically requested with private high-clearance vehicles.",
      "Our marketplace enables families to review private vehicle specifications, request inter-connected hotel rooms, and book directly with independent operators who provide dedicated drivers and transparent pricing."
    ],
    faqs: [
      {
        q: "Which northern destination is best for families with children?",
        a: "Hunza Valley, Swat Valley, and Murree/Galyat are the most popular destinations for families due to paved highways, quality hotels, and accessible viewpoints."
      },
      {
        q: "Can itineraries be adjusted for elderly family members?",
        a: "Yes. Independent operators can customize schedules with shorter driving legs, ground-floor hotel rooms, and scenic viewpoints accessible without hiking."
      }
    ]
  },

  "honeymoon-tours-pakistan": {
    slug: "honeymoon-tours-pakistan",
    title: "Honeymoon Tour Packages Pakistan",
    seoTitle: "Honeymoon Tour Packages Pakistan",
    metaDescription: "Explore romantic honeymoon tour packages to Hunza, Skardu, and Swat with scenic valley lodges and private mountain transport from local operators.",
    h1: "Romantic Honeymoon Tour Packages in Pakistan",
    categoryFilter: "honeymoon",
    introText: [
      "Northern Pakistan presents some of the most dramatic mountain backdrops in the world for romantic couples and honeymooners. Honeymoon tour packages listed on PakistanTravel feature private dedicated transport, handpicked scenic valley lodges, and personalized sightseeing across Hunza, Skardu, and Swat.",
      "Couples can watch panoramic sunsets over Rakaposhi from Duikar in Hunza, stay in restored royal fort suites in Shigar, or take private wooden boat cruises on Upper Kachura Lake. Packages are designed with relaxed scheduling, allowing ample leisure time to savor mountain tranquility and culinary specialties.",
      "Book directly with independent local operators who coordinate private transfers, room decorations, and bespoke itinerary adjustments."
    ],
    faqs: [
      {
        q: "What are the most popular honeymoon destinations in northern Pakistan?",
        a: "Hunza Valley and Skardu are the top choices for honeymoon couples, offering scenic luxury resorts, mountain sunsets, and peaceful alpine lakes."
      },
      {
        q: "Are honeymoon packages private?",
        a: "Yes. Honeymoon tour packages include dedicated private vehicles and private hotel rooms throughout the itinerary."
      }
    ]
  },

  "corporate-tours-pakistan": {
    slug: "corporate-tours-pakistan",
    title: "Corporate Tour Packages Pakistan",
    seoTitle: "Corporate Tour Packages Pakistan",
    metaDescription: "Book corporate retreat tour packages across northern Pakistan with executive transport, team excursions, and scenic venues from local operators.",
    h1: "Corporate Retreat & Team Tour Packages",
    categoryFilter: "corporate",
    introText: [
      "Corporate retreats and team-building tours across northern Pakistan combine scenic mountain settings with executive group logistics. Whether organizing an annual executive retreat, a team-building excursion, or a company milestone trip, PakistanTravel connects corporate clients with experienced group tour operators.",
      "Destinations such as Swat, Bhurban, Hunza, and Skardu provide meeting-ready resort venues, outdoor team activities, and reliable road or air connectivity. Packages include executive coaster or HiAce transportation, group meal plans, conference facility coordination, and guided excursions.",
      "Corporate organizers can submit customized group briefs specifying group size, invoicing requirements, and date flexibility to receive itemized corporate proposals directly from local operators."
    ],
    faqs: [
      {
        q: "What group sizes can corporate tour packages accommodate?",
        a: "Independent operators on our platform coordinate tours for groups ranging from small executive teams of 8 to 15 members to large corporate gatherings of 100+ travelers."
      },
      {
        q: "Are formal tax invoices provided for corporate bookings?",
        a: "Yes. Registered independent tour operators provide formal tax invoices, NTN registration details, and itemized corporate service agreements."
      }
    ]
  },

  "autumn-tours-pakistan": {
    slug: "autumn-tours-pakistan",
    title: "Autumn Tour Packages Pakistan",
    seoTitle: "Autumn Tour Packages Pakistan",
    metaDescription: "Experience golden autumn tour packages across Hunza, Skardu, and Phander with vibrant foliage and crisp mountain skies from local operators.",
    h1: "Golden Autumn Tour Packages in Northern Pakistan",
    categoryFilter: "autumn",
    introText: [
      "Autumn is widely celebrated as northern Pakistan's most visually breathtaking travel season. From early October to mid-November, the terraced orchards and poplar groves of Hunza, Nagar, Skardu, and Ghizer transform into brilliant shades of gold, amber, and crimson set against snow-dusted Karakoram peaks.",
      "The autumn atmosphere offers crystal-clear skies, low humidity, and unobstructed mountain visibility for photography. Guided autumn tour packages take travelers along the Karakoram Highway to Karimabad, Passu, Upper Kachura, and the shimmering waters of Phander Lake in Ghizer.",
      "Browse autumn itineraries offered directly by local operators who understand foliage progression across different valley elevations."
    ],
    faqs: [
      {
        q: "When is the peak of autumn foliage in northern Pakistan?",
        a: "Autumn foliage typically peaks between October 10 and November 5, beginning in higher valleys like Gojal and Skardu before descending to Karimabad and Gilgit."
      },
      {
        q: "What are the temperatures during autumn tours?",
        a: "Daytime temperatures are mild and sunny (14°C to 20°C), while nights are brisk and chilly (2°C to 8°C), requiring warm fleece and jacket layers."
      }
    ]
  },

  "cherry-blossom-tours-pakistan": {
    slug: "cherry-blossom-tours-pakistan",
    title: "Cherry Blossom Tour Packages",
    seoTitle: "Cherry Blossom Tour Packages",
    metaDescription: "Book spring cherry blossom tour packages across Hunza, Nagar, and Gilgit to witness pink apricot blooms against snowy peaks with local guides.",
    h1: "Spring Cherry & Apricot Blossom Tour Packages",
    categoryFilter: "blossom",
    introText: [
      "Spring in the Karakoram brings an extraordinary natural spectacle as millions of apricot, cherry, almond, and peach trees burst into delicate pink and white blooms against towering snowy battlements. Cherry blossom tour packages operate from late March through late April across Hunza, Nagar, and Gilgit.",
      "Guided blossom itineraries visit terraced villages including Altit, Karimabad, Gulmit, and the blossom-lined banks of the Hunza River. Travelers enjoy comfortable spring temperatures, local cultural gatherings, and uncrowded historical forts.",
      "Connect directly with independent northern operators to book seasonal spring departures with private transport and local mountain guides."
    ],
    faqs: [
      {
        q: "When do cherry blossoms bloom in Hunza?",
        a: "Blossoms begin in late March in lower Gilgit and Nagar, peaking in Central Hunza (Karimabad, Altit) between April 5 and April 20."
      },
      {
        q: "Are roads open during the cherry blossom season?",
        a: "Yes. The Karakoram Highway (N-35) remains open throughout the spring blossom season, allowing smooth vehicular access."
      }
    ]
  },

  "winter-tours-pakistan": {
    slug: "winter-tours-pakistan",
    title: "Winter Tour Packages Pakistan",
    seoTitle: "Winter Tour Packages Pakistan",
    metaDescription: "Explore guided winter tour packages across Malam Jabba ski slopes, Murree snowscapes, and cold desert landscapes from independent local operators.",
    h1: "Winter Snow & Skiing Tour Packages in Pakistan",
    categoryFilter: "winter",
    introText: [
      "Winter reveals a completely different, dramatic facet of northern Pakistan. From active alpine skiing and snowboarding at Malam Jabba in Swat to crisp snow-dusted pine ridges in Murree and Galyat and frozen waterfalls in Hunza, winter tour packages cater to snow enthusiasts and landscape photographers.",
      "Packages in Swat focus on the Malam Jabba ski slope, equipped with chairlifts, snow rentals, and professional ski instructors. In Murree and Patriata, packages offer accessible weekend snow getaways just 90 minutes from Islamabad.",
      "Explore winter tour departures with heated accommodations, winterized mountain vehicles, and experienced local operators on PakistanTravel."
    ],
    faqs: [
      {
        q: "Where is the best place to see snow and ski in Pakistan?",
        a: "Malam Jabba in Swat Valley is Pakistan's premier operational ski resort, featuring dual chairlifts, modern hotel lodgings, and natural snow slopes."
      },
      {
        q: "Are roads safe for winter driving?",
        a: "Reputable operators use winterized vehicles equipped with tire chains and experienced drivers familiar with frozen mountain passes."
      }
    ]
  }
};
