import fs from "fs";
import { destinationsData } from "../src/data/destinationData.ts";
import { blogPosts } from "../src/data/blogData.ts";
import { tourIntentsData } from "../src/data/tourIntentsData.ts";
import { DEFAULT_SITE_SETTINGS } from "../src/config/siteSettings.constants.ts";

const SITE_URL = "https://www.pakistantravel.agency";

// 1. Gather all sitemap URLs
const staticPages = [
  "",
  "/destinations",
  "/tours",
  "/blog",
  "/about",
  "/about/editorial-policy",
  "/contact",
  "/faq",
  "/partner-info",
  "/list-your-tour",
  "/how-booking-works",
  "/safety-and-permits",
  "/terms",
  "/privacy",
];

const destinationSlugs = Object.keys(destinationsData);
const blogSlugs = blogPosts.map((p) => p.slug);
const tourIntentSlugs = Object.keys(tourIntentsData);

const allSitemapUrls = [
  ...staticPages.map((p) => `${SITE_URL}${p}`),
  ...destinationSlugs.map((slug) => `${SITE_URL}/destinations/${slug}`),
  ...tourIntentSlugs.map((slug) => `${SITE_URL}/tours/${slug}`),
  ...blogSlugs.map((slug) => `${SITE_URL}/blog/${slug}`),
];

// Map of outbound links from each page/component
// The root Footer is present on all public pages
const footerLinks = new Set([
  ...DEFAULT_SITE_SETTINGS.FOOTER.col1Links.map((l) => l.url),
  ...DEFAULT_SITE_SETTINGS.FOOTER.col2Links.map((l) => l.url),
  ...DEFAULT_SITE_SETTINGS.FOOTER.col3Links.map((l) => l.url),
  "/partner-info",
  "/terms",
  "/privacy",
  "/contact",
]);

// Navbar is present on all public pages
const navbarLinks = new Set([
  "/",
  "/destinations",
  "/tours",
  "/blog",
  "/list-your-tour",
  "/partner-info",
]);

// Track inbound links per URL: url -> Set of source page URLs
const inboundLinks = {};
allSitemapUrls.forEach((u) => {
  inboundLinks[u] = new Set();
});

function recordLink(fromUrl, toPath) {
  if (!toPath) return;
  let normalized = toPath.split("#")[0].split("?")[0].replace(/\/$/, "");
  if (!normalized.startsWith("http")) {
    normalized = `${SITE_URL}${normalized}`;
  }
  if (inboundLinks[normalized] && normalized !== fromUrl) {
    inboundLinks[normalized].add(fromUrl);
  }
}

// 1. Links from Root Layout (Footer + Navbar) to all public pages
allSitemapUrls.forEach((sourceUrl) => {
  footerLinks.forEach((target) => recordLink(sourceUrl, target));
  navbarLinks.forEach((target) => recordLink(sourceUrl, target));
});

// 2. Links from Homepage (src/app/page.tsx)
const homeUrl = SITE_URL;
destinationSlugs.forEach((slug) => recordLink(homeUrl, `/destinations/${slug}`));
recordLink(homeUrl, "/destinations");
recordLink(homeUrl, "/tours");
recordLink(homeUrl, "/partner-info");

// 3. Links from /destinations (src/app/destinations/page.tsx)
const destHubUrl = `${SITE_URL}/destinations`;
destinationSlugs.forEach((slug) => recordLink(destHubUrl, `/destinations/${slug}`));

// 4. Links from /blog (src/app/blog/page.tsx)
const blogHubUrl = `${SITE_URL}/blog`;
blogSlugs.forEach((slug) => recordLink(blogHubUrl, `/blog/${slug}`));

// 5. Links from each destination page (src/app/destinations/[slug]/page.tsx)
const destTourIntentMap = {
  hunza: "/tours/hunza-tour-packages",
  skardu: "/tours/skardu-tour-packages",
  swat: "/tours/swat-tour-packages",
  kumrat: "/tours/kumrat-tour-packages",
  neelum: "/tours/neelum-tour-packages",
  "fairy-meadows": "/tours/fairy-meadows-tours",
  gilgit: "/tours/gilgit-baltistan-tour-packages",
  naltar: "/tours/gilgit-baltistan-tour-packages",
  astore: "/tours/gilgit-baltistan-tour-packages",
};

const relatedDestinationsMap = {
  hunza: ["gilgit", "naltar", "skardu"],
  skardu: ["hunza", "astore", "gilgit"],
  swat: ["kumrat", "shogran-siri-paye", "chitral-kalash"],
  kumrat: ["swat", "chitral-kalash", "naran-kaghan"],
  murree: ["naran-kaghan", "shogran-siri-paye", "neelum"],
  neelum: ["murree", "naran-kaghan", "shogran-siri-paye"],
  "fairy-meadows": ["astore", "gilgit", "hunza"],
  "naran-kaghan": ["shogran-siri-paye", "neelum", "murree"],
  naltar: ["gilgit", "hunza", "fairy-meadows"],
  astore: ["fairy-meadows", "skardu", "gilgit"],
  "chitral-kalash": ["swat", "kumrat", "gilgit"],
  "shogran-siri-paye": ["naran-kaghan", "swat", "murree"],
  gilgit: ["hunza", "naltar", "fairy-meadows"],
};

const relatedBlogGuidesMap = {
  hunza: ["hunza-best-time-to-visit", "skardu-vs-hunza"],
  skardu: ["skardu-trip-cost-2026", "skardu-vs-hunza"],
  swat: ["kumrat-valley-route-tips", "northern-pakistan-packing-list"],
  kumrat: ["kumrat-valley-route-tips", "northern-pakistan-packing-list"],
  murree: ["northern-pakistan-packing-list", "hunza-best-time-to-visit"],
  neelum: ["northern-pakistan-packing-list", "kumrat-valley-route-tips"],
  "fairy-meadows": ["northern-pakistan-packing-list", "skardu-trip-cost-2026"],
  "naran-kaghan": ["kumrat-valley-route-tips", "northern-pakistan-packing-list"],
  naltar: ["hunza-best-time-to-visit", "northern-pakistan-packing-list"],
  astore: ["skardu-trip-cost-2026", "northern-pakistan-packing-list"],
  "chitral-kalash": ["kumrat-valley-route-tips", "northern-pakistan-packing-list"],
  "shogran-siri-paye": ["northern-pakistan-packing-list", "kumrat-valley-route-tips"],
  gilgit: ["hunza-best-time-to-visit", "skardu-trip-cost-2026"],
};

destinationSlugs.forEach((slug) => {
  const destPageUrl = `${SITE_URL}/destinations/${slug}`;
  recordLink(destPageUrl, "/destinations");
  recordLink(destPageUrl, "/tours");
  if (destTourIntentMap[slug]) {
    recordLink(destPageUrl, destTourIntentMap[slug]);
  }
  // Related destinations
  (relatedDestinationsMap[slug] || []).forEach((rel) => {
    recordLink(destPageUrl, `/destinations/${rel}`);
  });
  // Related guides
  (relatedBlogGuidesMap[slug] || []).forEach((guide) => {
    recordLink(destPageUrl, `/blog/${guide}`);
  });
});

// 6. Links from each blog post (src/app/blog/[slug]/page.tsx)
const relatedBlogPostsMap = {
  "skardu-trip-cost-2026": ["skardu-vs-hunza", "northern-pakistan-packing-list"],
  "hunza-best-time-to-visit": ["skardu-vs-hunza", "northern-pakistan-packing-list"],
  "kumrat-valley-route-tips": ["northern-pakistan-packing-list", "skardu-trip-cost-2026"],
  "skardu-vs-hunza": ["skardu-trip-cost-2026", "hunza-best-time-to-visit"],
  "northern-pakistan-packing-list": ["hunza-best-time-to-visit", "kumrat-valley-route-tips"],
};

const blogDestinationMap = {
  "skardu-trip-cost-2026": "/destinations/skardu",
  "hunza-best-time-to-visit": "/destinations/hunza",
  "kumrat-valley-route-tips": "/destinations/kumrat",
  "skardu-vs-hunza": "/destinations/hunza",
  "northern-pakistan-packing-list": "/destinations/fairy-meadows",
};

blogSlugs.forEach((slug) => {
  const blogPageUrl = `${SITE_URL}/blog/${slug}`;
  recordLink(blogPageUrl, "/blog");
  recordLink(blogPageUrl, "/destinations");
  recordLink(blogPageUrl, "/tours");
  recordLink(blogPageUrl, "/about/editorial-policy");
  if (blogDestinationMap[slug]) {
    recordLink(blogPageUrl, blogDestinationMap[slug]);
  }
  (relatedBlogPostsMap[slug] || []).forEach((relSlug) => {
    recordLink(blogPageUrl, `/blog/${relSlug}`);
  });
});

console.log("=== INBOUND LINK AUDIT RESULTS ===");
let minInbound = Infinity;
let orphanedCount = 0;
let singleLinkCount = 0;

const tableRows = [];

allSitemapUrls.forEach((url) => {
  const sources = Array.from(inboundLinks[url]);
  const count = sources.length;
  if (count < minInbound) minInbound = count;
  if (count === 0) orphanedCount++;
  if (count === 1) singleLinkCount++;

  const cleanUrl = url.replace(SITE_URL, "") || "/";
  const sourceSummaries = sources.slice(0, 3).map((s) => s.replace(SITE_URL, "") || "/").join(", ") + (sources.length > 3 ? ` (+${sources.length - 3} more)` : "");
  tableRows.push({
    url: cleanUrl,
    inboundCount: count,
    fromPages: sourceSummaries,
  });
});

console.table(tableRows.slice(0, 20));
console.table(tableRows.slice(20));

console.log(`\nSUMMARY:`);
console.log(`Total Public Sitemap URLs: ${allSitemapUrls.length}`);
console.log(`Orphaned URLs (0 inbound links): ${orphanedCount}`);
console.log(`Single-link URLs (1 inbound link): ${singleLinkCount}`);
console.log(`Minimum inbound links for any page: ${minInbound}`);
