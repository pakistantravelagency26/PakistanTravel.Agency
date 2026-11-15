import fs from 'fs';
import path from 'path';

const pages = [
  'src/app/page.tsx',
  'src/app/tours/page.tsx',
  'src/app/destinations/page.tsx',
  'src/app/destinations/[slug]/page.tsx',
  'src/app/tours/[intent]/page.tsx',
  'src/app/listing/[slug]/page.tsx',
  'src/app/blog/page.tsx',
  'src/app/blog/[slug]/page.tsx',
  'src/app/about/page.tsx',
  'src/app/about/editorial-policy/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/faq/page.tsx',
  'src/app/terms/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/partner-info/page.tsx',
  'src/app/list-your-tour/page.tsx',
  'src/app/how-booking-works/page.tsx',
  'src/app/safety-and-permits/page.tsx',
  'src/app/layout.tsx'
];

console.log('=== STRUCTURED DATA AUDIT ===\n');
for (const p of pages) {
  if (!fs.existsSync(p)) {
    console.log(`[MISSING] ${p}`);
    continue;
  }
  const content = fs.readFileSync(p, 'utf8');
  const hasLdJson = content.includes('application/ld+json');
  const hasBreadcrumb = content.includes('BreadcrumbList');
  const hasFaq = content.includes('FAQPage');
  const hasTouristDest = content.includes('TouristDestination');
  const hasTouristTrip = content.includes('TouristTrip') || content.includes('Product');
  const hasWebSite = content.includes('WebSite');
  const hasOrg = content.includes('Organization');

  console.log(`${p}:`);
  console.log(`  hasLdJson:       ${hasLdJson}`);
  console.log(`  hasBreadcrumb:   ${hasBreadcrumb}`);
  console.log(`  hasFaq:          ${hasFaq}`);
  console.log(`  hasTouristDest:  ${hasTouristDest}`);
  console.log(`  hasTouristTrip:  ${hasTouristTrip}`);
  console.log(`  hasWebSite:      ${hasWebSite}`);
  console.log(`  hasOrg:          ${hasOrg}`);
  console.log('');
}
