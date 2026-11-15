import fs from 'fs';

// 1. Update src/config/site.ts
let siteConfigContent = fs.readFileSync('src/config/site.ts', 'utf8');
if (!siteConfigContent.includes('termsLastUpdated: string;')) {
  siteConfigContent = siteConfigContent.replace(
    /tagline:\s*string;/,
    'tagline: string;\n  termsLastUpdated: string;'
  );
}
siteConfigContent = siteConfigContent.replace(
  /commissionExplanation:\s*"[^"]+"/,
  'commissionExplanation: "Transparent flat 10% platform commission is deducted from operator disbursements upon tour departure. Operators receive their guaranteed net demanded rate with zero monthly listing or software fees."'
);
fs.writeFileSync('src/config/site.ts', siteConfigContent, 'utf8');
console.log('1. Updated src/config/site.ts');

// 2. Update src/app/terms/page.tsx
let termsContent = fs.readFileSync('src/app/terms/page.tsx', 'utf8');
termsContent = termsContent.replace(
  /Last updated: Autumn 2026/g,
  'Last updated: November 15, 2026'
);
termsContent = termsContent.replace(
  /registered local tour operators/g,
  'independent local tour operators'
);
// Replace Section 3 commission text
termsContent = termsContent.replace(
  /A customized platform commission agreed upon per tour package \(percentage, fixed amount, or waived\) is applied to the gross booking value upon completed reservations\./g,
  'A flat 10% platform commission is deducted from the gross booking value upon completed reservations. Travelers pay the direct operator listing price with zero platform booking fees.'
);

// Add Sections 8 to 12 if not already present
if (!termsContent.includes('8. User Accounts &amp; Security')) {
  const sectionsToAdd = `
          {/* Section 8 */}
          {/* DRAFT - NEEDS LEGAL REVIEW BY PAKISTANI COUNSEL */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>8. User Accounts &amp; Security</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                Travelers and operators creating accounts must provide accurate, current, and complete registration credentials. You are solely responsible for maintaining the confidentiality of your account credentials and password. Any unauthorized access or suspected security compromise must be reported immediately to our support desk.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          {/* DRAFT - NEEDS LEGAL REVIEW BY PAKISTANI COUNSEL */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>9. Prohibited Activities &amp; Content</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                Users agree not to: (a) publish fraudulent, misleading, or unauthorized tour listings; (b) reverse engineer, scrape, or extract platform content or source code; (c) post defamatory, abusive, or culturally insensitive remarks; (d) facilitate unlicensed or unlawful activities in violation of Pakistani law; or (e) attempt to bypass platform communication safeguards.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          {/* DRAFT - NEEDS LEGAL REVIEW BY PAKISTANI COUNSEL */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Handshake className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>10. Dispute Resolution &amp; Escalation</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                In the event of a dispute, grievance, or service dissatisfaction arising from a booking, travelers and operators agree to first submit an official support ticket to the platform support desk ({supportEmail || "support@pakistantravel.agency"}). Both parties agree to participate in good-faith administrative mediation and dispute resolution through the platform support team before seeking external legal or formal administrative remedies.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          {/* DRAFT - NEEDS LEGAL REVIEW BY PAKISTANI COUNSEL */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600 shrink-0" />
              <span>11. Governing Law &amp; Jurisdiction</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                These Terms of Service and any contractual or non-contractual disputes arising hereunder shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. The competent courts situated in Islamabad, Pakistan, shall have exclusive jurisdiction over any unresolved disputes subject to the initial mediation process.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          {/* DRAFT - NEEDS LEGAL REVIEW BY PAKISTANI COUNSEL */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>12. Modifications to Terms</span>
            </h2>
            <div className="space-y-2 text-slate-700">
              <p>
                We reserve the right to revise or amend these Terms of Service at any time to reflect operational, legal, or regulatory updates. Continued use of {siteConfig.name} following the publication of revised terms constitutes full acceptance of the updated terms.
              </p>
            </div>
          </section>
`;
  termsContent = termsContent.replace(
    '/* Support Information Box */',
    sectionsToAdd + '\n          /* Support Information Box */'
  );
}
fs.writeFileSync('src/app/terms/page.tsx', termsContent, 'utf8');
console.log('2. Updated src/app/terms/page.tsx');

// 3. Update src/app/list-your-tour/page.tsx
let listTourContent = fs.readFileSync('src/app/list-your-tour/page.tsx', 'utf8');
listTourContent = listTourContent.replace(
  /<h3 className="font-bold text-slate-900 text-sm">Flexible &amp; Transparent Commission<\/h3>/g,
  '<h3 className="font-bold text-slate-900 text-sm">Flat 10% Platform Commission</h3>'
);
listTourContent = listTourContent.replace(
  /Customized <span className="text-lg font-medium text-emerald-200">Tour Commission<\/span>/g,
  '10% <span className="text-lg font-medium text-emerald-200">Platform Commission</span>'
);
listTourContent = listTourContent.replace(
  /No monthly subscription, no setup costs, no hidden software fees\. Transparent platform commission is agreed per tour package when approved\. You always receive your full demanded operator price\. Travelers pay zero booking fees\./g,
  'No monthly subscription, no setup costs, no hidden software fees. A transparent 10% platform commission is deducted from operator disbursements upon tour departure. You always receive your guaranteed demanded operator price. Travelers pay zero booking fees.'
);
fs.writeFileSync('src/app/list-your-tour/page.tsx', listTourContent, 'utf8');
console.log('3. Updated src/app/list-your-tour/page.tsx');

// 4. Update src/components/home/TourMarketplaceSection.tsx & src/config/siteSettings.constants.ts (Remove unverifiable claims)
let settingsConst = fs.readFileSync('src/config/siteSettings.constants.ts', 'utf8');
settingsConst = settingsConst.replace(
  /badgeText: "Verified Tour Operator Marketplace",/g,
  'badgeText: "Northern Pakistan Tour Marketplace",'
);
settingsConst = settingsConst.replace(
  /curated by mountain travel writers/g,
  'curated by the PakistanTravel Editorial Team'
);
fs.writeFileSync('src/config/siteSettings.constants.ts', settingsConst, 'utf8');

let tourMarketplaceSec = fs.readFileSync('src/components/home/TourMarketplaceSection.tsx', 'utf8');
tourMarketplaceSec = tourMarketplaceSec.replace(
  /"Verified Tour Operator Marketplace"/g,
  '"Northern Pakistan Tour Marketplace"'
);
fs.writeFileSync('src/components/home/TourMarketplaceSection.tsx', tourMarketplaceSec, 'utf8');
console.log('4. Updated badgeText in constants and TourMarketplaceSection');

// 5. Update voucher route & checkout
let voucherRoute = fs.readFileSync('src/app/api/bookings/[id]/voucher/route.ts', 'utf8');
voucherRoute = voucherRoute.replace(
  /Verified Tour Operator Marketplace/g,
  'Independent Tour Operator Marketplace'
);
fs.writeFileSync('src/app/api/bookings/[id]/voucher/route.ts', voucherRoute, 'utf8');

let checkoutPage = fs.readFileSync('src/app/checkout/[id]/page.tsx', 'utf8');
checkoutPage = checkoutPage.replace(
  /<span>Guaranteed Departure:<\/span>/g,
  '<span>Scheduled Departure:</span>'
);
fs.writeFileSync('src/app/checkout/[id]/page.tsx', checkoutPage, 'utf8');
console.log('5. Updated voucher & checkout');

// 6. Update blogData.ts author roles
let blogData = fs.readFileSync('src/data/blogData.ts', 'utf8');
blogData = blogData.replace(
  /role: "Regional Destination Specialists"/g,
  'role: "PakistanTravel Editorial Team"'
);
fs.writeFileSync('src/data/blogData.ts', blogData, 'utf8');
console.log('6. Updated blogData roles');

// 7. Update tourIntentsData.ts & destinations
let tourIntents = fs.readFileSync('src/data/tourIntentsData.ts', 'utf8');
tourIntents = tourIntents.replace(
  /hosted by verified independent tour operators/g,
  'hosted by independent local tour operators'
);
fs.writeFileSync('src/data/tourIntentsData.ts', tourIntents, 'utf8');

let destSlugPage = fs.readFileSync('src/app/destinations/[slug]/page.tsx', 'utf8');
destSlugPage = destSlugPage.replace(
  /{\/\* Section 5: Real Verified Database Listings \*\/}/g,
  '{/* Section 5: Available Tour Packages */}'
);
fs.writeFileSync('src/app/destinations/[slug]/page.tsx', destSlugPage, 'utf8');

let listingSlugPage = fs.readFileSync('src/app/listing/[slug]/page.tsx', 'utf8');
listingSlugPage = listingSlugPage.replace(
  /with digital tour vouchers and verified local guidance/g,
  'with digital tour vouchers and local operator guidance'
);
fs.writeFileSync('src/app/listing/[slug]/page.tsx', listingSlugPage, 'utf8');
console.log('7. Updated tour intents, destinations, listing metadata');
