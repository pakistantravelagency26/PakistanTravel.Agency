import fs from 'fs';

// 1. src/app/page.tsx
let home = fs.readFileSync('src/app/page.tsx', 'utf8');
const oldHomeDesc = 'Book northern Pakistan tours from independent local operators with scheduled departures from Islamabad to Hunza, Skardu, and Swat.';
const newHomeDesc = 'Book northern Pakistan tours from independent local operators with scheduled departures from Islamabad to Hunza, Skardu, and Swat at direct rates.';
home = home.replaceAll(oldHomeDesc, newHomeDesc);
fs.writeFileSync('src/app/page.tsx', home);
console.log('Updated src/app/page.tsx');

// 2. src/app/destinations/page.tsx
let dest = fs.readFileSync('src/app/destinations/page.tsx', 'utf8');
const oldDestDesc = 'Explore top tourist destinations in northern Pakistan including Hunza, Skardu, Swat, Kumrat, and Murree with seasonal travel advice.';
const newDestDesc = 'Explore top tourist destinations in northern Pakistan including Hunza, Skardu, Swat, Kumrat, and Murree with essential seasonal mountain road advice.';
dest = dest.replaceAll(oldDestDesc, newDestDesc);
fs.writeFileSync('src/app/destinations/page.tsx', dest);
console.log('Updated src/app/destinations/page.tsx');

// 3. src/app/tours/page.tsx
let tours = fs.readFileSync('src/app/tours/page.tsx', 'utf8');
const oldToursDesc = 'Compare guided northern Pakistan tour packages and scheduled departures across Hunza, Skardu, Swat, and Kumrat with direct verified operator bookings.';
const newToursDesc = 'Compare guided northern Pakistan tour packages and scheduled departures across Hunza, Skardu, Swat, and Kumrat with direct independent operator bookings.';
tours = tours.replaceAll(oldToursDesc, newToursDesc);
fs.writeFileSync('src/app/tours/page.tsx', tours);
console.log('Updated src/app/tours/page.tsx');
