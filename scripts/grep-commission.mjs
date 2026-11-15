import fs from "fs";
import path from "path";

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === "node_modules" || f === ".next" || f === ".git" || f === "dist") continue;
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".mjs")) {
      const content = fs.readFileSync(fullPath, "utf8");
      const lines = content.split("\n");
      lines.forEach((line, idx) => {
        if (/COMMISSION|commissionPercent|commissionRate/i.test(line)) {
          if (!fullPath.includes("grep-commission") && !fullPath.includes("tests")) {
            console.log(`${fullPath}:${idx + 1}: ${line.trim()}`);
          }
        }
      });
    }
  }
}

console.log("=== SCANNING FOR COMMISSION REFERENCES IN CODEBASE ===");
scanDir("src");
