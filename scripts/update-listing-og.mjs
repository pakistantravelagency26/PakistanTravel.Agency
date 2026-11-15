import fs from 'fs';

const file = 'src/app/listing/[slug]/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const target = `  const canonicalUrl = \`\${siteUrl}/listing/\${listing.slug}\`;
  const mainPhoto = listing.photos[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200";`;

const replacement = `  const canonicalUrl = \`\${siteUrl}/listing/\${listing.slug}\`;
  const ogImageUrl = \`\${siteUrl}/og?title=\${encodeURIComponent(listing.title)}&category=TOUR%20PACKAGE&subtitle=\${encodeURIComponent(\`\${listing.durationDays} Days / \${listing.durationDays - 1} Nights • \${listing.city}\`)}\`;`;

// Normalize line endings for replacement
const cNorm = c.replace(/\r\n/g, '\n');
const targetNorm = target.replace(/\r\n/g, '\n');
const replNorm = replacement.replace(/\r\n/g, '\n');

if (cNorm.includes(targetNorm)) {
  let updated = cNorm.replace(targetNorm, replNorm);
  updated = updated.replace('url: mainPhoto,', 'url: ogImageUrl,');
  updated = updated.replace('images: [mainPhoto],', 'images: [ogImageUrl],');
  fs.writeFileSync(file, updated);
  console.log('Successfully updated listing openGraph image via script!');
} else {
  console.error('Target not found in listing/[slug]/page.tsx');
}
