const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('[init-db] Checking Neon PostgreSQL database initialization...');

  // 1. Super Admin: emraanirshad88@gmail.com / Emra@91173259
  const adminEmail = 'emraanirshad88@gmail.com';
  const adminHash = '$2a$10$o4qbwcfotztX2tCS5qKhxu2Z1fX0DXgfM.80hqQtaGiRVfUAGKKDS';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'Emraan Irshad',
        email: adminEmail,
        phone: '03009117325',
        passwordHash: adminHash,
        role: 'ADMIN',
      },
    });
    console.log('[init-db] Created Super Admin:', adminEmail);
  } else {
    console.log('[init-db] Super Admin already exists:', adminEmail);
  }

  // Also ensure alias admin exists
  const existingAgencyAdmin = await prisma.user.findUnique({ where: { email: 'admin@pakistantravel.agency' } });
  if (!existingAgencyAdmin) {
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@pakistantravel.agency',
        phone: '03000000001',
        passwordHash: adminHash,
        role: 'ADMIN',
      },
    }).catch(() => {});
  }

  // 2. Categories
  const categories = [
    { name: 'Tours & Expeditions', slug: 'tours', type: 'TOUR' },
    { name: 'Hotels & Resorts', slug: 'hotels', type: 'HOTEL' },
    { name: 'Activities & Treks', slug: 'activities', type: 'ACTIVITY' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug, type: cat.type },
    });
  }
  console.log('[init-db] Categories verified.');

  // 3. Destinations
  const destinations = [
    {
      name: 'Hunza Valley',
      slug: 'hunza',
      province: 'Gilgit-Baltistan',
      description: 'Picturesque valley framed by Rakaposhi, Ultar Sar, and turquoise Attabad Lake.',
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200&auto=format&fit=crop&q=80',
      isFeatured: true,
    },
    {
      name: 'Skardu & Deosai',
      slug: 'skardu',
      province: 'Gilgit-Baltistan',
      description: 'Gateway to K2, Shigar Fort, Shangrila Resort, and the high-altitude Deosai Plains.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      isFeatured: true,
    },
    {
      name: 'Swat Valley & Kalam',
      slug: 'swat',
      province: 'Khyber Pakhtunkhwa',
      description: 'The Switzerland of the East with lush pine valleys, Kalam riverbanks, and Malam Jabba ski slopes.',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
      isFeatured: true,
    },
    {
      name: 'Neelum Valley',
      slug: 'neelum',
      province: 'Azad Kashmir',
      description: 'Verdant river valleys, alpine meadows at Arang Kel, and pristine Ratti Gali Lake.',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
      isFeatured: true,
    },
    {
      name: 'Gwadar & Makran',
      slug: 'gwadar',
      province: 'Balochistan',
      description: 'Pristine Arabian Sea coastline, Hammerhead peninsula, and Princess of Hope rock formations.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      isFeatured: false,
    },
    {
      name: 'Kumrat Valley & Dir',
      slug: 'kumrat',
      province: 'Khyber Pakhtunkhwa',
      description: 'Pristine alpine pine forests, roaring riverbanks, Jahaz Banda meadows, and turquoise Katora glacial lake.',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
      isFeatured: true,
    },
  ];

  for (const d of destinations) {
    await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {},
      create: d,
    });
  }
  console.log('[init-db] Destinations verified.');

  // 4. Vendors: ONLY seed initial vendors if vendor table is completely empty AND explicitly requested
  const vendorCount = await prisma.vendor.count();
  if (vendorCount > 0 || process.env.SEED_SAMPLE_DATA !== 'true') {
    console.log(`[init-db] Skipping vendor auto-seeding. Current vendors: ${vendorCount}. (Set SEED_SAMPLE_DATA=true to seed initial vendors).`);
    return;
  }

  console.log('[init-db] Vendor table is empty. Seeding initial 4 verified partner agencies...');

  const initialVendors = [
    {
      id: 'v-karakoram-expeditions',
      name: 'Karakoram Expeditions Partner',
      email: 'karakoram@tours.pk',
      phone: '03001118687',
      businessName: 'Karakoram Expeditions & Northern Tours',
      city: 'Skardu',
      license: 'DTS-GB-2024-89',
      details: {
        phone1: '03001118687',
        phone2: '03214445566',
        phone3: '03457778899',
        loginId: 'karakoram_tours',
        passwordPlain: 'karakoram123',
        email: 'karakoram@tours.pk',
      },
      tours: [
        {
          id: 'skardu-7-day-tour',
          slug: 'skardu-7-day-tour',
          title: '7-Day Skardu, Shigar, Khaplu & Deosai Plains Expedition',
          destinationSlug: 'skardu',
          basePrice: 65000,
          city: 'Skardu',
          address: 'Skardu Airport / Islamabad Pickup',
          photos: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
          ],
          amenities: ['Dedicated 4x4 Prado with Mountain Driver', '6 Nights Luxury Hotel Stays', 'Daily Buffet Breakfast & Dinner'],
          description: 'Experience the crown jewel of Gilgit-Baltistan with PakistanTravel.Agency on our luxury 7-day expedition.',
        },
        {
          id: 'kumrat-valley-katora-lake-tour',
          slug: 'kumrat-valley-katora-lake-tour',
          title: '4-Day Kumrat Valley, Jahaz Banda Meadows & Katora Lake Trek',
          destinationSlug: 'swat',
          basePrice: 42000,
          city: 'Upper Dir',
          address: 'Islamabad Pickup / Thal Kumrat',
          photos: [
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=1200&auto=format&fit=crop&q=80',
          ],
          amenities: ['4x4 Mountain Jeep from Thal to Kumrat', 'Glamping Tents at Jahaz Banda', 'Guided Trekking Escort'],
          description: 'Venture deep into the pristine alpine forests of Upper Dir to the turquoise glacial basin of Katora Lake.',
        },
      ],
    },
    {
      id: 'v-hunza-adventures',
      name: 'Hunza Valley Adventures Partner',
      email: 'hunza@adventures.pk',
      phone: '03002223344',
      businessName: 'Hunza Valley Adventures & Treks',
      city: 'Hunza',
      license: 'DTS-GB-2023-14',
      details: {
        phone1: '03002223344',
        phone2: '03335556677',
        phone3: '',
        loginId: 'hunza_treks',
        passwordPlain: 'hunza123',
        email: 'hunza@adventures.pk',
      },
      tours: [
        {
          id: 'hunza-5-day-tour',
          slug: 'hunza-5-day-tour',
          title: '5-Day Hunza Valley, Attabad Lake & Khunjerab Pass Tour',
          destinationSlug: 'hunza',
          basePrice: 48000,
          city: 'Hunza',
          address: 'Karimabad, Hunza Valley',
          photos: [
            'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
          ],
          amenities: ['Executive Coaster / Grand Cabin Transport', '4 Nights Hotel Stay in Karimabad', 'Attabad Lake Boating Included'],
          description: 'A classic journey across the Karakoram Highway to Karimabad, Passu Cones, and the world highest border crossing.',
        },
        {
          id: 'neelum-valley-ratti-gali-tour',
          slug: 'neelum-valley-ratti-gali-tour',
          title: '3-Day Neelum Valley, Sharda & Ratti Gali Lake Tour',
          destinationSlug: 'neelum',
          basePrice: 34000,
          city: 'Muzaffarabad',
          address: 'Islamabad / Rawalpindi Pickup',
          photos: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
          ],
          amenities: ['Comfortable AC Transport from Islamabad', 'River View Cottage Stays in Kutton & Keran', '4x4 Jeep Ride to Ratti Gali Basecamp'],
          description: 'Explore the verdant slopes of Azad Kashmir, ancient Buddhist university ruins in Sharda, and majestic Ratti Gali Lake.',
        },
      ],
    },
    {
      id: 'v-swat-alpine',
      name: 'Swat Alpine Travels Partner',
      email: 'swat@alpine.pk',
      phone: '03003334455',
      businessName: 'Swat & Kalam Alpine Travels',
      city: 'Swat',
      license: 'DTS-KPK-2024-51',
      details: {
        phone1: '03003334455',
        phone2: '03129998877',
        phone3: '',
        loginId: 'swat_alpine',
        passwordPlain: 'swat123',
        email: 'swat@alpine.pk',
      },
      tours: [
        {
          id: 'swat-kalam-4-day-tour',
          slug: 'swat-kalam-4-day-tour',
          title: '4-Day Swat Valley, Malam Jabba Ski Resort & Kalam Tour',
          destinationSlug: 'swat',
          basePrice: 38000,
          city: 'Swat',
          address: 'Malam Jabba / Kalam Valley',
          photos: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
          ],
          amenities: ['Dedicated Luxury Saloon Vehicle', 'Resort Stays in Malam Jabba & Kalam', 'Chairlift Passes & Sightseeing'],
          description: 'A serene family escape to the Switzerland of the East with pine forests, rushing rivers, and chairlift rides.',
        },
        {
          id: 'gwadar-makran-coastal-tour',
          slug: 'gwadar-makran-coastal-tour',
          title: '4-Day Gwadar, Ormara Beach & Kund Malir Coastal Highway Tour',
          destinationSlug: 'gwadar',
          basePrice: 45000,
          city: 'Gwadar',
          address: 'Karachi Pickup / Coastal Highway',
          photos: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200&auto=format&fit=crop&q=80',
          ],
          amenities: ['AC Luxury Transport along Makran Highway', 'Beachfront Stays & Seafood Dining', 'Boat Cruise to Gwadar Port'],
          description: 'A breathtaking coastal adventure across the Hingol National Park, Princess of Hope, and pristine golden beaches of Ormara.',
        },
      ],
    },
    {
      id: 'v-serena-hotels',
      name: 'Serena Hotels Partner',
      email: 'serena@luxury.pk',
      phone: '03004445566',
      businessName: 'Serena Hotels & Heritage Lodges',
      city: 'Islamabad',
      license: 'DTS-FED-2022-01',
      details: {
        phone1: '03004445566',
        phone2: '03451112233',
        phone3: '',
        loginId: 'serena_lodges',
        passwordPlain: 'serena123',
        email: 'serena@luxury.pk',
      },
      tours: [
        {
          id: 'serena-hunza-luxury-lodge',
          slug: 'serena-hunza-luxury-lodge',
          title: 'Hunza Serena Inn - Deluxe Mountain View Rooms',
          destinationSlug: 'hunza',
          basePrice: 32000,
          city: 'Karimabad, Hunza',
          address: 'Karimabad, Hunza Valley',
          photos: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80',
          ],
          amenities: ['Panoramic Ultar & Rakaposhi Views', 'Organic Local Apricot Breakfast', '24/7 Concierge & Cultural Evenings'],
          description: 'Perched in the heart of ancient Karimabad, offering unmatched five-star hospitality with direct views of the peaks.',
        },
        {
          id: 'skardu-luxury-honeymoon-package',
          slug: 'skardu-luxury-honeymoon-package',
          title: '6-Day Skardu Luxury Honeymoon & Serena Palace Retreat',
          destinationSlug: 'skardu',
          basePrice: 135000,
          city: 'Skardu',
          address: 'Shigar Fort & Serena Khaplu Palace',
          photos: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80',
          ],
          amenities: ['Stay in 400-Year-Old Restored Royal Fort Palaces', 'Dedicated Prado Transport with Fuel', 'Private Candlelight Dinners'],
          description: 'The ultimate royal honeymoon experience staying in authentic UNESCO-awarded heritage palaces of the Baltistan Rajas.',
        },
      ],
    },
  ];

  for (const v of initialVendors) {
    const user = await prisma.user.upsert({
      where: { email: v.email },
      update: {},
      create: {
        name: v.name,
        email: v.email,
        phone: v.phone,
        passwordHash: bcrypt.hashSync(v.details.passwordPlain, 10),
        role: 'VENDOR',
      },
    });

    const vendor = await prisma.vendor.upsert({
      where: { id: v.id },
      update: {},
      create: {
        id: v.id,
        userId: user.id,
        businessName: v.businessName,
        city: v.city,
        cnicOrTaxNumber: v.license,
        phone: v.phone,
        status: 'VERIFIED',
        commissionRate: 12.0,
        bankDetails: v.details,
      },
    });

    const toursCategory = await prisma.category.findUnique({ where: { slug: 'tours' } });

    for (const t of v.tours) {
      const destination = await prisma.destination.findUnique({ where: { slug: t.destinationSlug } });
      await prisma.listing.upsert({
        where: { id: t.id },
        update: {},
        create: {
          id: t.id,
          vendorId: vendor.id,
          title: t.title,
          slug: t.slug,
          type: 'TOUR',
          status: 'PUBLISHED',
          destinationId: destination?.id || (await prisma.destination.findFirst()).id,
          categoryId: toursCategory?.id || (await prisma.category.findFirst()).id,
          address: t.address,
          city: t.city,
          photos: t.photos,
          amenities: t.amenities,
          cancellationPolicy: 'Full refund up to 7 days before tour departure date.',
          freeCancellationDays: 7,
          basePrice: t.basePrice,
          avgRating: 4.95,
          totalReviews: 24,
          isFeatured: true,
          description: t.description,
        },
      });
    }
  }

  console.log('[init-db] Initial vendors & tours seeded successfully.');
}

main()
  .catch((e) => {
    console.error('[init-db] Error:', e);
    // Don't fail the build if DB is momentarily unreachable
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
