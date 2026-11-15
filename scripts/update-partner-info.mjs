import fs from "fs";

let content = fs.readFileSync("src/app/partner-info/page.tsx", "utf8");
content = content.replace(/\r\n/g, "\n");

content = content.replace(
  "<span>Review the day-by-day itinerary, vehicle type, and hotel inclusions carefully before completing your reservation.</span>",
  "<span>Review the day-by-day itinerary, vehicle type, accommodation standards, and package inclusions carefully before completing your reservation.</span>"
);

content = content.replace(
  "<span>Note the platform cancellation policy (100% refund $\\ge 7$ days before departure, 50% 3–6 days, non-refundable within 72 hours).</span>",
  "<span>Note the platform cancellation policy (100% refund 7 or more days before departure, 50% 3–6 days, non-refundable within 72 hours).</span>"
);

fs.writeFileSync("src/app/partner-info/page.tsx", content, "utf8");
console.log("Updated partner-info/page.tsx successfully");
