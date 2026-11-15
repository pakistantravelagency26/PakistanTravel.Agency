import fs from 'fs';

const filePath = 'src/app/list-your-tour/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `export default function ListYourTourPage() {
  const commissionRate = siteConfig.marketplace.commissionPercent;

  return (
    <div className="bg-slate-50 min-h-screen">`;

const targetCRLF = `export default function ListYourTourPage() {\r\n  const commissionRate = siteConfig.marketplace.commissionPercent;\r\n\r\n  return (\r\n    <div className="bg-slate-50 min-h-screen">`;

const replacement = `export default function ListYourTourPage() {
  const commissionRate = siteConfig.marketplace.commissionPercent;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "List Your Tour",
        item: \`\${siteUrl}/list-your-tour\`,
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />`;

const replacementCRLF = `export default function ListYourTourPage() {\r\n  const commissionRate = siteConfig.marketplace.commissionPercent;\r\n\r\n  const breadcrumbJsonLd = {\r\n    "@context": "https://schema.org",\r\n    "@type": "BreadcrumbList",\r\n    itemListElement: [\r\n      {\r\n        "@type": "ListItem",\r\n        position: 1,\r\n        name: "Home",\r\n        item: siteUrl,\r\n      },\r\n      {\r\n        "@type": "ListItem",\r\n        position: 2,\r\n        name: "List Your Tour",\r\n        item: \`\${siteUrl}/list-your-tour\`,\r\n      },\r\n    ],\r\n  };\r\n\r\n  return (\r\n    <div className="bg-slate-50 min-h-screen">\r\n      <script\r\n        type="application/ld+json"\r\n        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}\r\n      />`;

if (content.includes(targetCRLF)) {
  content = content.replace(targetCRLF, replacementCRLF);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated list-your-tour/page.tsx (CRLF)!');
} else if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated list-your-tour/page.tsx (LF)!');
} else {
  console.error('Target not found in list-your-tour/page.tsx');
}
