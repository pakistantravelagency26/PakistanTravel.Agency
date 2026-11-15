import fs from 'fs';

let content = fs.readFileSync('src/app/destinations/[slug]/page.tsx', 'utf8');

const target = `  if (!dest) {
    return {
      title: "Destination Not Found | Pakistan Travel Agency",
      description: "Compare and book guided northern Pakistan tour packages across Hunza, Skardu, Swat, and Kumrat.",
    };
  }`;

const replacement = `  if (!dest) {
    notFound();
  }`;

content = content.replace(target, replacement);
fs.writeFileSync('src/app/destinations/[slug]/page.tsx', content);
console.log('Updated destinations/[slug]/page.tsx');
