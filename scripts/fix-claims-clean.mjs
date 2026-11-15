import fs from 'fs';

let apiListings = fs.readFileSync('src/app/api/listings/route.ts', 'utf8');
apiListings = apiListings.replace(
  /amenities:\s*Array\.isArray\(body\.amenities\)[\s\S]*?description:\s*enrichedDescription,/,
  'amenities: Array.isArray(body.amenities) ? body.amenities.filter((a: any) => typeof a === "string" && a.trim().length > 0) : [],\r\n      description: enrichedDescription,'
);
fs.writeFileSync('src/app/api/listings/route.ts', apiListings, 'utf8');

console.log('Replaced amenities block successfully');
