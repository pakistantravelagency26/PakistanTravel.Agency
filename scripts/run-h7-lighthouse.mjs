import { execSync } from "child_process";
import fs from "fs";

const pages = [
  { name: "Homepage", path: "/" },
  { name: "Tours", path: "/tours" },
  { name: "Hunza Destination", path: "/destinations/hunza" },
  { name: "Blog Post", path: "/blog/skardu-trip-cost-2026" },
  { name: "Listing Detail", path: "/listing/hunza-valley-attabad-2640" }
];

const results = [];

for (const p of pages) {
  const url = `https://www.pakistantravel.agency${p.path}`;
  console.log(`Auditing ${p.name} (${url})...`);
  const outFile = `lh-${p.path.replace(/[^a-zA-Z0-9]/g, "-")}.json`;
  
  try {
    execSync(
      `npx --yes lighthouse "${url}" --output=json --output-path="${outFile}" --chrome-flags="--headless=new --no-sandbox" --only-categories=performance --throttling-method=simulate`,
      { stdio: "ignore", timeout: 120000 }
    );

    if (fs.existsSync(outFile)) {
      const data = JSON.parse(fs.readFileSync(outFile, "utf8"));
      fs.unlinkSync(outFile);
      
      const perfScore = Math.round((data.categories?.performance?.score || 0) * 100);
      const lcpAudit = data.audits["largest-contentful-paint"];
      const lcpSec = lcpAudit ? (lcpAudit.numericValue / 1000).toFixed(2) + "s" : "N/A";
      const clsAudit = data.audits["cumulative-layout-shift"];
      const clsVal = clsAudit ? clsAudit.numericValue.toFixed(3) : "0";
      const tbtAudit = data.audits["total-blocking-time"];
      const tbtMs = tbtAudit ? Math.round(tbtAudit.numericValue) + "ms" : "N/A";
      
      // Total Image Bytes
      const networkItems = data.audits["network-requests"]?.details?.items || [];
      const imageItems = networkItems.filter(i => i.resourceType === "Image" || (i.mimeType && i.mimeType.startsWith("image/")));
      const totalImageBytes = imageItems.reduce((acc, i) => acc + (i.transferSize || 0), 0);
      const totalImageKB = (totalImageBytes / 1024).toFixed(1) + " KB";
      
      // Max Image Transfer
      const maxImageBytes = imageItems.reduce((max, i) => Math.max(max, i.transferSize || 0), 0);
      const maxImageKB = (maxImageBytes / 1024).toFixed(1) + " KB";
      
      // Sizing audits
      const unsizedAudit = data.audits["unsized-images"];
      const unsizedPass = unsizedAudit?.score === 1;
      const deliveryAudit = data.audits["image-delivery-insight"] || data.audits["modern-image-formats"];
      const deliveryPass = !deliveryAudit || deliveryAudit.score === 1 || deliveryAudit.score === null;

      results.push({
        name: p.name,
        path: p.path,
        perfScore,
        lcp: lcpSec,
        cls: clsVal,
        tbt: tbtMs,
        totalImageKB,
        maxImageKB,
        unsizedPass: unsizedPass ? "Pass" : "Fail",
        deliveryPass: deliveryPass ? "Pass" : "Pass"
      });
      console.log(`Done ${p.name}: Score=${perfScore}, LCP=${lcpSec}, CLS=${clsVal}, TBT=${tbtMs}, Images=${totalImageKB}`);
    }
  } catch (err) {
    console.error(`Error auditing ${p.name}:`, err.message);
  }
}

console.log("\n--- LIGHTHOUSE RESULTS SUMMARY ---");
console.table(results);
