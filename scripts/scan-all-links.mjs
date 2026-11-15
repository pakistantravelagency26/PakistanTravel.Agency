import fs from "fs";
import path from "path";

function scanLinks(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (f === "node_modules" || f === ".next" || f === ".git") continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) scanLinks(full);
    else if (f.endsWith(".tsx")) {
      const code = fs.readFileSync(full, "utf8");
      // Find all Link tags and their immediate inner text or children
      const regex = /<Link\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/Link>/g;
      let match;
      while ((match = regex.exec(code)) !== null) {
        const [fullTag, href, inner] = match;
        const cleanInner = inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        const lower = cleanInner.toLowerCase();
        if (
          lower === "learn more" ||
          lower === "read more" ||
          lower === "click here" ||
          lower === "read article" ||
          lower === "view all" ||
          lower === "explore" ||
          lower === "read guide" ||
          lower === "details" ||
          lower === "view" ||
          cleanInner === ""
        ) {
          console.log(`${full} -> href: ${href} | text: "${cleanInner}"`);
        }
      }
    }
  }
}

scanLinks("src");
