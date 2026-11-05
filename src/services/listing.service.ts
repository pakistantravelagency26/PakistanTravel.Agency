export interface ListingUnitData {
  id: string;
  title: string;
  description: string;
  maxGuests: number;
  totalQuantity: number;
  basePrice: number;
  photos: string[];
  amenities: string[];
  bedType: string;
}

export interface ListingData {
  id: string;
  slug: string;
  title: string;
  type: "HOTEL" | "TOUR" | "RENTAL" | "ACTIVITY";
  destinationSlug: string;
  destinationName: string;
  province: string;
  address: string;
  city: string;
  basePrice: number;
  avgRating: number;
  totalReviews: number;
  isFeatured: boolean;
  freeCancellation: boolean;
  freeCancellationDays: number;
  photos: string[];
  amenities: string[];
  description: string;
  badge?: string;
  duration?: string;
  cancellationPolicy: string;
  vendor: {
    id: string;
    businessName: string;
    verified: boolean;
    joinedYear: number;
    rating: number;
  };
  units: ListingUnitData[];
  reviews: {
    id: string;
    userName: string;
    userCity: string;
    rating: number;
    date: string;
    comment: string;
    vendorReply?: string;
  }[];
}

// Multi-Vendor Network (Verified Tour & Hotel Operators across Pakistan)
export const VENDORS = {
  KARAKORAM: {
    id: "v-karakoram-expeditions",
    businessName: "Karakoram Expeditions & Northern Tours",
    verified: true,
    joinedYear: 2019,
    rating: 4.95,
  },
  HUNZA_ADVENTURES: {
    id: "v-hunza-adventures",
    businessName: "Hunza Valley Adventures & Treks",
    verified: true,
    joinedYear: 2020,
    rating: 4.92,
  },
  SERENA_HOTELS: {
    id: "v-serena-hotels",
    businessName: "Serena Hotels & Heritage Lodges",
    verified: true,
    joinedYear: 2018,
    rating: 4.98,
  },
  SWAT_ALPINE: {
    id: "v-swat-alpine",
    businessName: "Swat & Kalam Alpine Travels",
    verified: true,
    joinedYear: 2021,
    rating: 4.88,
  },
  FAIRY_MEADOWS_GUIDES: {
    id: "v-fairy-meadows-guides",
    businessName: "Nanga Parbat Treks & Fairy Meadows",
    verified: true,
    joinedYear: 2020,
    rating: 4.94,
  },
  PEARL_CONTINENTAL: {
    id: "v-pc-resorts",
    businessName: "Pearl Continental Resorts & Stays",
    verified: true,
    joinedYear: 2019,
    rating: 4.91,
  },
};

const VENDOR_KARAKORAM = VENDORS.KARAKORAM;

export const MOCK_LISTINGS: ListingData[] = [
  // -------------------------------------------------------------
  // TOUR 1: Skardu, Shigar, Khaplu & Deosai
  // -------------------------------------------------------------
  {
    id: "skardu-7-day-tour",
    slug: "skardu-7-day-tour",
    title: "7-Day Skardu, Shigar, Khaplu & Deosai Plains Expedition",
    type: "TOUR",
    duration: "7 Days / 6 Nights",
    destinationSlug: "skardu",
    destinationName: "Skardu",
    province: "Gilgit-Baltistan",
    address: "Skardu Airport / Islamabad Pickup",
    city: "Skardu",
    basePrice: 65000,
    avgRating: 4.9,
    totalReviews: 184,
    isFeatured: true,
    freeCancellation: true,
    freeCancellationDays: 7,
    badge: "Best Seller Tour",
    photos: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "Dedicated 4x4 Prado with Mountain Driver",
      "6 Nights Luxury Hotel Stays (Shangrila & Shigar)",
      "Daily Buffet Breakfast & Dinner Included",
      "Deosai National Park & Sheosar Lake Permits",
      "Airport Pick & Drop in Skardu",
      "First Aid Kit & Oxygen Cylinder Support"
    ],
    description: "Our signature 7-day tour takes you through the jewel of Baltistan. Visit legendary Shangrila Resort, Upper Kachura Lake with trout boating, the high-altitude Sarfaranga Cold Desert, centuries-old Shigar Fort Palace, Khaplu Royal Residence, and the breathtaking Deosai Plains (The Land of Giants) sitting above 4,000 meters.",
    cancellationPolicy: "Free cancellation until 7 days prior to departure. 100% refund guaranteed.",
    vendor: VENDOR_KARAKORAM,
    units: [
      {
        id: "tour-1-standard",
        title: "Per Person Package (Twin Sharing)",
        description: "Includes all 6 nights accommodation, private vehicle, 2 daily meals, and permits.",
        maxGuests: 2,
        totalQuantity: 12,
        basePrice: 65000,
        bedType: "Hotel Room (Double/Twin Bed)",
        photos: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80"],
        amenities: ["All Transport Included", "Breakfast & Dinner Included", "National Park Permits"]
      },
      {
        id: "tour-1-private-family",
        title: "Private Family Vehicle (Up to 4 Persons)",
        description: "Exclusive dedicated Toyota Prado TX for family with private driver and executive suites.",
        maxGuests: 4,
        totalQuantity: 4,
        basePrice: 220000,
        bedType: "2 Interconnected Executive Rooms",
        photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"],
        amenities: ["Private Dedicated Prado", "Executive Suites", "Custom Itinerary Flexibility"]
      }
    ],
    reviews: [
      {
        id: "rev-s1",
        userName: "Zainab Chaudhry",
        userCity: "Faisalabad, Pakistan",
        rating: 5,
        date: "October 2026",
        comment: "Flawless coordination! Our driver Naveed bhai was punctual, friendly, and navigated Deosai safely. The stay in Shigar Fort was a dream.",
        vendorReply: "Thank you Zainab! We take great pride in making Northern Pakistan journeys memorable and safe."
      }
    ]
  },

  // -------------------------------------------------------------
  // TOUR 2: Hunza Valley, Attabad Lake & Khunjerab Pass
  // -------------------------------------------------------------
  {
    id: "hunza-5-day-tour",
    slug: "hunza-5-day-tour",
    title: "5-Day Hunza Valley, Attabad Lake & Khunjerab Pass Tour",
    type: "TOUR",
    duration: "5 Days / 4 Nights",
    destinationSlug: "hunza",
    destinationName: "Hunza Valley",
    province: "Gilgit-Baltistan",
    address: "Islamabad / Gilgit Airport Route",
    city: "Karimabad",
    basePrice: 48000,
    avgRating: 4.9,
    totalReviews: 216,
    isFeatured: true,
    freeCancellation: true,
    freeCancellationDays: 5,
    badge: "Most Popular",
    photos: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "Toyota Grand Cabin / Coaster / Prado",
      "4 Nights Hotel Stays in Karimabad & Gulmit",
      "Breakfast & Dinner Daily",
      "Attabad Lake Motorboat Cruise Included",
      "Passu Cones & Hussaini Bridge Visit",
      "Khunjerab National Park Entry Pass (Pak-China Border)"
    ],
    description: "Travel the world-famous Karakoram Highway into fairy-tale Hunza. Explore 700-year-old Baltit and Altit Forts, cruise across the turquoise waters of Attabad Lake on private speedboats, marvel at the sharp gothic needles of Passu Cones, cross the thrilling Hussaini suspension bridge, and touch the highest paved international border at Khunjerab Pass (4,693 meters).",
    cancellationPolicy: "Free cancellation up to 5 days before trip departure.",
    vendor: VENDORS.HUNZA_ADVENTURES,
    units: [
      {
        id: "tour-2-seat",
        title: "Per Person Seat (Standard Stays)",
        description: "Twin-sharing basis in quality mountain lodges with 2 daily meals.",
        maxGuests: 1,
        totalQuantity: 20,
        basePrice: 48000,
        bedType: "Twin / Double Sharing",
        photos: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80"],
        amenities: ["Transport Included", "Meals Included", "Sightseeing Tickets"]
      },
      {
        id: "tour-2-couple",
        title: "Couple Package (Luxury Room with Mountain View)",
        description: "Private room with balcony facing Rakaposhi and dedicated transport seating.",
        maxGuests: 2,
        totalQuantity: 6,
        basePrice: 110000,
        bedType: "1 King Bed",
        photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80"],
        amenities: ["Private Balcony", "Heater Setup", "Buffet Meals"]
      }
    ],
    reviews: [
      {
        id: "rev-h1",
        userName: "Bilal Akhtar",
        userCity: "Islamabad, Pakistan",
        rating: 5,
        date: "September 2026",
        comment: "Khunjerab pass snow was magical! Speedboating on Attabad Lake was handled with top safety jackets."
      }
    ]
  },

  // -------------------------------------------------------------
  // TOUR 3: Swat Valley, Malam Jabba & Kalam Tour
  // -------------------------------------------------------------
  {
    id: "swat-kalam-4-day-tour",
    slug: "swat-kalam-4-day-tour",
    title: "4-Day Swat Valley, Malam Jabba Ski Resort & Kalam Tour",
    type: "TOUR",
    duration: "4 Days / 3 Nights",
    destinationSlug: "swat",
    destinationName: "Swat Valley",
    province: "KPK",
    address: "Islamabad Motorway M-16 Route",
    city: "Kalam",
    basePrice: 32000,
    avgRating: 4.8,
    totalReviews: 145,
    isFeatured: true,
    freeCancellation: true,
    freeCancellationDays: 3,
    badge: "Switzerland of East",
    photos: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "AC Transport via Swat Expressway",
      "3 Nights Riverside Hotel in Mingora & Kalam",
      "Malam Jabba Ski Chairlift & Zipline Excursion",
      "4x4 Safari to Ushu Forest & Mahodand Lake",
      "Traditional Trout Fish Dinner Included"
    ],
    description: "Discover the lush alpine beauty of Swat. Visit the historic White Palace in Marghazar, ride the high-altitude chairlift at Malam Jabba ski resort, and take a thrilling 4x4 jeep trek deep into Kalam to see the cedar woods of Ushu and the crystal waters of Mahodand Lake.",
    cancellationPolicy: "Free cancellation until 72 hours before trip start date.",
    vendor: VENDORS.SWAT_ALPINE,
    units: [
      {
        id: "tour-3-unit",
        title: "Per Person Seat (Double/Triple Sharing)",
        description: "All transport, hotel stays, breakfasts, and 4x4 jeep safari charges included.",
        maxGuests: 1,
        totalQuantity: 15,
        basePrice: 32000,
        bedType: "Standard Room",
        photos: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80"],
        amenities: ["Jeep Safari Included", "Expressway Tolls Paid", "Hot Showers"]
      }
    ],
    reviews: [
      {
        id: "rev-sw1",
        userName: "Dr. Hamza Siddiqui",
        userCity: "Peshawar, Pakistan",
        rating: 5,
        date: "August 2026",
        comment: "Mahodand lake jeep drive was breathtaking. Trout fish dinner in Kalam was very fresh!"
      }
    ]
  },

  // -------------------------------------------------------------
  // TOUR 4: Fairy Meadows & Nanga Parbat Basecamp Trek
  // -------------------------------------------------------------
  {
    id: "fairy-meadows-nanga-parbat-tour",
    slug: "fairy-meadows-nanga-parbat-tour",
    title: "8-Day Fairy Meadows, Nanga Parbat Basecamp & Hunza Trek",
    type: "TOUR",
    duration: "8 Days / 7 Nights",
    destinationSlug: "hunza",
    destinationName: "Raikot & Fairy Meadows",
    province: "Gilgit-Baltistan",
    address: "Raikot Bridge, Karakoram Highway",
    city: "Chilas",
    basePrice: 85000,
    avgRating: 5.0,
    totalReviews: 92,
    isFeatured: true,
    freeCancellation: true,
    freeCancellationDays: 7,
    badge: "Bucket List Adventure",
    photos: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "Mountain Jeep Ride on World's Deadliest Road (Raikot-Tattu)",
      "Log Cottage Stay at Fairy Meadows overlooking Nanga Parbat",
      "Guided Day Hike to Beyal Camp & Nanga Parbat Basecamp (German Camp)",
      "All Trekking Porters & Certified Alpine Guides",
      "Bonfire & Traditional Balti/Shina Folk Music"
    ],
    description: "An awe-inspiring expedition to the legendary Fairy Meadows at the foot of Nanga Parbat (8,126m) — the 9th highest mountain on earth. Marvel at the reflection of snow giant in the meadows' natural pools, hike through birch forests to Beyal Camp, and touch the Raikot Glacier.",
    cancellationPolicy: "Free cancellation until 7 days prior to departure.",
    vendor: VENDORS.FAIRY_MEADOWS_GUIDES,
    units: [
      {
        id: "tour-4-trekker",
        title: "Per Person Full Trek Package",
        description: "Includes log hut stay in Fairy Meadows, mountain jeeps, certified mountain guides, and all meals.",
        maxGuests: 1,
        totalQuantity: 10,
        basePrice: 85000,
        bedType: "Fairy Meadows Wooden Cottage",
        photos: ["https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80"],
        amenities: ["Mountain Guide", "Wooden Cabin", "Full Board Meals"]
      }
    ],
    reviews: [
      {
        id: "rev-fm1",
        userName: "Taimoor Hassan",
        userCity: "Lahore, Pakistan",
        rating: 5,
        date: "September 2026",
        comment: "Waking up to Nanga Parbat right outside my cabin window was a spiritual experience. Karakoram Expeditions team was 10/10."
      }
    ]
  },

  // -------------------------------------------------------------
  // TOUR 5: Neelum Valley & Ratti Gali Lake
  // -------------------------------------------------------------
  {
    id: "neelum-valley-ratti-gali-tour",
    slug: "neelum-valley-ratti-gali-tour",
    title: "3-Day Neelum Valley, Sharda & Ratti Gali Lake Tour",
    type: "TOUR",
    duration: "3 Days / 2 Nights",
    destinationSlug: "neelum",
    destinationName: "Neelum Valley",
    province: "Azad Kashmir",
    address: "Muzaffarabad / Neelum Highway",
    city: "Sharda",
    basePrice: 28500,
    avgRating: 4.8,
    totalReviews: 120,
    isFeatured: false,
    freeCancellation: true,
    freeCancellationDays: 3,
    badge: "Paradise on Earth",
    photos: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "Saloon Coaster / Prado Transport from Islamabad",
      "2 Nights Riverside Stay in Keran & Sharda",
      "4x4 Mountain Jeep Trek to Alpine Ratti Gali Lake",
      "Sharda Peeth Ancient Buddhist University Ruins Tour",
      "Kashmir Tea & Bonfire Night"
    ],
    description: "Explore the emerald rivers and dense forests of Azad Kashmir's Neelum Valley. Visit Dhani Waterfall, stay right opposite the Line of Control in Keran, visit Sharda's 2,000-year-old temple ruins, and ascend in 4x4 jeeps to the jaw-dropping glacial jewel of Ratti Gali Lake at 3,700m.",
    cancellationPolicy: "Free cancellation up to 3 days before departure.",
    vendor: VENDORS.HUNZA_ADVENTURES,
    units: [
      {
        id: "tour-5-standard",
        title: "Per Person Package (Twin Sharing)",
        description: "Covers all transport, hotel room, 4x4 jeep safari, and 2 daily meals.",
        maxGuests: 1,
        totalQuantity: 16,
        basePrice: 28500,
        bedType: "Riverside Resort Room",
        photos: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80"],
        amenities: ["Jeep Trek to Ratti Gali", "Riverside Stay", "Kashmiri Meals"]
      }
    ],
    reviews: [
      {
        id: "rev-nv1",
        userName: "Sana Tariq",
        userCity: "Rawalpindi, Pakistan",
        rating: 5,
        date: "July 2026",
        comment: "Ratti Gali lake was surrounded by blooming red wildflowers! Truly unforgettable trip."
      }
    ]
  },

  // -------------------------------------------------------------
  // TOUR 6: Kumrat Valley, Jahaz Banda & Katora Lake
  // -------------------------------------------------------------
  {
    id: "kumrat-valley-katora-lake-tour",
    slug: "kumrat-valley-katora-lake-tour",
    title: "4-Day Kumrat Valley, Jahaz Banda Meadows & Katora Lake Trek",
    type: "TOUR",
    duration: "4 Days / 3 Nights",
    destinationSlug: "kumrat",
    destinationName: "Kumrat Valley",
    province: "KPK",
    address: "Thal, Upper Dir, KPK",
    city: "Kumrat",
    basePrice: 34000,
    avgRating: 4.9,
    totalReviews: 88,
    isFeatured: true,
    freeCancellation: true,
    freeCancellationDays: 4,
    badge: "Pristine Wilderness",
    photos: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "4x4 Mountain Jeep Transfer to Kumrat Forest & Jaki Banda",
      "Riverside Wooden Pods & Alpine Glamping Tents",
      "Guided Trek to the Emerald Katora (Bowl) Lake",
      "Panjkora River Bonfire & Trout Barbecue",
      "Local Pashtun Trail Guides"
    ],
    description: "Venture into one of Pakistan's most pristine alpine valleys. Walk under soaring century-old Deodar pines in Kumrat forest, visit the Kumrat waterfall, climb to the vast grassy meadows of Jahaz Banda, and hike up to the mystical bowl-shaped glacial Katora Lake.",
    cancellationPolicy: "Free cancellation until 4 days before trip departure.",
    vendor: VENDOR_KARAKORAM,
    units: [
      {
        id: "tour-6-unit",
        title: "Per Person Full Adventure Package",
        description: "Jeeps, alpine camping/resort stay, guide, and 2 hot meals daily.",
        maxGuests: 1,
        totalQuantity: 12,
        basePrice: 34000,
        bedType: "Riverside Wooden Cottage / Glamping Pod",
        photos: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80"],
        amenities: ["4x4 Jeeps Included", "Glamping Tents", "Trek Guide"]
      }
    ],
    reviews: [
      {
        id: "rev-kv1",
        userName: "Adeel Khan",
        userCity: "Karachi, Pakistan",
        rating: 5,
        date: "August 2026",
        comment: "The scent of pine trees and pristine cold water of Katora lake made every mile worth it."
      }
    ]
  },

  // -------------------------------------------------------------
  // TOUR 7: Skardu Luxury Honeymoon Package
  // -------------------------------------------------------------
  {
    id: "skardu-luxury-honeymoon-package",
    slug: "skardu-luxury-honeymoon-package",
    title: "6-Day Skardu Luxury Honeymoon & Serena Palace Retreat",
    type: "TOUR",
    duration: "6 Days / 5 Nights",
    destinationSlug: "skardu",
    destinationName: "Skardu",
    province: "Gilgit-Baltistan",
    address: "Skardu Airport VIP Pickup",
    city: "Shigar",
    basePrice: 195000,
    avgRating: 5.0,
    totalReviews: 64,
    isFeatured: true,
    freeCancellation: true,
    freeCancellationDays: 7,
    badge: "5-Star Honeymoon",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "Private Toyota Prado TX (Dedicated Chauffeur & Fuel)",
      "2 Nights Serena Shigar Fort + 3 Nights Shangrila Resort",
      "Candlelit Dinner by the Lower Kachura Lake",
      "Special Honeymoon Suite Decoration & Flower Bouquet",
      "Sarfaranga Desert Sunset Safari with Tea Setup",
      "Airport VIP Welcome & Drop-off"
    ],
    description: "Designed exclusively for couples seeking romance amidst dramatic Himalayan and Karakoram peaks. Stay in royal palaces dating back to the Amacha Dynasty, glide across Shangrila Lake in a private boat, and watch the sun dip over the world's highest cold desert in total comfort.",
    cancellationPolicy: "Free cancellation until 7 days prior to arrival.",
    vendor: VENDOR_KARAKORAM,
    units: [
      {
        id: "tour-7-couple",
        title: "All-Inclusive Couple Package (2 Persons)",
        description: "Entire 6-day private luxury trip for two with 5-star heritage suites, private Prado, and all dinners.",
        maxGuests: 2,
        totalQuantity: 3,
        basePrice: 195000,
        bedType: "Serena Heritage Royal Suite",
        photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80"],
        amenities: ["Private Dedicated Prado", "Serena Hotels Stays", "Honeymoon Special Setup"]
      }
    ],
    reviews: [
      {
        id: "rev-hm1",
        userName: "Saad & Mahnoor",
        userCity: "Lahore, Pakistan",
        rating: 5,
        date: "September 2026",
        comment: "The candlelit dinner at Shangrila was straight out of a fairy tale. Everything was punctual, private, and luxurious."
      }
    ]
  },

  // -------------------------------------------------------------
  // TOUR 8: Naran, Kaghan, Babusar Top & Saif-ul-Malook
  // -------------------------------------------------------------
  {
    id: "naran-kaghan-babusar-tour",
    slug: "naran-kaghan-babusar-tour",
    title: "3-Day Naran, Kaghan, Babusar Top & Lake Saif-ul-Malook Tour",
    type: "TOUR",
    duration: "3 Days / 2 Nights",
    destinationSlug: "naran",
    destinationName: "Naran & Kaghan",
    province: "KPK",
    address: "Islamabad / Hazara Motorway Route",
    city: "Naran",
    basePrice: 24500,
    avgRating: 4.7,
    totalReviews: 290,
    isFeatured: false,
    freeCancellation: true,
    freeCancellationDays: 2,
    badge: "Classic Family Tour",
    photos: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "Comfortable Coaster / Grand Cabin Transport",
      "2 Nights Stay in Central Naran Bazaar Hotels",
      "4x4 Willis Jeep Ride to legendary Lake Saif-ul-Malook",
      "Drive to Babusar Top (4,173 meters) & Lulusar Lake",
      "Kiwai Waterfall Tea Break"
    ],
    description: "The timeless summer getaway for Pakistani families. Ride open-top 4x4 jeeps up the rugged road to fairy-tale Lake Saif-ul-Malook (home of Prince Saif and Badri Jamala folklore), drive past the mirrors of Lulusar Lake, and feel the freezing winds at Babusar Top connecting KPK with Gilgit-Baltistan.",
    cancellationPolicy: "Free cancellation up to 48 hours before departure.",
    vendor: VENDOR_KARAKORAM,
    units: [
      {
        id: "tour-8-seat",
        title: "Per Person Seat (Standard Stays)",
        description: "Includes AC vehicle, hotel stay, jeep ride to Saif-ul-Malook, and breakfasts.",
        maxGuests: 1,
        totalQuantity: 25,
        basePrice: 24500,
        bedType: "Standard Room",
        photos: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80"],
        amenities: ["Jeep Safari Included", "Breakfasts Included", "Hazara Motorway Tolls"]
      }
    ],
    reviews: [
      {
        id: "rev-nk1",
        userName: "Rashid Minhas",
        userCity: "Gujranwala, Pakistan",
        rating: 5,
        date: "July 2026",
        comment: "Babusar top was cold and windy! Kids loved the boating on Saif-ul-Malook. Very smooth execution."
      }
    ]
  },

  // -------------------------------------------------------------
  // TOUR 9: Chitral, Kalash Valley & Shandur Pass
  // -------------------------------------------------------------
  {
    id: "chitral-kalash-valley-tour",
    slug: "chitral-kalash-valley-tour",
    title: "5-Day Chitral, Kalash Valley Cultural Tour & Shandur Pass",
    type: "TOUR",
    duration: "5 Days / 4 Nights",
    destinationSlug: "chitral",
    destinationName: "Chitral & Kalash",
    province: "KPK",
    address: "Lowari Tunnel, Chitral Route",
    city: "Bumburet",
    basePrice: 52000,
    avgRating: 4.9,
    totalReviews: 76,
    isFeatured: true,
    freeCancellation: true,
    freeCancellationDays: 5,
    badge: "Unique Culture",
    photos: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "4x4 Mountain Vehicles across Lowari & Kalash Valleys",
      "Authentic Village Homestays in Bumburet & Rumbur",
      "Cultural interaction with indigenous Kalasha people",
      "Visit to Shahi Mosque Chitral & Chitral Fort",
      "Excursion to Shandur Polo Ground (Roof of the World)"
    ],
    description: "Immerse yourself in one of the world's most unique surviving pagan cultures. Meet the cheerful Kalasha people in Bumburet and Rumbur with their vibrant headdresses and traditional dances, gaze upon Mount Tirich Mir (7,708m in Hindu Kush), and visit Shandur Top where freestyle polo has been played for centuries at 3,700m.",
    cancellationPolicy: "Free cancellation until 5 days before departure.",
    vendor: VENDOR_KARAKORAM,
    units: [
      {
        id: "tour-9-seat",
        title: "Per Person Cultural Expedition Seat",
        description: "All mountain transport, Kalash village heritage lodge, guide fees, and 2 meals daily.",
        maxGuests: 1,
        totalQuantity: 12,
        basePrice: 52000,
        bedType: "Kalash Heritage Lodge Room",
        photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"],
        amenities: ["Cultural Guide", "Village Homestay", "Local Food Tasting"]
      }
    ],
    reviews: [
      {
        id: "rev-ch1",
        userName: "Mariam Baig",
        userCity: "Islamabad, Pakistan",
        rating: 5,
        date: "May 2026",
        comment: "Attending the Chilam Joshi festival and experiencing the warm hospitality of Kalash women was unforgettable."
      }
    ]
  },

  // -------------------------------------------------------------
  // TOUR 10: Gwadar & Makran Coastal Highway
  // -------------------------------------------------------------
  {
    id: "gwadar-makran-coastal-tour",
    slug: "gwadar-makran-coastal-tour",
    title: "4-Day Gwadar, Ormara Beach & Kund Malir Coastal Highway Tour",
    type: "TOUR",
    duration: "4 Days / 3 Nights",
    destinationSlug: "gwadar",
    destinationName: "Gwadar & Makran Coast",
    province: "Balochistan",
    address: "Makran Coastal Highway N-10, Karachi / Gwadar",
    city: "Gwadar",
    basePrice: 38000,
    avgRating: 4.9,
    totalReviews: 110,
    isFeatured: true,
    freeCancellation: true,
    freeCancellationDays: 3,
    badge: "Coastal Wonder",
    photos: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "AC Saloon Transport along Scenic Coastal Highway N-10",
      "3 Nights Beach Resort & Hotel in Ormara & Gwadar",
      "Visit to Princess of Hope & Natural Sphinx of Balochistan",
      "Sunset Boating at Hammerhead Rock (Koh-e-Batil)",
      "Fresh Arabian Sea Seafood Barbecue Dinner"
    ],
    description: "Experience Pakistan's dramatic Arabian Sea coast. Drive along one of the world's most scenic coastal roads through Hingol National Park, see surreal mud volcanos and the carved rock statues of the Princess of Hope, camp by the glowing bioluminescent waters of Ormara Beach, and climb Koh-e-Batil for panoramic sunset views over Gwadar port.",
    cancellationPolicy: "Free cancellation until 72 hours before trip start date.",
    vendor: VENDORS.SWAT_ALPINE,
    units: [
      {
        id: "tour-10-seat",
        title: "Per Person All-Inclusive Coastal Seat",
        description: "Includes AC highway vehicle, beach resort rooms, boat cruise, and fresh seafood meals.",
        maxGuests: 1,
        totalQuantity: 18,
        basePrice: 38000,
        bedType: "Beach Resort Room",
        photos: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80"],
        amenities: ["Coastal Highway Cruise", "Seafood BBQ", "Beach Resort Stay"]
      }
    ],
    reviews: [
      {
        id: "rev-gw1",
        userName: "Farhan Siddique",
        userCity: "Karachi, Pakistan",
        rating: 5,
        date: "October 2026",
        comment: "Kund Malir desert beach meeting the Arabian sea is unbelievable. The Gwadar deep sea boating was the highlight."
      }
    ]
  },

  // -------------------------------------------------------------
  // HOTEL 1: Hunza Serena Inn & Mountain Lodges
  // -------------------------------------------------------------
  {
    id: "serena-hunza-luxury-lodge",
    slug: "serena-hunza-luxury-lodge",
    title: "Hunza Serena Inn - Deluxe Mountain View Rooms",
    type: "HOTEL",
    duration: "Per Night Stay",
    destinationSlug: "hunza",
    destinationName: "Hunza Valley",
    province: "Gilgit-Baltistan",
    address: "Karimabad Bazaar, Central Hunza",
    city: "Karimabad",
    basePrice: 38000,
    avgRating: 4.98,
    totalReviews: 240,
    isFeatured: true,
    freeCancellation: true,
    freeCancellationDays: 3,
    badge: "5-Star Heritage Stay",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "Panoramic Views of Ultar Sar & Rakaposhi",
      "Complimentary Royal Buffet Breakfast",
      "Central Heating & 24/7 Hot Showers",
      "High Speed Fiber Internet (Starlink backed)",
      "Traditional Organic Apricot Garden Dining"
    ],
    description: "Perched high on the cliffs of Karimabad, Hunza Serena Inn offers unrivaled 5-star comfort nestled in traditional timber architecture. Soak in 360-degree views of snow-capped Ultar peaks while savoring local Hunzai cuisine prepared by certified chefs.",
    cancellationPolicy: "Free cancellation until 72 hours before check-in.",
    vendor: VENDORS.SERENA_HOTELS,
    units: [
      {
        id: "serena-deluxe-room",
        title: "Deluxe Mountain View Room",
        description: "Spacious luxury room with private garden terrace, king bed, and heated bathroom.",
        maxGuests: 2,
        totalQuantity: 8,
        basePrice: 38000,
        bedType: "1 King Bed or 2 Twin Beds",
        photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80"],
        amenities: ["Breakfast Included", "Heated Floors", "Mountain View Terrace"]
      }
    ],
    reviews: [
      {
        id: "rev-ser1",
        userName: "Ayesha Malik",
        userCity: "Lahore, Pakistan",
        rating: 5,
        date: "October 2026",
        comment: "The views from the terrace during sunrise are unmatched in Pakistan. Impeccable Serena service!"
      }
    ]
  },

  // -------------------------------------------------------------
  // HOTEL 2: Pearl Continental Hotel Bhurban
  // -------------------------------------------------------------
  {
    id: "pc-bhurban-luxury-resort",
    slug: "pc-bhurban-luxury-resort",
    title: "Pearl Continental Resort Bhurban - Mountain Suites",
    type: "HOTEL",
    duration: "Per Night Stay",
    destinationSlug: "murree",
    destinationName: "Bhurban & Murree",
    province: "Punjab",
    address: "Murree Hills, Bhurban",
    city: "Bhurban",
    basePrice: 32000,
    avgRating: 4.9,
    totalReviews: 310,
    isFeatured: true,
    freeCancellation: true,
    freeCancellationDays: 2,
    badge: "Iconic Resort",
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: [
      "Surrounded by Pine Forests & Kashmir Valley Views",
      "Lavish Buffet Breakfast Included",
      "Heated Indoor Pool & Spa Center",
      "Kids Play Area & 9-Hole Golf Course Access",
      "Multiple Fine Dining Restaurants"
    ],
    description: "Nestled amidst the lush pine forests of the Murree hills, PC Bhurban is Pakistan's premier five-star mountain getaway. Enjoy luxury spa facilities, serene nature trails, and breathtaking vistas of the Kashmir valley.",
    cancellationPolicy: "Free cancellation until 48 hours before check-in.",
    vendor: VENDORS.PEARL_CONTINENTAL,
    units: [
      {
        id: "pc-executive-room",
        title: "Executive Pine View Room",
        description: "Elegant room overlooking pine forest with balcony, complimentary breakfast, and club lounge access.",
        maxGuests: 2,
        totalQuantity: 12,
        basePrice: 32000,
        bedType: "1 King Bed",
        photos: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80"],
        amenities: ["Breakfast Included", "Pine Valley Balcony", "Spa & Pool Access"]
      }
    ],
    reviews: [
      {
        id: "rev-pc1",
        userName: "Kamran Qureshi",
        userCity: "Islamabad, Pakistan",
        rating: 5,
        date: "September 2026",
        comment: "Only 1.5 hours drive from Islamabad. Perfect weekend stay with family."
      }
    ]
  }
];

export async function getListings(filters?: {
  destination?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  amenities?: string[];
  sortBy?: string;
}): Promise<ListingData[]> {
  let results = [...MOCK_LISTINGS];

  if (filters?.destination) {
    const q = filters.destination.toLowerCase().trim();
    results = results.filter(
      (l) =>
        l.destinationSlug.toLowerCase().includes(q) ||
        l.destinationName.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.title.toLowerCase().includes(q) ||
        l.province.toLowerCase().includes(q)
    );
  }

  if (filters?.type && filters.type !== "ALL") {
    results = results.filter((l) => l.type === filters.type);
  }

  if (filters?.minPrice !== undefined) {
    results = results.filter((l) => l.basePrice >= filters.minPrice!);
  }

  if (filters?.maxPrice !== undefined) {
    results = results.filter((l) => l.basePrice <= filters.maxPrice!);
  }

  if (filters?.rating !== undefined) {
    results = results.filter((l) => l.avgRating >= filters.rating!);
  }

  if (filters?.sortBy === "price_asc") {
    results.sort((a, b) => a.basePrice - b.basePrice);
  } else if (filters?.sortBy === "price_desc") {
    results.sort((a, b) => b.basePrice - a.basePrice);
  } else if (filters?.sortBy === "rating_desc") {
    results.sort((a, b) => b.avgRating - a.avgRating);
  }

  return results;
}

export async function getListingBySlugOrId(idOrSlug: string): Promise<ListingData | null> {
  const found = MOCK_LISTINGS.find((l) => l.id === idOrSlug || l.slug === idOrSlug);
  return found || null;
}


export function createNewListing(listing: ListingData): ListingData {
  const existingIdx = MOCK_LISTINGS.findIndex((l) => l.id === listing.id || l.slug === listing.slug);
  if (existingIdx >= 0) {
    MOCK_LISTINGS[existingIdx] = listing;
  } else {
    MOCK_LISTINGS.unshift(listing);
  }
  return listing;
}

export function updateListing(id: string, updates: Partial<ListingData>): ListingData | null {
  const idx = MOCK_LISTINGS.findIndex((l) => l.id === id);
  if (idx >= 0) {
    MOCK_LISTINGS[idx] = { ...MOCK_LISTINGS[idx], ...updates };
    return MOCK_LISTINGS[idx];
  }
  return null;
}

export function deleteListing(id: string): boolean {
  const idx = MOCK_LISTINGS.findIndex((l) => l.id === id);
  if (idx >= 0) {
    MOCK_LISTINGS.splice(idx, 1);
    return true;
  }
  return false;
}
