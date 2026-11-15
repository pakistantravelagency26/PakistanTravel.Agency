import fs from 'fs';

const filePath = 'src/app/layout.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `  const structuredDataGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",`;

const targetCRLF = `  const structuredDataGraph = {\r\n    "@context": "https://schema.org",\r\n    "@graph": [\r\n      {\r\n        "@type": "WebSite",`;

const orgSchema = `  const structuredDataGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": \`\${siteUrl}/#organization\`,
        name: "PakistanTravel",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          "@id": \`\${siteUrl}/#logo\`,
          url: \`\${siteUrl}/favicon.png\`,
          caption: "PakistanTravel",
        },
        email: siteConfig.contact.supportEmail || "support@pakistantravel.agency",
      },
      {
        "@type": "WebSite",`;

const orgSchemaCRLF = `  const structuredDataGraph = {\r\n    "@context": "https://schema.org",\r\n    "@graph": [\r\n      {\r\n        "@type": "Organization",\r\n        "@id": \`\${siteUrl}/#organization\`,\r\n        name: "PakistanTravel",\r\n        url: siteUrl,\r\n        logo: {\r\n          "@type": "ImageObject",\r\n          "@id": \`\${siteUrl}/#logo\`,\r\n          url: \`\${siteUrl}/favicon.png\`,\r\n          caption: "PakistanTravel",\r\n        },\r\n        email: siteConfig.contact.supportEmail || "support@pakistantravel.agency",\r\n      },\r\n      {\r\n        "@type": "WebSite",`;

if (content.includes(targetCRLF)) {
  content = content.replace(targetCRLF, orgSchemaCRLF);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated src/app/layout.tsx (CRLF)!');
} else if (content.includes(targetStr)) {
  content = content.replace(targetStr, orgSchema);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated src/app/layout.tsx (LF)!');
} else {
  console.error('Target not found in layout.tsx');
}
