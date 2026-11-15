import fs from 'fs';

let service = fs.readFileSync('src/services/serverListing.service.ts', 'utf8');

const oldBlock = `export const getDbListingBySlugOrId = cache(async (idOrSlug: string): Promise<ListingData | null> => {
  let dbListing;
  try {
    dbListing = await prisma.listing.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },`;

const newBlock = `export const getDbListingBySlugOrId = cache(async (idOrSlug: string): Promise<ListingData | null> => {
  let dbListing;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
  const whereClause = isUuid ? { OR: [{ id: idOrSlug }, { slug: idOrSlug }] } : { slug: idOrSlug };

  try {
    dbListing = await prisma.listing.findFirst({
      where: whereClause,`;

const normService = service.replace(/\r\n/g, '\n');
const normOld = oldBlock.replace(/\r\n/g, '\n');
const normNew = newBlock.replace(/\r\n/g, '\n');

if (normService.includes(normOld)) {
  const updated = normService.replace(normOld, normNew);
  fs.writeFileSync('src/services/serverListing.service.ts', updated);
  console.log('SUCCESSFULLY REPLACED in src/services/serverListing.service.ts!');
} else {
  console.error('FAILED TO FIND MATCH IN src/services/serverListing.service.ts!');
}
