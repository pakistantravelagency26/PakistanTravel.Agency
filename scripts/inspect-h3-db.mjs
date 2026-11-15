import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const listings = await prisma.listing.findMany({
    include: {
      departures: true,
      units: true,
      vendor: true
    }
  });

  for (const l of listings) {
    console.log(`\n=== LISTING: ${l.id} (${l.slug}) ===`);
    console.log(`Title: ${l.title}`);
    console.log(`DurationDays: ${l.durationDays}, DurationNights: ${l.durationNights}`);
    console.log(`BasePrice: ${l.basePrice}`);
    console.log(`Description: ${l.description.slice(0, 150)}...`);
    console.log(`Vendor: ${l.vendor?.businessName} (${l.vendor?.id})`);
    console.log(`Departures (${l.departures.length}):`);
    l.departures.forEach(d => console.log(`  Start: ${d.startDate.toISOString().split('T')[0]}, End: ${d.endDate.toISOString().split('T')[0]}, Seats: ${d.seatsLeft}/${d.seatsTotal}`));
    console.log(`Units (${l.units.length}):`);
    l.units.forEach(u => console.log(`  Title: ${u.title}, Price: ${u.basePrice}, Guests: ${u.maxGuests}, Bed: ${u.bedType}`));
  }
}

main().finally(() => prisma.$disconnect());
