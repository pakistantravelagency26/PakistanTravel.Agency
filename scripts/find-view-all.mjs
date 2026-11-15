import fs from "fs";
import path from "path";

function findTexts(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (f === "node_modules" || f === ".next" || f === ".git") continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) findTexts(full);
    else if (f.endsWith(".tsx")) {
      const code = fs.readFileSync(full, "utf8");
      const lines = code.split("\n");
      lines.forEach((l, idx) => {
        if (
          l.includes("View all") ||
          l.includes("View All") ||
          l.includes("Explore All") ||
          l.includes("Explore all") ||
          l.includes("Read more") ||
          l.includes("Read More") ||
          l.includes("Learn more") ||
          l.includes("Learn More")
        ) {
          if (l.includes("Link") || l.includes("href") || l.includes("<a")) {
            console.log(`${full}:${idx + 1}: ${l.trim()}`);
          }
        }
      });
    }
  }
}

findTexts("src");
