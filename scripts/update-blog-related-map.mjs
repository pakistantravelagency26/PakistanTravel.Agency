import fs from "fs";

let content = fs.readFileSync("src/app/blog/[slug]/page.tsx", "utf8").replace(/\r\n/g, "\n");

// Add relatedBlogPostsMap
const mapCode = `
const relatedBlogPostsMap: Record<string, string[]> = {
  "skardu-trip-cost-2026": ["skardu-vs-hunza", "northern-pakistan-packing-list"],
  "hunza-best-time-to-visit": ["skardu-vs-hunza", "northern-pakistan-packing-list"],
  "kumrat-valley-route-tips": ["northern-pakistan-packing-list", "skardu-trip-cost-2026"],
  "skardu-vs-hunza": ["skardu-trip-cost-2026", "hunza-best-time-to-visit"],
  "northern-pakistan-packing-list": ["hunza-best-time-to-visit", "kumrat-valley-route-tips"],
};
`;

if (!content.includes("relatedBlogPostsMap")) {
  content = content.replace("const blogDestinationMap", `${mapCode}\nconst blogDestinationMap`);
}

// Replace the slice(0, 2) with relatedBlogPostsMap lookup
const oldRelMap = `{blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2).map((relPost) => (`;
const newRelMap = `{((relatedBlogPostsMap[post.slug] || []).map((slug) => blogPosts.find((p) => p.slug === slug)).filter(Boolean) as typeof blogPosts).map((relPost) => (`;

content = content.replace(oldRelMap, newRelMap);

fs.writeFileSync("src/app/blog/[slug]/page.tsx", content, "utf8");
console.log("Updated related posts mapping in blog/[slug]/page.tsx");
