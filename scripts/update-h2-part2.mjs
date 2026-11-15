import fs from 'fs';

// 1. Update src/services/serverListing.service.ts
let serverListingContent = fs.readFileSync('src/services/serverListing.service.ts', 'utf8');

// Never inject fallback amenities
serverListingContent = serverListingContent.replace(
  /const amenities = Array\.isArray\(l\.amenities\) && l\.amenities\.length > 0 \? l\.amenities : \[[^\]]+\];/s,
  'const amenities = Array.isArray(l.amenities) ? l.amenities.filter(Boolean) : [];'
);

// Normalize cancellation policy
serverListingContent = serverListingContent.replace(
  /const cancellationPolicy = l\.cancellationPolicy \|\| siteConfig\.cancellationPolicy\.summary;/,
  `const rawPolicy = typeof l.cancellationPolicy === "string" ? l.cancellationPolicy.trim() : "";
  const cancellationPolicy = !rawPolicy || rawPolicy.includes("until 3 days before") 
    ? siteConfig.cancellationPolicy.summary 
    : rawPolicy;`
);

// Real avgRating and totalReviews
serverListingContent = serverListingContent.replace(
  /avgRating: l\.avgRating \|\| 4\.9,\s*totalReviews: l\.totalReviews \|\| 1,/s,
  `avgRating: (l.reviews && l.reviews.length > 0)
      ? Number((l.reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / l.reviews.length).toFixed(1))
      : (l.avgRating && l.totalReviews ? Number(l.avgRating) : null),
    totalReviews: (l.reviews ? l.reviews.length : (l.totalReviews ? Number(l.totalReviews) : 0)),`
);

fs.writeFileSync('src/services/serverListing.service.ts', serverListingContent, 'utf8');
console.log('1. Updated src/services/serverListing.service.ts');

// 2. Update src/lib/antiLeakage.ts
let antiLeakageContent = fs.readFileSync('src/lib/antiLeakage.ts', 'utf8');
antiLeakageContent = antiLeakageContent.replace(
  /joinedYear: number;\s*rating: number;/s,
  `joinedYear?: number;\n  rating?: number;\n  totalReviews?: number;`
);
antiLeakageContent = antiLeakageContent.replace(
  /joinedYear: 2024,\s*rating: 4\.95,/s,
  `joinedYear: rawVendor?.createdAt ? new Date(rawVendor.createdAt).getFullYear() : undefined,
    rating: rawVendor?.avgRating !== undefined && rawVendor?.avgRating !== null ? Number(rawVendor.avgRating) : undefined,
    totalReviews: rawVendor?.totalReviews !== undefined && rawVendor?.totalReviews !== null ? Number(rawVendor.totalReviews) : undefined,`
);
fs.writeFileSync('src/lib/antiLeakage.ts', antiLeakageContent, 'utf8');
console.log('2. Updated src/lib/antiLeakage.ts');

// 3. Update src/app/api/listings/route.ts
let apiListingsContent = fs.readFileSync('src/app/api/listings/route.ts', 'utf8');
apiListingsContent = apiListingsContent.replace(
  /avgRating: 5\.0,\s*totalReviews: 1,/s,
  `avgRating: null,
      totalReviews: 0,`
);
apiListingsContent = apiListingsContent.replace(
  /cancellationPolicy: `Free cancellation until \${body\.freeCancellationDays \|\| 3} days before trip start date\. 100% refund\.`,/s,
  `cancellationPolicy: body.cancellationPolicy?.trim() || siteConfig.cancellationPolicy.summary,`
);
apiListingsContent = apiListingsContent.replace(
  /freeCancellationDays: Number\(body\.freeCancellationDays \|\| 3\),/s,
  `freeCancellationDays: Number(body.freeCancellationDays || siteConfig.cancellationPolicy.fullRefundDays),`
);
apiListingsContent = apiListingsContent.replace(
  /amenities: Array\.isArray\(body\.amenities\) && body\.amenities\.length > 0\s*\?\s*body\.amenities\s*:\s*\[[^\]]+\];/s,
  `amenities: Array.isArray(body.amenities) ? body.amenities.filter((a: any) => typeof a === "string" && a.trim().length > 0) : [],`
);
fs.writeFileSync('src/app/api/listings/route.ts', apiListingsContent, 'utf8');
console.log('3. Updated src/app/api/listings/route.ts');

// 4. Update src/components/listing/ListingDetailClient.tsx
let listingDetailClient = fs.readFileSync('src/components/listing/ListingDetailClient.tsx', 'utf8');

// Replace review rating badge with real condition
const oldRatingBadge = `<div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-brand-emerald text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {listing.avgRating}
                    </div>
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-slate-800 block">Exceptional</span>
                      <span className="text-[11px] text-slate-400">{listing.totalReviews} reviews</span>
                    </div>
                  </div>`;

const newRatingBadge = `{listing.totalReviews && listing.totalReviews > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-brand-emerald text-white flex items-center justify-center font-bold text-sm shadow-md">
                        {listing.avgRating}
                      </div>
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-bold text-slate-800 block">
                          {listing.avgRating && listing.avgRating >= 4.8 ? "Exceptional" : "Verified Rating"}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {listing.totalReviews} {listing.totalReviews === 1 ? "review" : "reviews"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-right hidden sm:block text-xs text-slate-400 font-medium">
                      No reviews yet
                    </div>
                  )}`;

if (listingDetailClient.includes(oldRatingBadge)) {
  listingDetailClient = listingDetailClient.replace(oldRatingBadge, newRatingBadge);
}

// Replace partner since and rating on host card
listingDetailClient = listingDetailClient.replace(
  /<p className="text-\[11px\] text-slate-500">\s*Partner since \{listing\.vendor\.joinedYear\} · ★ \{listing\.vendor\.rating\} Rating\s*<\/p>/s,
  `<p className="text-[11px] text-slate-500">
                    {[
                      listing.vendor.joinedYear ? \`Partner since \${listing.vendor.joinedYear}\` : null,
                      listing.vendor.rating && listing.vendor.totalReviews && listing.vendor.totalReviews > 0
                        ? \`★ \${listing.vendor.rating} (\${listing.vendor.totalReviews} \${listing.vendor.totalReviews === 1 ? "review" : "reviews"})\`
                        : null,
                    ].filter(Boolean).join(" · ") || "Independent Local Operator"}
                  </p>`
);

// Remove "Typically responds within 2 hours"
listingDetailClient = listingDetailClient.replace(
  /<div className="flex items-center gap-1\.5 text-\[11px\] text-emerald-800 bg-emerald-50 px-2\.5 py-1\.5 rounded-lg border border-emerald-200\/60 font-semibold">\s*<Clock className="w-3\.5 h-3\.5 text-emerald-600 shrink-0" \/>\s*<span>Typically responds within 2 hours<\/span>\s*<\/div>/s,
  ''
);

// If reviews list is empty, show clean empty state
listingDetailClient = listingDetailClient.replace(
  /{\/\* Review Cards \*\/}\s*<div className="space-y-4">\s*\{reviewsList\.map\(\(rev\) => \(/s,
  `{/* Review Cards */}
              {reviewsList.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                  No guest reviews posted yet. Completed travelers can leave verified reviews after their trip.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviewsList.map((rev) => (`
);
// close the ternary in reviewsList
listingDetailClient = listingDetailClient.replace(
  /\)\)}\s*<\/div>\s*<\/div>\s*<\/div>\s*{\/\* Right Sticky Booking Box/s,
  `))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sticky Booking Box`
);

fs.writeFileSync('src/components/listing/ListingDetailClient.tsx', listingDetailClient, 'utf8');
console.log('4. Updated src/components/listing/ListingDetailClient.tsx');

// 5. Update src/app/page.tsx (Meta description and banner)
let pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');
pageContent = pageContent.replace(
  /departures from Islamabad, Lahore, and Karachi to Hunza, Skardu, and Swat\./g,
  'scheduled departures from Islamabad to Hunza, Skardu, and Swat.'
);
// Make announcement banner dynamic:
pageContent = pageContent.replace(
  /<span>\{announcement\.text\}<\/span>/,
  `<span>{listings.length > 0 ? \`Autumn & Early Winter 2026 Season Booking Open across \${Array.from(new Set(listings.map((l: any) => l.destinationName || l.city))).join(", ")}!\` : (announcement.text || "Explore Northern Pakistan Guided Tour Packages & Scheduled Departures")}</span>`
);
fs.writeFileSync('src/app/page.tsx', pageContent, 'utf8');
console.log('5. Updated src/app/page.tsx');

// 6. Update src/app/tours/page.tsx
let toursPageContent = fs.readFileSync('src/app/tours/page.tsx', 'utf8');
// Replace "with direct verified operator rates"
toursPageContent = toursPageContent.replace(
  /with direct verified operator rates/g,
  'with direct independent local operator rates'
);

// Replace empty state text:
toursPageContent = toursPageContent.replace(
  /Independent tour operators are currently scheduling upcoming spring and summer departures\. You can request a custom tailored departure using the form below\./g,
  'Independent local tour operators are currently preparing upcoming seasonal departures. You can request a custom tailored departure using the form below.'
);

// Ensure ToursPage uses getActiveDbListings from serverListing.service.ts
if (!toursPageContent.includes('getActiveDbListings')) {
  toursPageContent = toursPageContent.replace(
    'import { formatDbListing } from "@/services/serverListing.service";',
    'import { getActiveDbListings, formatDbListing } from "@/services/serverListing.service";'
  );
  toursPageContent = toursPageContent.replace(
    /let listings: any\[\] = \[\];\s*try \{\s*const rawListings = await prisma\.listing\.findMany\(\{[^}]+\}\);\s*listings = rawListings\.map\(formatDbListing\);\s*\} catch \(err\) \{\s*console\.error\("Failed to load tour listings:", err\);\s*\}/s,
    `let listings: any[] = [];
  try {
    listings = await getActiveDbListings();
  } catch (err) {
    console.error("Failed to load tour listings:", err);
  }`
  );
}
fs.writeFileSync('src/app/tours/page.tsx', toursPageContent, 'utf8');
console.log('6. Updated src/app/tours/page.tsx');
