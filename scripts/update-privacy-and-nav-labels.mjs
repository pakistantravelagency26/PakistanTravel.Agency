import fs from "fs";

// 1. Update privacy page links
let privacyContent = fs.readFileSync("src/app/privacy/page.tsx", "utf8");
privacyContent = privacyContent.replace(
  '<Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline mb-3">',
  '<Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline mb-3" aria-label="Return to PakistanTravel home page">'
);
privacyContent = privacyContent.replace(
  '<a href={siteUrl} className="text-sky-600 underline font-medium">{siteUrl}</a>',
  '<a href={siteUrl} className="text-sky-600 underline font-medium" aria-label="Visit PakistanTravel home page">{siteUrl}</a>'
);
privacyContent = privacyContent.replace(
  '<a href={`mailto:${supportEmail}`} className="text-sky-700 underline font-semibold">{supportEmail}</a>',
  '<a href={`mailto:${supportEmail}`} className="text-sky-700 underline font-semibold" aria-label="Email PakistanTravel Data Protection Officer">{supportEmail}</a>'
);
fs.writeFileSync("src/app/privacy/page.tsx", privacyContent);

// 2. Update navbar logo
let navContent = fs.readFileSync("src/components/layout/Navbar.tsx", "utf8");
navContent = navContent.replace(
  '<Link href="/" className="flex items-center gap-3 group">',
  '<Link href="/" className="flex items-center gap-3 group" aria-label="PakistanTravel Homepage">'
);
fs.writeFileSync("src/components/layout/Navbar.tsx", navContent);

// 3. Update chat widget listing link
let chatContent = fs.readFileSync("src/components/chat/SupportChatWidget.tsx", "utf8");
chatContent = chatContent.replace(
  'href={`/listings/${parsed.listing.slug}`}',
  'href={`/listing/${parsed.listing.slug}`}'
);
fs.writeFileSync("src/components/chat/SupportChatWidget.tsx", chatContent);

console.log("Updated privacy labels, navbar logo, and chat widget link");
