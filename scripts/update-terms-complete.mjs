import fs from "fs";

let content = fs.readFileSync("src/app/terms/page.tsx", "utf8");
content = content.replace(/\r\n/g, "\n");

const tocBlock = `        {/* Table of Contents */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <p className="font-bold text-xs uppercase tracking-wider text-slate-700">Table of Contents</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a href="#section-1" className="text-sky-600 hover:underline">1. Platform Role & Booking Contract</a>
            <a href="#section-2" className="text-sky-600 hover:underline">2. Independent Status of Vendors</a>
            <a href="#section-3" className="text-sky-600 hover:underline">3. Payments, Commission & Payouts</a>
            <a href="#section-4" className="text-sky-600 hover:underline">4. Standardized Cancellation Policy</a>
            <a href="#section-5" className="text-sky-600 hover:underline">5. Mountain Logistics & Liability</a>
            <a href="#section-6" className="text-sky-600 hover:underline">6. Anti-Circumvention Integrity</a>
            <a href="#section-7" className="text-sky-600 hover:underline">7. Mandatory Travel Documents</a>
            <a href="#section-8" className="text-sky-600 hover:underline">8. User Accounts & Security</a>
            <a href="#section-9" className="text-sky-600 hover:underline">9. Prohibited Activities</a>
            <a href="#section-10" className="text-sky-600 hover:underline">10. Dispute Resolution</a>
            <a href="#section-11" className="text-sky-600 hover:underline">11. Governing Law & Jurisdiction</a>
            <a href="#section-12" className="text-sky-600 hover:underline">12. Modifications to Terms</a>
          </div>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">`;

const oldDiv = `<div className="space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">`;

if (!content.includes("Table of Contents")) {
  content = content.replace(oldDiv, tocBlock);
}

// Ensure section IDs are present on all 12 sections
const sectionReplacements = [
  { search: /<span>1\. Platform Role/g, replace: '<span id="section-1">1. Platform Role' },
  { search: /<span id="platform-role">1\. Platform Role/g, replace: '<span id="section-1">1. Platform Role' },
  { search: /<span>2\. Independent Contractor Status/g, replace: '<span id="section-2">2. Independent Contractor Status' },
  { search: /<span id="vendor-status">2\. Independent Contractor Status/g, replace: '<span id="section-2">2. Independent Contractor Status' },
  { search: /<span>3\. Payments, Platform Commission/g, replace: '<span id="section-3">3. Payments, Platform Commission' },
  { search: /<span id="payments-commission">3\. Payments, Platform Commission/g, replace: '<span id="section-3">3. Payments, Platform Commission' },
  { search: /<span>4\. Standardized Cancellation/g, replace: '<span id="section-4">4. Standardized Cancellation' },
  { search: /<span>5\. Mountain Logistics/g, replace: '<span id="section-5">5. Mountain Logistics' },
  { search: /<span>6\. Anti-Circumvention/g, replace: '<span id="section-6">6. Anti-Circumvention' },
  { search: /<span>7\. Mandatory Travel Documents/g, replace: '<span id="section-7">7. Mandatory Travel Documents' },
  { search: /<span>8\. User Accounts/g, replace: '<span id="section-8">8. User Accounts' },
  { search: /<span>9\. Prohibited Activities/g, replace: '<span id="section-9">9. Prohibited Activities' },
  { search: /<span>10\. Dispute Resolution/g, replace: '<span id="section-10">10. Dispute Resolution' },
  { search: /<span>11\. Governing Law/g, replace: '<span id="section-11">11. Governing Law' },
  { search: /<span>12\. Modifications to Terms/g, replace: '<span id="section-12">12. Modifications to Terms' },
];

for (const { search, replace } of sectionReplacements) {
  content = content.replace(search, replace);
}

fs.writeFileSync("src/app/terms/page.tsx", content, "utf8");
console.log("Updated terms/page.tsx with TOC and all section anchors");
