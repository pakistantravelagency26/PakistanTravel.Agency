import { PrismaClient, Role, VendorStatus, ListingType, ListingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PakistanTravel.agency database...");

  // Clean existing
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.pricingRule.deleteMany();
  await prisma.listingUnit.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.category.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const hashedVendorPassword = await bcrypt.hash("vendor123", 10);
  const hashedCustomerPassword = await bcrypt.hash("customer123", 10);

  // 1. Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@pakistantravel.agency",
      phone: "03000000001",
      passwordHash: hashedAdminPassword,
      role: Role.ADMIN,
    },
  });

  const vendorUser = await prisma.user.create({
    data: {
      name: "Hunza Serena Hospitality",
      email: "vendor@serena.pk",
      phone: "03000000002",
      passwordHash: hashedVendorPassword,
      role: Role.VENDOR,
    },
  });

  const vendorProfile = await prisma.vendor.create({
    data: {
      userId: vendorUser.id,
      businessName: "Serena Hotels & Resorts North",
      cnicOrTaxNumber: "37405-1234567-1",
      phone: "03000000002",
      city: "Hunza",
      status: VendorStatus.VERIFIED,
      commissionRate: 10.0,
      bankDetails: {
        bankName: "Meezan Bank Limited",
        accountTitle: "Hunza Serena Hospitality Ltd",
        iban: "PK36MEZN0001234567890123",
      },
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: "Usman Tariq",
      email: "customer@pakistantravel.agency",
      phone: "03000000003",
      passwordHash: hashedCustomerPassword,
      role: Role.CUSTOMER,
    },
  });

  // 2. Create Destinations
  const hunza = await prisma.destination.create({
    data: {
      name: "Hunza Valley",
      slug: "hunza",
      province: "Gilgit-Baltistan",
      description: "Land of legends, Rakaposhi views, Attabad Lake and ancient Baltit and Altit forts.",
      image: "https://images.unsplash.com/photo-1588661793444-c71597813a83?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
    },
  });

  const skardu = await prisma.destination.create({
    data: {
      name: "Skardu",
      slug: "skardu",
      province: "Gilgit-Baltistan",
      description: "Gateway to K2, Shangrila Lake, Upper Kachura and the high-altitude Deosai Plains.",
      image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
    },
  });

  const swat = await prisma.destination.create({
    data: {
      name: "Swat Valley",
      slug: "swat",
      province: "KPK",
      description: "The Switzerland of the East with pine forests, Kalam, and Mahodand Lake.",
      image: "https://images.unsplash.com/photo-1596761011406-8d18d4052973?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
    },
  });

  // 3. Create Categories
  const catHotels = await prisma.category.create({
    data: {
      name: "Hotels & Resorts",
      slug: "hotels-resorts",
      type: ListingType.HOTEL,
      icon: "Building2",
    },
  });

  const catTours = await prisma.category.create({
    data: {
      name: "Tour Packages",
      slug: "tours",
      type: ListingType.TOUR,
      icon: "Compass",
    },
  });

  // 4. Create Sample Listing
  const listing1 = await prisma.listing.create({
    data: {
      vendorId: vendorProfile.id,
      title: "Hunza Serena Inn & Heritage Lodge",
      slug: "hunza-serena-inn",
      description: "Experience world-class luxury surrounded by the majestic snow-capped Karakoram peaks. Overlooking the Karimabad valley with modern amenities, organic dining, and traditional warmth.",
      type: ListingType.HOTEL,
      status: ListingStatus.PUBLISHED,
      destinationId: hunza.id,
      categoryId: catHotels.id,
      address: "Zero Point, Karimabad, Hunza Valley",
      city: "Hunza",
      latitude: 36.3257,
      longitude: 74.6617,
      photos: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
      ],
      amenities: ["WiFi", "Heater", "Free Breakfast", "Mountain View", "24/7 Hot Water", "Power Backup Generator"],
      cancellationPolicy: "Free cancellation up to 48 hours before check-in.",
      freeCancellationDays: 2,
      basePrice: 32000,
      avgRating: 4.9,
      totalReviews: 84,
      isFeatured: true,
    },
  });

  // Listing Units (Rooms)
  const unit1 = await prisma.listingUnit.create({
    data: {
      listingId: listing1.id,
      title: "Deluxe Mountain View Room",
      description: "Spacious king bed with panoramic view of Rakaposhi and Ultar Sar peaks.",
      maxGuests: 2,
      totalQuantity: 5,
      basePrice: 32000,
      photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80"],
      amenities: ["King Bed", "Balcony", "Tea/Coffee Maker", "Attached Bath"],
    },
  });

  console.log("Database seeded successfully with Users, Destinations, Categories and Listings!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
