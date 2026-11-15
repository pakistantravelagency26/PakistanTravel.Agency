import fs from 'fs';

let content = fs.readFileSync('src/app/listing/[slug]/page.tsx', 'utf8');
const target = `  if (!listing) {
    notFound();
  }`;

const replacement = `  if (!listing) {
    return {
      title: "Tour Not Found",
      description: "The requested tour package is not available or has been removed from PakistanTravel.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }`;

const normContent = content.replace(/\r\n/g, '\n');
const normTarget = target.replace(/\r\n/g, '\n');

if (normContent.includes(normTarget)) {
  const updated = normContent.replace(normTarget, replacement);
  fs.writeFileSync('src/app/listing/[slug]/page.tsx', updated);
  console.log('Successfully updated listing notFound metadata!');
} else {
  console.error('Target not found in listing/[slug]/page.tsx');
}
