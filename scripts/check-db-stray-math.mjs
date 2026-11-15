import { prisma } from "../src/lib/prisma.ts";

async function checkDb() {
  console.log("Checking DB for stray math syntax and hotel/rental terms...");

  // 1. SiteSettings
  const settings = await prisma.siteSetting.findMany();
  console.log(`Found ${settings.length} site settings rows.`);
  for (const s of settings) {
    const str = JSON.stringify(s.value);
    if (/\\ge\b|\\le\b|\$\\ge|\$\\le|\$[^$]*\\ge|\$[^$]*\\le|\$[^$]*\+[^$]*\$|\$\ge|\$\le/.test(str)) {
      console.log(`SiteSetting ${s.key} has stray math!`, str);
    }
    if (/luxury hotels & resorts|mountain jeeps & rentals|list your tour \/ hotel/i.test(str)) {
      console.log(`SiteSetting ${s.key} has hotel/rental phrases!`, str.slice(0, 200));
    }
  }

  // 2. Listings
  const listings = await prisma.listing.findMany({
    select: { id: true, title: true, description: true, cancellationPolicy: true, amenities: true }
  });
  console.log(`Found ${listings.length} listings in DB.`);
  for (const l of listings) {
    const text = `${l.title} ${l.description} ${l.cancellationPolicy} ${JSON.stringify(l.amenities)}`;
    if (/\\ge\b|\\le\b|\$\\ge|\$\\le|\$[^$]*\\ge|\$[^$]*\\le|\$[^$]*\+[^$]*\$|\$\ge|\$\le/.test(text)) {
      console.log(`Listing ${l.id} (${l.title}) has stray math!`);
    }
  }

  console.log("DB check complete.");
  await prisma.$disconnect();
}

checkDb().catch(console.error);
