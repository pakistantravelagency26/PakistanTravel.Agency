import fs from "fs";

// 1. Update src/app/list-your-tour/page.tsx
let listContent = fs.readFileSync("src/app/list-your-tour/page.tsx", "utf8").replace(/\r\n/g, "\n");

listContent = listContent.replace(
  '<h3 className="font-bold text-slate-900 text-sm">Flat 10% Platform Commission</h3>',
  '<h3 className="font-bold text-slate-900 text-sm">Flat {commissionRate}% Platform Commission</h3>'
);

listContent = listContent.replace(
  '10% <span className="text-lg font-medium text-emerald-200">Platform Commission</span>',
  '{commissionRate}% <span className="text-lg font-medium text-emerald-200">Platform Commission</span>'
);

listContent = listContent.replace(
  'No monthly subscription, no setup costs, no hidden software fees. A transparent 10% platform commission is deducted from operator disbursements upon tour departure.',
  'No monthly subscription, no setup costs, no hidden software fees. A transparent {commissionRate}% platform commission is deducted from operator disbursements upon tour departure.'
);

fs.writeFileSync("src/app/list-your-tour/page.tsx", listContent, "utf8");
console.log("Updated src/app/list-your-tour/page.tsx");

// 2. Update src/app/terms/page.tsx
let termsContent = fs.readFileSync("src/app/terms/page.tsx", "utf8").replace(/\r\n/g, "\n");

if (!termsContent.includes("COMMISSION_PERCENT")) {
  termsContent = termsContent.replace(
    'import { siteConfig } from "@/config/site";',
    'import { siteConfig, COMMISSION_PERCENT } from "@/config/site";'
  );
}

termsContent = termsContent.replace(
  "<strong>Platform Commission:</strong> A flat 10% platform commission is deducted from the gross booking value upon completed reservations.",
  "<strong>Platform Commission:</strong> A flat {COMMISSION_PERCENT}% platform commission is deducted from the gross booking value upon completed reservations."
);

fs.writeFileSync("src/app/terms/page.tsx", termsContent, "utf8");
console.log("Updated src/app/terms/page.tsx");
