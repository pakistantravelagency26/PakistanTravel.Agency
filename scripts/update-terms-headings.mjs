import fs from "fs";

let content = fs.readFileSync("src/app/terms/page.tsx", "utf8");

// Add Table of Contents
const tocHtml = `        {/* Table of Contents */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Table of Contents</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <a href="#platform-role" className="hover:text-emerald-700 hover:underline">1. Platform Role &amp; Direct Contract</a>
            <a href="#vendor-status" className="hover:text-emerald-700 hover:underline">2. Independent Contractor Status</a>
            <a href="#payments-commission" className="hover:text-emerald-700 hover:underline">3. Payments, Commission &amp; Payouts</a>
            <a href="#cancellation-refunds" className="hover:text-emerald-700 hover:underline">4. Standardized Cancellation Policy</a>
            <a href="#force-majeure" className="hover:text-emerald-700 hover:underline">5. Road Closures &amp; Force Majeure</a>
            <a href="#traveler-responsibilities" className="hover:text-emerald-700 hover:underline">6. Traveler Responsibilities &amp; Permits</a>
            <a href="#liability-limitation" className="hover:text-emerald-700 hover:underline">7. Limitation of Platform Liability</a>
            <a href="#user-accounts" className="hover:text-emerald-700 hover:underline">8. User Accounts &amp; Security</a>
            <a href="#prohibited-conduct" className="hover:text-emerald-700 hover:underline">9. Prohibited Platform Conduct</a>
            <a href="#amendments" className="hover:text-emerald-700 hover:underline">10. Amendments &amp; Policy Changes</a>
            <a href="#governing-law" className="hover:text-emerald-700 hover:underline">11. Governing Law &amp; Disputes</a>
            <a href="#support-notices" className="hover:text-emerald-700 hover:underline">12. Support &amp; Formal Notices</a>
          </div>
        </div>`;

// Insert TOC right after important notice block
content = content.replace(
  '        </div>\n\n        <div className="space-y-8',
  `        </div>\n\n${tocHtml}\n\n        <div className="space-y-8`
);

// Add IDs to section headings
content = content.replace(
  '<span>1. Platform Role &amp; The Direct Booking Contract</span>',
  '<span id="platform-role">1. Platform Role &amp; The Direct Booking Contract</span>'
);
content = content.replace(
  '<span>2. Independent Contractor Status of Vendors</span>',
  '<span id="vendor-status">2. Independent Contractor Status of Vendors</span>'
);
content = content.replace(
  '<span>3. Payments, Platform Commission and Operator Payouts</span>',
  '<span id="payments-commission">3. Payments, Platform Commission and Operator Payouts</span>'
);
content = content.replace(
  '<span>4. Standardized Marketplace Cancellation &amp; Refund Policy</span>',
  '<span id="cancellation-refunds">4. Standardized Marketplace Cancellation &amp; Refund Policy</span>'
);
content = content.replace(
  '<span>5. Mountain Transit, Weather &amp; Road Closures (Force Majeure)</span>',
  '<span id="force-majeure">5. Mountain Transit, Weather &amp; Road Closures (Force Majeure)</span>'
);
content = content.replace(
  '<span>6. Traveler Responsibilities, Permits &amp; Security Checkposts</span>',
  '<span id="traveler-responsibilities">6. Traveler Responsibilities, Permits &amp; Security Checkposts</span>'
);
content = content.replace(
  '<span>7. Limitation of Platform Liability</span>',
  '<span id="liability-limitation">7. Limitation of Platform Liability</span>'
);
content = content.replace(
  '<span>8. User Accounts &amp; Security Credentials</span>',
  '<span id="user-accounts">8. User Accounts &amp; Security Credentials</span>'
);
content = content.replace(
  '<span>9. Prohibited Platform Conduct &amp; Content Guidelines</span>',
  '<span id="prohibited-conduct">9. Prohibited Platform Conduct &amp; Content Guidelines</span>'
);
content = content.replace(
  '<span>10. Amendments &amp; Changes to Terms</span>',
  '<span id="amendments">10. Amendments &amp; Changes to Terms</span>'
);
content = content.replace(
  '<span>11. Governing Law &amp; Dispute Resolution</span>',
  '<span id="governing-law">11. Governing Law &amp; Dispute Resolution</span>'
);
content = content.replace(
  '<span>12. Support Inquiries &amp; Formal Notices</span>',
  '<span id="support-notices">12. Support Inquiries &amp; Formal Notices</span>'
);

fs.writeFileSync("src/app/terms/page.tsx", content);
console.log("Updated terms/page.tsx with TOC and structured headings");
