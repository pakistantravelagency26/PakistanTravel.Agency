import fs from 'fs';

// 1. Update src/app/partner-hub/listings/new/page.tsx
let partnerNew = fs.readFileSync('src/app/partner-hub/listings/new/page.tsx', 'utf8');

// Fix departure end date calculations
partnerNew = partnerNew.replace(
  /const end = new Date\(start\.getTime\(\) \+ \(Number\(formData\.durationDays\) \|\| 5\) \* 24 \* 60 \* 60 \* 1000\);/g,
  'const safeDays = Math.max(1, Number(formData.durationDays) || 5);\n        const end = new Date(start.getTime() + (safeDays - 1) * 24 * 60 * 60 * 1000);'
);

// Fix nights clamping
partnerNew = partnerNew.replace(
  /const nights = Math\.max\(0, Number\(e\.target\.value\)\);/g,
  'const maxNights = Math.max(0, formData.durationDays - 1);\n                    const nights = Math.min(maxNights, Math.max(0, Number(e.target.value)));'
);

// Add tier warning banner if not already present
if (!partnerNew.includes('Pricing tiers are identical')) {
  const tierWarningSnippet = `
            {/* Warning if pricing tiers are identical */}
            {(formData.basePrice > 0 && (formData.couplePrice === formData.basePrice || formData.soloPrice === formData.basePrice)) && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Pricing Alert:</strong> Two or more package tiers have identical pricing (PKR {formData.basePrice.toLocaleString()}). Each tier (Sharing Room, Dedicated Private Room for Couple, and Solo Single Room) should have its own distinct price to reflect differing room occupancy.
                </span>
              </div>
            )}
`;
  partnerNew = partnerNew.replace(
    '{/* 4. Group & Family Discount Tiers',
    tierWarningSnippet + '\n            {/* 4. Group & Family Discount Tiers'
  );
}

fs.writeFileSync('src/app/partner-hub/listings/new/page.tsx', partnerNew, 'utf8');
console.log('1. Updated src/app/partner-hub/listings/new/page.tsx');

// 2. Update src/app/api/listings/route.ts
let apiListings = fs.readFileSync('src/app/api/listings/route.ts', 'utf8');

// Validate duration on server
apiListings = apiListings.replace(
  /duration: body\.duration \|\| "5 Days \/ 4 Nights",/,
  `durationDays: Math.max(1, Number(body.durationDays || 5)),
      durationNights: Math.max(0, Math.min((Math.max(1, Number(body.durationDays || 5)) - 1), Number(body.durationNights ?? (Math.max(1, Number(body.durationDays || 5)) - 1)))),
      duration: \`\${Math.max(1, Number(body.durationDays || 5))} Days / \${Math.max(0, Math.min((Math.max(1, Number(body.durationDays || 5)) - 1), Number(body.durationNights ?? (Math.max(1, Number(body.durationDays || 5)) - 1))))} Nights\`,`
);

// Fix DB listing creation duration
apiListings = apiListings.replace(
  /durationDays: Number\(body\.durationDays\) \|\| 5,\s*durationNights: body\.durationNights !== undefined \? Number\(body\.durationNights\) : 4,/s,
  `durationDays: Math.max(1, Number(body.durationDays) || 5),
          durationNights: Math.max(0, Math.min((Math.max(1, Number(body.durationDays) || 5)) - 1, Number(body.durationNights ?? ((Math.max(1, Number(body.durationDays) || 5)) - 1)))),`
);

// Fix departure end date in default fallback
apiListings = apiListings.replace(
  /const e = dep\.endDate \? new Date\(dep\.endDate\) : new Date\(validStart\.getTime\(\) \+ \(Number\(body\.durationDays\) \|\| 5\) \* 86400000\);/g,
  'const safeDays = Math.max(1, Number(body.durationDays) || 5);\n          const e = dep.endDate ? new Date(dep.endDate) : new Date(validStart.getTime() + (safeDays - 1) * 86400000);'
);
apiListings = apiListings.replace(
  /const validEnd = isNaN\(e\.getTime\(\)\) \? new Date\(validStart\.getTime\(\) \+ \(Number\(body\.durationDays\) \|\| 5\) \* 86400000\) : e;/g,
  'const validEnd = isNaN(e.getTime()) ? new Date(validStart.getTime() + (safeDays - 1) * 86400000) : e;'
);

fs.writeFileSync('src/app/api/listings/route.ts', apiListings, 'utf8');
console.log('2. Updated src/app/api/listings/route.ts');
