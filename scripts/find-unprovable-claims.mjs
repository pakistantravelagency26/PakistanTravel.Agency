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
    } else if (f.endsWith(".ts") || f.endsWith(".tsx")) {
      const content = fs.readFileSync(fullPath, "utf8");
      const lines = content.split("\n");
      lines.forEach((line, idx) => {
        // Look for claims like "verified local", "verified operator", "guaranteed price", "guaranteed departure", "verified CNIC"
        if (/verified\s+(?:operator|partner|tour|guide|vendor|hotel|accommodation)|guaranteed\s+(?:price|departure|rate|booking)|100%\s+guaranteed/i.test(line)) {
          if (!fullPath.includes("find-unprovable") && !fullPath.includes("tests")) {
            console.log(`${fullPath}:${idx + 1}: ${line.trim()}`);
          }
        }
      });
    }
  }
}

console.log("=== SCANNING FOR UNPROVABLE 'VERIFIED' / 'GUARANTEED' CLAIMS ===");
scanDir("src");
