const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('[seed] Seeding Phase 1 verified data with exact duration and destination mapping...');

  // 1. Ensure Kumrat Destination exists
  const kumratDest = await prisma.destination.upsert({
    where: { slug: 'kumrat' },
    update: {
      name: 'Kumrat Valley & Dir',
      province: 'Khyber Pakhtunkhwa',
      description: 'Pristine alpine pine forests, roaring riverbanks, Jahaz Banda meadows, and turquoise Katora glacial lake.',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
      isFeatured: true,
    },
    create: {
      name: 'Kumrat Valley & Dir',
      slug: 'kumrat',
      province: 'Khyber Pakhtunkhwa',
      description: 'Pristine alpine pine forests, roaring riverbanks, Jahaz Banda meadows, and turquoise Katora glacial lake.',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
      isFeatured: true,
    },
  });

  const skarduDest = await prisma.destination.findUnique({ where: { slug: 'skardu' } });
  const hunzaDest = await prisma.destination.findUnique({ where: { slug: 'hunza' } });
  const tourCategory = await prisma.category.findUnique({ where: { slug: 'tours' } });
  const hotelCategory = await prisma.category.findUnique({ where: { slug: 'hotels' } });

  // 2. Ensure Karakoram Expeditions Vendor
  const user1 = await prisma.user.upsert({
    where: { email: 'karakoram@tours.pk' },
    update: {},
    create: {
      name: 'Karakoram Expeditions Partner',
      email: 'karakoram@tours.pk',
      phone: '03001118687',
      passwordHash: bcrypt.hashSync(process.env.SEED_VENDOR_PASSWORD || require("crypto").randomBytes(16).toString("hex"), 12),
      role: 'VENDOR',
    },
  });

  const vendorKarakoram = await prisma.vendor.upsert({
    where: { id: 'v-karakoram-expeditions' },
    update: { status: 'VERIFIED' },
    create: {
      id: 'v-karakoram-expeditions',
      userId: user1.id,
      businessName: 'Karakoram Expeditions & Northern Tours',
      city: 'Skardu',
      cnicOrTaxNumber: 'DTS-GB-2024-89',
      phone: '03001118687',
      status: 'VERIFIED',
      commissionRate: 12.0,
    },
  });

  // 3. Ensure Serena Hotels Vendor
  const user2 = await prisma.user.upsert({
    where: { email: 'serena@luxury.pk' },
    update: {},
    create: {
      name: 'Serena Hotels Partner',
      email: 'serena@luxury.pk',
      phone: '03004445566',
      passwordHash: bcrypt.hashSync(process.env.SEED_VENDOR_PASSWORD || require("crypto").randomBytes(16).toString("hex"), 12),
      role: 'VENDOR',
    },
  });

  const vendorSerena = await prisma.vendor.upsert({
    where: { id: 'v-serena-hotels' },
    update: { status: 'VERIFIED' },
    create: {
      id: 'v-serena-hotels',
      userId: user2.id,
      businessName: 'Serena Hotels & Heritage Lodges',
      city: 'Karimabad, Hunza',
      cnicOrTaxNumber: 'DTS-FED-2022-01',
      phone: '03004445566',
      status: 'VERIFIED',
      commissionRate: 12.0,
    },
  });

  // 4. Listing 1: 7-Day Skardu Expedition
  // Duration: 7 Days / 6 Nights (single source of truth)
  const skarduListing = await prisma.listing.upsert({
    where: { slug: 'skardu-7-day-tour' },
    update: {
      title: '7-Day Skardu, Shigar, Khaplu & Deosai Plains Expedition',
      destinationId: skarduDest.id,
      categoryId: tourCategory.id,
      vendorId: vendorKarakoram.id,
      type: 'TOUR',
      status: 'PUBLISHED',
      durationDays: 7,
      durationNights: 6,
      cancellationPolicy: 'Free cancellation up to 7 days before tour departure date. 100% refund.',
      freeCancellationDays: 7,
      basePrice: 65000,
      vendorPrice: 57200,
      commissionRate: 12.0,
      amenities: [
        'Dedicated 4x4 Mountain Transport Included',
        '6 Nights Luxury Hotel Accommodations',
        'Daily Buffet Breakfast & Dinner',
        'Certified English/Urdu Mountain Guide',
        'Entry Permits to Deosai National Park',
        'First Aid & Emergency Oxygen Onboard'
      ],
      description: 'Experience the crown jewel of Gilgit-Baltistan on this comprehensive 7-Day / 6-Night expedition covering Shangrila Lake, upper Kachura, Shigar Fort, Khaplu Royal Palace, and the roof of the world at Deosai Plains.',
    },
    create: {
      id: 'skardu-7-day-tour',
      slug: 'skardu-7-day-tour',
      title: '7-Day Skardu, Shigar, Khaplu & Deosai Plains Expedition',
      destinationId: skarduDest.id,
      categoryId: tourCategory.id,
      vendorId: vendorKarakoram.id,
      type: 'TOUR',
      status: 'PUBLISHED',
      city: 'Skardu',
      address: 'Skardu Airport / Islamabad Pickup',
      photos: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
      ],
      durationDays: 7,
      durationNights: 6,
      cancellationPolicy: 'Free cancellation up to 7 days before tour departure date. 100% refund.',
      freeCancellationDays: 7,
      basePrice: 65000,
      vendorPrice: 57200,
      commissionRate: 12.0,
      avgRating: 4.95,
      totalReviews: 24,
      isFeatured: true,
      amenities: [
        'Dedicated 4x4 Mountain Transport Included',
        '6 Nights Luxury Hotel Accommodations',
        'Daily Buffet Breakfast & Dinner',
        'Certified English/Urdu Mountain Guide',
        'Entry Permits to Deosai National Park',
        'First Aid & Emergency Oxygen Onboard'
      ],
      description: 'Experience the crown jewel of Gilgit-Baltistan on this comprehensive 7-Day / 6-Night expedition covering Shangrila Lake, upper Kachura, Shigar Fort, Khaplu Royal Palace, and the roof of the world at Deosai Plains.',
    },
  });

  // Skardu Unit
  await prisma.listingUnit.deleteMany({ where: { listingId: skarduListing.id } });
  await prisma.listingUnit.create({
    data: {
      id: 'skardu-7-day-unit-twin',
      listingId: skarduListing.id,
      title: 'Standard Twin-Sharing Package (7 Days / 6 Nights)',
      description: 'Price per traveler on twin-sharing hotel room basis with dedicated 4x4 mountain transport and meals included',
      maxGuests: 2,
      totalQuantity: 12,
      basePrice: 65000,
      photos: skarduListing.photos,
      amenities: ['Twin Sharing Hotel Room', '4x4 Prado Mountain Transport', 'All Park Entry Fees'],
    },
  });

  // 5. Listing 2: 4-Day Kumrat Valley Trek
  // Destination: kumrat (proper Kumrat/Dir destination)
  // Duration: 4 Days / 3 Nights
  const kumratListing = await prisma.listing.upsert({
    where: { slug: 'kumrat-valley-katora-lake-tour' },
    update: {
      title: '4-Day Kumrat Valley, Jahaz Banda Meadows & Katora Lake Trek',
      destinationId: kumratDest.id,
      categoryId: tourCategory.id,
      vendorId: vendorKarakoram.id,
      type: 'TOUR',
      status: 'PUBLISHED',
      durationDays: 4,
      durationNights: 3,
      cancellationPolicy: 'Free cancellation up to 5 days before tour departure date. 100% refund.',
      freeCancellationDays: 5,
      basePrice: 42000,
      vendorPrice: 36960,
      commissionRate: 12.0,
      amenities: [
        'Dedicated 4x4 Jeep from Thal to Kumrat',
        'Glamping Tents & Wooden Cottages at Jahaz Banda',
        'Guided Alpine Trek to Katora Lake',
        'Daily Bonfire & Outdoor Barbecue',
        'First Aid & Trekking Pole Gear'
      ],
      description: 'Venture deep into the pristine alpine forests of Upper Dir. Camp under star-studded skies at Jahaz Banda meadows and hike up to the crystal-clear glacial waters of Katora Lake.',
    },
    create: {
      id: 'kumrat-valley-katora-lake-tour',
      slug: 'kumrat-valley-katora-lake-tour',
      title: '4-Day Kumrat Valley, Jahaz Banda Meadows & Katora Lake Trek',
      destinationId: kumratDest.id,
      categoryId: tourCategory.id,
      vendorId: vendorKarakoram.id,
      type: 'TOUR',
      status: 'PUBLISHED',
      city: 'Upper Dir',
      address: 'Islamabad Pickup / Thal Kumrat',
      photos: [
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=1200&auto=format&fit=crop&q=80',
      ],
      durationDays: 4,
      durationNights: 3,
      cancellationPolicy: 'Free cancellation up to 5 days before tour departure date. 100% refund.',
      freeCancellationDays: 5,
      basePrice: 42000,
      vendorPrice: 36960,
      commissionRate: 12.0,
      avgRating: 4.88,
      totalReviews: 18,
      isFeatured: true,
      amenities: [
        'Dedicated 4x4 Jeep from Thal to Kumrat',
        'Glamping Tents & Wooden Cottages at Jahaz Banda',
        'Guided Alpine Trek to Katora Lake',
        'Daily Bonfire & Outdoor Barbecue',
        'First Aid & Trekking Pole Gear'
      ],
      description: 'Venture deep into the pristine alpine forests of Upper Dir. Camp under star-studded skies at Jahaz Banda meadows and hike up to the crystal-clear glacial waters of Katora Lake.',
    },
  });

  // Kumrat Unit
  await prisma.listingUnit.deleteMany({ where: { listingId: kumratListing.id } });
  await prisma.listingUnit.create({
    data: {
      id: 'kumrat-4-day-unit-standard',
      listingId: kumratListing.id,
      title: 'Standard Guided Trekking Package (4 Days / 3 Nights)',
      description: 'Package per person including Islamabad return transport, Thal jeep, camping gear, and guided trek',
      maxGuests: 2,
      totalQuantity: 10,
      basePrice: 42000,
      photos: kumratListing.photos,
      amenities: ['Cottage / Tent Accommodation', 'Jeep Transport Included', 'Guided Trek to Katora Lake'],
    },
  });

  // 6. Listing 3: Serena Hunza Luxury Inn (HOTEL!)
  // Type: HOTEL (Solves item 3: Homepage filter says "2 Hotels" but no hotels are shown)
  const hotelListing = await prisma.listing.upsert({
    where: { slug: 'serena-hunza-luxury-lodge' },
    update: {
      title: 'Hunza Serena Inn - Deluxe Mountain View Rooms',
      destinationId: hunzaDest.id,
      categoryId: hotelCategory.id,
      vendorId: vendorSerena.id,
      type: 'HOTEL',
      status: 'PUBLISHED',
      durationDays: 1,
      durationNights: 1,
      cancellationPolicy: 'Free cancellation up to 3 days before check-in date. 100% refund.',
      freeCancellationDays: 3,
      basePrice: 32000,
      vendorPrice: 28160,
      commissionRate: 12.0,
      amenities: [
        'Direct Ultar & Rakaposhi Mountain Views',
        'Organic Mountain Breakfast Included',
        '24/7 Power Backup & Central Heating',
        'High-Speed Wi-Fi in All Rooms',
        'Complimentary Airport Shuttle from Gilgit'
      ],
      description: 'Perched in the heart of ancient Karimabad, offering unmatched five-star hospitality with direct panoramic views of Ultar Sar and the Hunza River valley.',
    },
    create: {
      id: 'serena-hunza-luxury-lodge',
      slug: 'serena-hunza-luxury-lodge',
      title: 'Hunza Serena Inn - Deluxe Mountain View Rooms',
      destinationId: hunzaDest.id,
      categoryId: hotelCategory.id,
      vendorId: vendorSerena.id,
      type: 'HOTEL',
      status: 'PUBLISHED',
      city: 'Karimabad, Hunza',
      address: 'Zero Point, Karimabad, Hunza Valley',
      photos: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80',
      ],
      durationDays: 1,
      durationNights: 1,
      cancellationPolicy: 'Free cancellation up to 3 days before check-in date. 100% refund.',
      freeCancellationDays: 3,
      basePrice: 32000,
      vendorPrice: 28160,
      commissionRate: 12.0,
      avgRating: 4.96,
      totalReviews: 32,
      isFeatured: true,
      amenities: [
        'Direct Ultar & Rakaposhi Mountain Views',
        'Organic Mountain Breakfast Included',
        '24/7 Power Backup & Central Heating',
        'High-Speed Wi-Fi in All Rooms',
        'Complimentary Airport Shuttle from Gilgit'
      ],
      description: 'Perched in the heart of ancient Karimabad, offering unmatched five-star hospitality with direct panoramic views of Ultar Sar and the Hunza River valley.',
    },
  });

  // Hotel Unit
  await prisma.listingUnit.deleteMany({ where: { listingId: hotelListing.id } });
  await prisma.listingUnit.create({
    data: {
      id: 'serena-hunza-unit-deluxe',
      listingId: hotelListing.id,
      title: 'Deluxe Mountain View Room',
      description: 'Spacious 35sqm room with handcrafted Kashmiri wood furnishings, private balcony facing Rakaposhi, and marble ensuite bathroom',
      maxGuests: 2,
      totalQuantity: 8,
      basePrice: 32000,
      photos: hotelListing.photos,
      amenities: ['King Bed', 'Private Balcony', 'Central Heating', 'Complimentary Breakfast'],
    },
  });

  console.log('[seed] Phase 1 seed complete! 3 verified authentic listings (Skardu Tour, Kumrat Tour, Hunza Hotel) saved with single source of truth.');
}

main()
  .catch((e) => {
    console.error('[seed] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
