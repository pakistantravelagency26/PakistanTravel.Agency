import fs from 'fs';

let content = fs.readFileSync('src/app/api/listings/route.ts', 'utf8');

// Add siteConfig to import
content = content.replace(
  'import { COMMISSION_PERCENT } from "@/config/site";',
  'import { COMMISSION_PERCENT, siteConfig } from "@/config/site";'
);

// Split lines
const lines = content.split(/\r?\n/);
let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('avgRating: 5.0,')) {
    startIdx = i;
  }
  if (startIdx !== -1 && lines[i].includes('singleSupplement: singleSupplementCalc,')) {
    endIdx = i;
    break;
  }
}

console.log('Replacing lines', startIdx, 'to', endIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const replacementLines = [
    '      avgRating: 0,',
    '      totalReviews: 0,',
    '      isFeatured: body.isFeatured ?? true,',
    '      freeCancellation: true,',
    '      freeCancellationDays: Number(body.freeCancellationDays || siteConfig.cancellationPolicy.fullRefundDays),',
    '      badge: "Guided Tour Package",',
    '      photos: photosList,',
    '      amenities: Array.isArray(body.amenities) ? body.amenities.filter((a: any) => typeof a === "string" && a.trim().length > 0) : [],',
    '      description: enrichedDescription,',
    '      cancellationPolicy: (body as any).cancellationPolicy?.trim() || siteConfig.cancellationPolicy.summary,',
    '      singleSupplement: singleSupplementCalc,',
  ];
  lines.splice(startIdx, endIdx - startIdx + 1, ...replacementLines);
  fs.writeFileSync('src/app/api/listings/route.ts', lines.join('\r\n'), 'utf8');
  console.log('Updated src/app/api/listings/route.ts cleanly');
}
