import fs from 'fs';

// 1. Fix serverListing.service.ts
let service = fs.readFileSync('src/services/serverListing.service.ts', 'utf8');
const oldWhere = `  try {
    dbListing = await prisma.listing.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },`;

const newWhere = `  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
  const whereClause = isUuid ? { OR: [{ id: idOrSlug }, { slug: idOrSlug }] } : { slug: idOrSlug };

  try {
    dbListing = await prisma.listing.findFirst({
      where: whereClause,`;

service = service.replace(oldWhere, newWhere);
fs.writeFileSync('src/services/serverListing.service.ts', service);
console.log('Fixed UUID check in serverListing.service.ts');

// 2. Fix listing 2640 title in listing/[slug]/page.tsx
let listingPage = fs.readFileSync('src/app/listing/[slug]/page.tsx', 'utf8');
listingPage = listingPage.replace(
  'pageTitle = "Hunza & Attabad 8-Day Tour from Islamabad";',
  'pageTitle = "Hunza & Attabad 8-Day Tour";'
);
fs.writeFileSync('src/app/listing/[slug]/page.tsx', listingPage);
console.log('Updated listing 2640 title in listing/[slug]/page.tsx');
