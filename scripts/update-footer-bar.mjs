import fs from 'fs';

const filePath = 'src/components/layout/Footer.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `<Link href="/about" className="hover:text-white transition">About Us</Link>`;
const replacement = `<Link href="/how-booking-works" className="hover:text-white transition">How It Works</Link>\n            <Link href="/safety-and-permits" className="hover:text-white transition">Safety & Permits</Link>\n            <Link href="/about" className="hover:text-white transition">About Us</Link>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated Footer bottom bar links!');
} else {
  console.error('Target not found in Footer.tsx');
}
