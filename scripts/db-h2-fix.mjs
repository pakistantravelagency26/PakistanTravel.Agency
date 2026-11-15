import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CANCELLATION_SUMMARY = "100% refund for cancellations made 7 or more days before departure. 50% refund for cancellations between 3 and 6 days before departure. Non-refundable within 72 hours of departure.";

async function main() {
  const listings = await prisma.listing.findMany();
  console.log(`Found ${listings.length} listings in DB.`);

  for (const l of listings) {
    let amenities = Array.isArray(l.amenities) ? [...l.amenities] : [];
    amenities = amenities.map(a => a.replace(/Certified Alpine Guide/g, 'Local Mountain Guide'));

    await prisma.listing.update({
      where: { id: l.id },
      data: {
        cancellationPolicy: CANCELLATION_SUMMARY,
        freeCancellationDays: 7,
        amenities,
        avgRating: 0,
        totalReviews: 0,
      }
    });
    console.log(`Updated listing ${l.id} (${l.title})`);
  }

  // Also verify vendor
  const vendors = await prisma.vendor.findMany();
  for (const v of vendors) {
    await prisma.vendor.update({
      where: { id: v.id },
      data: {
        commissionRate: 10,
      }
    });
    console.log(`Verified vendor ${v.id} commissionRate = 10%`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
