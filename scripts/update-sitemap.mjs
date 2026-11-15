import fs from 'fs';

const filePath = 'src/app/sitemap.ts';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `    {
      url: \`\${baseUrl}/terms\`,`;
const targetCRLF = `    {\r\n      url: \`\${baseUrl}/terms\`,`;

const addition = `    {
      url: \`\${baseUrl}/how-booking-works\`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: \`\${baseUrl}/safety-and-permits\`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
`;

const additionCRLF = `    {\r\n      url: \`\${baseUrl}/how-booking-works\`,\r\n      changeFrequency: "monthly",\r\n      priority: 0.7,\r\n    },\r\n    {\r\n      url: \`\${baseUrl}/safety-and-permits\`,\r\n      changeFrequency: "monthly",\r\n      priority: 0.7,\r\n    },\r\n`;

if (content.includes(targetCRLF)) {
  content = content.replace(targetCRLF, additionCRLF + targetCRLF);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated src/app/sitemap.ts (CRLF)!');
} else if (content.includes(targetStr)) {
  content = content.replace(targetStr, addition + targetStr);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated src/app/sitemap.ts (LF)!');
} else {
  console.error('Target not found in sitemap.ts');
}
