import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
  const allListings = await prisma.listing.findMany({
    select: { id: true, title: true, status: true, type: true }
  });
  console.log("Total listings in DB:", allListings.length);
  const testListings = allListings.filter(l => 
    l.title.includes("Test") || 
    l.title.includes("Autumn Adventure 179") || 
    l.title.includes("E2E") ||
    /\d{13}/.test(l.title)
  );
  console.log("Found test listings:", testListings.length);
  testListings.forEach(l => {
    console.log(`- [${l.id}] "${l.title}" | Status: ${l.status}`);
  });
  await prisma.$disconnect();
}

check().catch(console.error);
