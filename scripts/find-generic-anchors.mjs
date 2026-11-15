import fs from "fs";
import path from "path";

const genericWords = [
  "Learn more",
  "Read more",
  "Click here",
  "Read Article",
  "Read article",
  "Read Guide",
  "Read guide",
  "View all",
  "View All",
  "Explore all",
  "Explore All",
  "Explore"
];

function search(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (f === "node_modules" || f === ".next" || f === ".git") continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) search(full);
    else if (f.endsWith(".tsx") || f.endsWith(".ts")) {
      const code = fs.readFileSync(full, "utf8");
      const lines = code.split("\n");
      lines.forEach((line, idx) => {
        // check if line contains a link or anchor with generic text
        for (const w of genericWords) {
          const regex = new RegExp(`>\\s*${w}\\s*<`, "i");
          if (regex.test(line)) {
            console.log(`${full}:${idx + 1} [${w}]: ${line.trim()}`);
          }
        }
      });
    }
  }
}

search("src");
