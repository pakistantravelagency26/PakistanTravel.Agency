import fs from 'fs';

let content = fs.readFileSync('src/app/tours/[intent]/page.tsx', 'utf8');

const target = `  if (!intent) {
    return {
      title: "Tour Packages Not Found | PakistanTravel",
      description: "Compare and book guided northern Pakistan tour packages across Hunza, Skardu, Swat, and Kumrat.",
    };
  }`;

const replacement = `  if (!intent) {
    notFound();
  }`;

content = content.replace(target, replacement);
fs.writeFileSync('src/app/tours/[intent]/page.tsx', content);
console.log('Updated tours/[intent]/page.tsx');
