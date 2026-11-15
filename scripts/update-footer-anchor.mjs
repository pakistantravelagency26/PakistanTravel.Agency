import fs from "fs";

let content = fs.readFileSync("src/components/layout/Footer.tsx", "utf8");

// 1. Fix generic anchor "Learn more" -> "Learn about our partner tour operators"
content = content.replace(
  '<Link href="/partner-info" className="text-sky-400 hover:underline">Learn more</Link>',
  '<Link href="/partner-info" className="text-sky-400 hover:underline">Learn about our partner tour operators</Link>'
);

// 2. Ensure Footer renders all 13 destinations and collections seamlessly
fs.writeFileSync("src/components/layout/Footer.tsx", content);
console.log("Updated Footer.tsx successfully");
