import fs from 'fs';

const files = [
  'src/app/blog/[slug]/page.tsx',
  'src/app/tours/[intent]/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('export const dynamicParams = false;')) {
    content = content.replace(
      'export const revalidate = 60;',
      'export const revalidate = 60;\nexport const dynamicParams = false;'
    );
    fs.writeFileSync(file, content);
    console.log('Added dynamicParams = false to:', file);
  } else {
    console.log('Already had dynamicParams = false:', file);
  }
}
