import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const urduRegex = /[\u0600-\u06FF]/;

async function checkDb() {
  let urduFound = 0;
  const listings = await prisma.listing.findMany();
  for (const l of listings) {
    for (const [k, v] of Object.entries(l)) {
      if (typeof v === 'string' && urduRegex.test(v)) {
        console.log('Urdu in listing', l.id, k, v);
        urduFound++;
      }
    }
  }
  const units = await prisma.listingUnit.findMany();
  for (const u of units) {
    for (const [k, v] of Object.entries(u)) {
      if (typeof v === 'string' && urduRegex.test(v)) {
        console.log('Urdu in unit', u.id, k, v);
        urduFound++;
      }
    }
  }
  const vendors = await prisma.vendor.findMany();
  for (const v of vendors) {
    for (const [k, val] of Object.entries(v)) {
      if (typeof val === 'string' && urduRegex.test(val)) {
        console.log('Urdu in vendor', v.id, k, val);
        urduFound++;
      }
    }
  }
  console.log('TOTAL URDU IN DB:', urduFound);
}

checkDb().finally(() => prisma.$disconnect());
