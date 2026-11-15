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
    } else if (f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".js") || f.endsWith(".mjs") || f.endsWith(".json")) {
      const content = fs.readFileSync(fullPath, "utf8");
      const lines = content.split("\n");
      lines.forEach((line, idx) => {
        if (/\\ge\b|\\le\b|\$\\ge|\$\\le|\$[^$]*\\ge|\$[^$]*\\le|\$[^$]*\+[^$]*\$|\$\ge|\$\le/.test(line)) {
          console.log(`${fullPath}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

console.log("Scanning src/ for stray LaTeX math syntax...");
scanDir("src");
console.log("Scanning scripts/ for stray LaTeX math syntax...");
scanDir("scripts");
console.log("Scan complete.");
