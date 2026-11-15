import fs from 'fs';

// 1. Update src/services/listing.service.ts
let listingService = fs.readFileSync('src/services/listing.service.ts', 'utf8');
listingService = listingService.replace(/avgRating\?:\s*number\s*\|\s*null;/, 'avgRating: number;');
fs.writeFileSync('src/services/listing.service.ts', listingService, 'utf8');

// 2. Update src/app/api/listings/route.ts
let apiListings = fs.readFileSync('src/app/api/listings/route.ts', 'utf8');
apiListings = apiListings.replace(
  'import { COMMISSION_PERCENT } from "@/config/site";',
  'import { COMMISSION_PERCENT, siteConfig } from "@/config/site";'
);
fs.writeFileSync('src/app/api/listings/route.ts', apiListings, 'utf8');

// 3. Update src/services/serverListing.service.ts
let serverListing = fs.readFileSync('src/services/serverListing.service.ts', 'utf8');
serverListing = serverListing.replace(
  /: \(l\.avgRating && l\.totalReviews \? Number\(l\.avgRating\) : null\),/g,
  ': (l.avgRating && l.totalReviews ? Number(l.avgRating) : 0),'
);
fs.writeFileSync('src/services/serverListing.service.ts', serverListing, 'utf8');

console.log('Fixed imports and avgRating number type');
