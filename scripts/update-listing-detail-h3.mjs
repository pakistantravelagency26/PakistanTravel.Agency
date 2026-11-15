import fs from 'fs';

let content = fs.readFileSync('src/components/listing/ListingDetailClient.tsx', 'utf8');

// Replace pricing calculation state using regex
content = content.replace(
  /\/\/ Pricing Calculation[\s\S]*?const balanceDue = totalPrice - depositAmount;/,
  `const isPrivateUnit = selectedUnit?.title?.toLowerCase().includes("private") || selectedUnit?.title?.toLowerCase().includes("couple");
  const isSoloUnit = selectedUnit?.title?.toLowerCase().includes("solo") || selectedUnit?.title?.toLowerCase().includes("single");

  // Pricing Calculation
  let baseTravelerPrice = 0;
  let groupDiscountApplied = 0;

  if (isTour) {
    if (isPrivateUnit) {
      // 1 private room covers up to 2 travelers
      const rooms = Math.ceil(selectedQuantity / 2);
      baseTravelerPrice = unitPrice * rooms;
    } else if (isSoloUnit) {
      baseTravelerPrice = unitPrice * selectedQuantity;
    } else {
      // Sharing room: apply group discount for 5+ travelers
      const standardRate = unitPrice;
      const groupRate = unitPrice >= 49000 ? 42000 : Math.round(unitPrice * 0.85);
      if (selectedQuantity >= 5 && standardRate > groupRate) {
        baseTravelerPrice = groupRate * selectedQuantity;
        groupDiscountApplied = (standardRate - groupRate) * selectedQuantity;
      } else {
        baseTravelerPrice = standardRate * selectedQuantity;
      }
    }
  } else {
    baseTravelerPrice = unitPrice * nightsCount * selectedQuantity;
  }

  const totalPrice = baseTravelerPrice;
  const depositPercent = listing.depositPercent || 25;
  const depositAmount = Math.round((totalPrice * depositPercent) / 100);
  const balanceDue = totalPrice - depositAmount;`
);

// Replace Overview section with TourStructuredDetails
content = content.replace(
  /{\/\* Overview & Key Highlights \*\/}[\s\S]*?<\/section>\s*{\/\* Tour Package \/ Seat Tier Selection Table \*\/}/,
  `{/* Structured Tour Details or Property Overview */}
            {isTour ? (
              <TourStructuredDetails listing={listing} />
            ) : (
              <section id="overview" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900">About this Property</h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
              </section>
            )}

            {/* Tour Package / Seat Tier Selection Table */}`
);

// Replace Itemized Price Breakdown
content = content.replace(
  /{\/\* Itemized Price Breakdown \*\/}[\s\S]*?<span>Balance Due on Arrival:<\/span>\s*<span className="font-bold text-slate-700">PKR \{balanceDue\.toLocaleString\(\)\}<\/span>\s*<\/div>\s*<\/div>/,
  `{/* Itemized Price Breakdown */}
              <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Base Rate ({selectedQuantity} {selectedQuantity > 1 ? "Travelers" : "Traveler"} · {selectedUnit ? formatUnitTitle(selectedUnit.title) : "Tour"}):</span>
                  <span>PKR {(baseTravelerPrice + groupDiscountApplied).toLocaleString()}</span>
                </div>

                {groupDiscountApplied > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                    <span>Group Discount (5+ Travelers):</span>
                    <span>-PKR {groupDiscountApplied.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Total Package Price:</span>
                  <span>PKR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Online Advance Deposit (25%):</span>
                  <span className="font-bold text-emerald-800">PKR {depositAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Balance Due on Arrival (75%):</span>
                  <span className="font-bold text-slate-700">PKR {balanceDue.toLocaleString()}</span>
                </div>
              </div>`
);

fs.writeFileSync('src/components/listing/ListingDetailClient.tsx', content, 'utf8');
console.log('Regex replace executed on ListingDetailClient.tsx');
