import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CANCELLATION_SUMMARY = "100% refund for cancellations made 7 or more days before departure. 50% refund for cancellations between 3 and 6 days before departure. Non-refundable within 72 hours of departure.";

async function main() {
  console.log("=== UPDATING DATABASE LISTINGS FOR H3 ===");

  // 1. Update Vendor business name to Proper Case "Tours Khourshem"
  await prisma.vendor.updateMany({
    where: { id: "v-tourskhourshem-0634" },
    data: {
      businessName: "Tours Khourshem",
      city: "Islamabad",
      status: "VERIFIED",
      commissionRate: 10,
    }
  });
  console.log("Updated vendor v-tourskhourshem-0634 -> 'Tours Khourshem'");

  // 2. Listing 1: hunza-valley-attabad-2640 (8-Day Autumn Classic Hunza & Attabad Lake Tour)
  const desc2640 = `8-Day Autumn Classic Hunza & Attabad Lake Tour

📍 Tour Journey & Sightseeing Route:
Islamabad ➔ Hazara Motorway ➔ Besham ➔ Chilas (via KKH, Babusar Closed in Winter) ➔ Rakaposhi View Point ➔ Karimabad ➔ Baltit & Altit Forts ➔ Attabad Lake ➔ Passu Cones & Hussaini Bridge ➔ Islamabad

🚐 Departure & Pickup Meeting Points:
1. Islamabad: Daewoo Express Terminal (G-7 / Peshawar Road) at 06:00 AM
2. Islamabad: Rawalpindi Saddar Metro Station Point at 06:30 AM
3. Hasan Abdal / Hazara Motorway Interchange at 07:15 AM

📅 Day-by-Day Itinerary:
• Day 1: Islamabad departure via Hazara Motorway and KKH to Chilas / Besham
• Day 2: Journey along Indus River past Nanga Parbat and Rakaposhi viewpoints to Karimabad
• Day 3: Heritage walking tour of 700-year-old Baltit Fort, Altit Fort, and Karimabad Royal Gardens
• Day 4: Turquoise waters of Attabad Lake (boating included) and scenic drive along Passu Cones
• Day 5: Hussaini Suspension Bridge crossing, Borith Lake viewpoint, and local Wakhi cultural experience
• Day 6: Sunset panoramic view from Duikar Eagles Nest overlooking Ultar Sar and Ladyfinger Peak
• Day 7: Southbound transit along Karakoram Highway to Besham night halt
• Day 8: Final motorway journey returning to Islamabad pickup terminal

⚠️ Seasonal Mountain Route Notice:
Babusar Pass is closed during winter and late autumn due to heavy snow. This departure operates strictly via the all-weather Karakoram Highway (KKH) through Hazara Motorway, Besham, and Kohistan.

🛂 Identification & Permits:
Pakistani citizens must carry original valid CNIC. Overseas Pakistanis (NICOP) and international tourists must carry original passport and Pakistan visa. Physical identity checks are conducted at Diamer and Gilgit checkposts.`;

  await prisma.listing.update({
    where: { id: "hunza-valley-attabad-2640" },
    data: {
      title: "8-Day Autumn Classic Hunza & Attabad Lake Tour",
      durationDays: 8,
      durationNights: 7,
      basePrice: 49500,
      description: desc2640,
      cancellationPolicy: CANCELLATION_SUMMARY,
      freeCancellationDays: 7,
      avgRating: 0,
      totalReviews: 0,
      amenities: [
        "Dedicated 4x4 Mountain Transport",
        "Local Mountain Guide & Tour Leader",
        "Daily Continental & Desi Breakfast",
        "Nightly Dinner Buffet & BBQ Night",
        "Standard / Deluxe Hotel Night Stays",
        "First Aid Medical Kit & Emergency Support",
        "All Fuel, Road Toll Taxes & Highway Challans Included"
      ]
    }
  });

  // Re-create departures for 2640 with exact 8-day / 7-night calendar math
  await prisma.departure.deleteMany({ where: { listingId: "hunza-valley-attabad-2640" } });
  await prisma.departure.createMany({
    data: [
      {
        listingId: "hunza-valley-attabad-2640",
        startDate: new Date("2026-11-15T00:00:00Z"),
        endDate: new Date("2026-11-22T00:00:00Z"), // 15 + 7 = 22 (8 calendar days)
        seatsTotal: 12,
        seatsLeft: 8,
        price: 49500,
        status: "AVAILABLE",
      },
      {
        listingId: "hunza-valley-attabad-2640",
        startDate: new Date("2026-11-22T00:00:00Z"),
        endDate: new Date("2026-11-29T00:00:00Z"), // 22 + 7 = 29 (8 calendar days)
        seatsTotal: 12,
        seatsLeft: 10,
        price: 49500,
        status: "AVAILABLE",
      },
      {
        listingId: "hunza-valley-attabad-2640",
        startDate: new Date("2026-11-29T00:00:00Z"),
        endDate: new Date("2026-12-06T00:00:00Z"), // 29 + 7 = Dec 6 (8 calendar days)
        seatsTotal: 12,
        seatsLeft: 12,
        price: 49500,
        status: "AVAILABLE",
      },
    ]
  });

  // Update units for 2640 with distinct tier pricing
  await prisma.listingUnit.deleteMany({ where: { listingId: "hunza-valley-attabad-2640" } });
  await prisma.listingUnit.createMany({
    data: [
      {
        id: "hunza-valley-attabad-2640-unit-perperson",
        listingId: "hunza-valley-attabad-2640",
        title: "Sharing Room",
        description: "Standard per person tour seat with twin/triple shared hotel room accommodation and complete transport inclusions.",
        maxGuests: 2,
        totalQuantity: 10,
        basePrice: 49500,
        amenities: [
          "Dedicated 4x4 Mountain Transport",
          "Local Mountain Guide & Tour Leader",
          "Daily Continental & Desi Breakfast",
          "Nightly Dinner Buffet & BBQ Night"
        ],
        photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"]
      },
      {
        id: "hunza-valley-attabad-2640-unit-couple",
        listingId: "hunza-valley-attabad-2640",
        title: "Private Room",
        description: "Dedicated private master bedroom for couple throughout the 8-day tour with all transport and hotel inclusions.",
        maxGuests: 2,
        totalQuantity: 4,
        basePrice: 104000,
        amenities: [
          "Dedicated 4x4 Mountain Transport",
          "Local Mountain Guide & Tour Leader",
          "Daily Continental & Desi Breakfast",
          "Private Master Bedroom for Couple"
        ],
        photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"]
      },
      {
        id: "hunza-valley-attabad-2640-unit-solo",
        listingId: "hunza-valley-attabad-2640",
        title: "Solo Room",
        description: "Private single room throughout the trip without sharing with other travelers.",
        maxGuests: 1,
        totalQuantity: 3,
        basePrice: 68000,
        amenities: [
          "Dedicated 4x4 Mountain Transport",
          "Local Mountain Guide & Tour Leader",
          "Daily Continental & Desi Breakfast",
          "Private Single Occupancy Room"
        ],
        photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"]
      }
    ]
  });
  console.log("Updated listing hunza-valley-attabad-2640 with distinct 8-day itinerary and tiered pricing");

  // 3. Listing 2: hunza-valley-attabad-5207 (10-Day Grand Hunza Valley, Khunjerab Pass & Nagar Tour)
  const desc5207 = `10-Day Grand Hunza Valley, Khunjerab Pass & Nagar Tour

📍 Tour Journey & Sightseeing Route:
Islamabad ➔ Abbottabad ➔ Besham ➔ Dassu ➔ Chilas ➔ Gilgit ➔ Karimabad ➔ Hoper Glacier & Nagar Valley ➔ Attabad Lake ➔ Gulmit ➔ Passu Cones ➔ Sost & Khunjerab Pass (Pak-China Border) ➔ Chilas ➔ Islamabad

🚐 Departure & Pickup Meeting Points:
1. Islamabad: Daewoo Express Terminal (G-7 / Peshawar Road) at 06:00 AM
2. Islamabad: Rawalpindi Saddar Metro Station Point at 06:30 AM
3. Hasan Abdal / Hazara Motorway Interchange at 07:15 AM

📅 Day-by-Day Itinerary:
• Day 1: Islamabad departure via Hazara Motorway to Besham night stay
• Day 2: KKH drive through Kohistan and Diamer past river gorges to Chilas
• Day 3: Indus-Gilgit confluence viewpoint, Rakaposhi viewpoint, arriving in Karimabad
• Day 4: Nagar Valley day excursion to majestic Hoper Glacier and organic mountain villages
• Day 5: Baltit & Altit Forts exploration, Karimabad cultural bazaar, and local cuisine
• Day 6: Attabad Lake boat transfer and Gulmit Old Village heritage walk
• Day 7: Upper Hunza expedition past Passu Cones to Sost and high-altitude Khunjerab Pass (4,693m)
• Day 8: Return to Karimabad with sunset viewpoint from Duikar Eagles Nest
• Day 9: Southward transit along KKH to Besham night halt
• Day 10: Final motorway journey arriving back in Islamabad

⚠️ Seasonal Mountain Route Notice:
Babusar Pass is closed during winter. This tour operates strictly via the all-weather Karakoram Highway (KKH) through Hazara Motorway, Besham, and Kohistan.

🛂 Identification & Permits:
Pakistani citizens must carry original valid CNIC. Overseas Pakistanis (NICOP) and international tourists must carry original passport and Pakistan visa. Physical identity checks are conducted at Diamer and Gilgit checkposts.`;

  await prisma.listing.update({
    where: { id: "hunza-valley-attabad-5207" },
    data: {
      title: "10-Day Grand Hunza Valley, Khunjerab Pass & Nagar Tour",
      durationDays: 10,
      durationNights: 9,
      basePrice: 58000,
      description: desc5207,
      cancellationPolicy: CANCELLATION_SUMMARY,
      freeCancellationDays: 7,
      avgRating: 0,
      totalReviews: 0,
      amenities: [
        "Dedicated 4x4 Mountain Transport",
        "Local Mountain Guide & Tour Leader",
        "Daily Continental & Desi Breakfast",
        "Standard / Deluxe Hotel Night Stays",
        "First Aid Medical Kit & Emergency Support",
        "All Fuel, Road Toll Taxes & Highway Challans Included"
      ]
    }
  });

  // Re-create departures for 5207 with exact 10-day / 9-night calendar math
  await prisma.departure.deleteMany({ where: { listingId: "hunza-valley-attabad-5207" } });
  await prisma.departure.createMany({
    data: [
      {
        listingId: "hunza-valley-attabad-5207",
        startDate: new Date("2026-12-06T00:00:00Z"),
        endDate: new Date("2026-12-15T00:00:00Z"), // 6 + 9 = 15 (10 calendar days)
        seatsTotal: 12,
        seatsLeft: 12,
        price: 58000,
        status: "AVAILABLE",
      },
    ]
  });

  // Update units for 5207 with distinct tier pricing
  await prisma.listingUnit.deleteMany({ where: { listingId: "hunza-valley-attabad-5207" } });
  await prisma.listingUnit.createMany({
    data: [
      {
        id: "hunza-valley-attabad-5207-unit-perperson",
        listingId: "hunza-valley-attabad-5207",
        title: "Sharing Room",
        description: "Standard per person tour seat with twin/triple shared hotel room accommodation and complete transport inclusions.",
        maxGuests: 2,
        totalQuantity: 10,
        basePrice: 58000,
        amenities: [
          "Dedicated 4x4 Mountain Transport",
          "Local Mountain Guide & Tour Leader",
          "Daily Continental & Desi Breakfast",
          "Standard / Deluxe Hotel Night Stays"
        ],
        photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"]
      },
      {
        id: "hunza-valley-attabad-5207-unit-couple",
        listingId: "hunza-valley-attabad-5207",
        title: "Private Room",
        description: "Dedicated private master bedroom for couple throughout the 10-day tour with all transport and hotel inclusions.",
        maxGuests: 2,
        totalQuantity: 4,
        basePrice: 122000,
        amenities: [
          "Dedicated 4x4 Mountain Transport",
          "Local Mountain Guide & Tour Leader",
          "Daily Continental & Desi Breakfast",
          "Private Master Bedroom for Couple"
        ],
        photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"]
      },
      {
        id: "hunza-valley-attabad-5207-unit-solo",
        listingId: "hunza-valley-attabad-5207",
        title: "Solo Room",
        description: "Private single room throughout the 10-day trip without sharing with other travelers.",
        maxGuests: 1,
        totalQuantity: 3,
        basePrice: 79000,
        amenities: [
          "Dedicated 4x4 Mountain Transport",
          "Local Mountain Guide & Tour Leader",
          "Daily Continental & Desi Breakfast",
          "Private Single Occupancy Room"
        ],
        photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"]
      }
    ]
  });
  console.log("Updated listing hunza-valley-attabad-5207 with distinct 10-day itinerary and tiered pricing");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
