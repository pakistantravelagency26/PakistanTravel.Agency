import fs from 'fs';

const filePath = 'src/config/siteSettings.constants.ts';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `      { id: "c3-7", label: "Travel Blog & Insights", url: "/blog" },`;
const targetCRLF = `      { id: "c3-7", label: "Travel Blog & Insights", url: "/blog" },\r\n`;

const addition = `      { id: "c3-8", label: "How Booking Works", url: "/how-booking-works" },\n      { id: "c3-9", label: "Safety & Permits", url: "/safety-and-permits" },\n      { id: "c3-10", label: "Editorial Policy", url: "/about/editorial-policy" },\n`;
const additionCRLF = `      { id: "c3-8", label: "How Booking Works", url: "/how-booking-works" },\r\n      { id: "c3-9", label: "Safety & Permits", url: "/safety-and-permits" },\r\n      { id: "c3-10", label: "Editorial Policy", url: "/about/editorial-policy" },\r\n`;

if (content.includes(targetCRLF)) {
  content = content.replace(targetCRLF, targetCRLF + additionCRLF);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated col3Links in constants (CRLF)!');
} else if (content.includes(targetStr)) {
  content = content.replace(targetStr, targetStr + '\n' + addition);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated col3Links in constants (LF)!');
} else {
  console.error('Target not found in siteSettings.constants.ts');
}
