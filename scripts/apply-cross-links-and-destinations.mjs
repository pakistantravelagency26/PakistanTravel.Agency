import fs from "fs";

// ----------------------------------------------------
// 1. UPDATE src/app/page.tsx
// ----------------------------------------------------
let homeContent = fs.readFileSync("src/app/page.tsx", "utf8").replace(/\r\n/g, "\n");

// Replace allDestinations with all 13 destinations
const oldAllDestinations = `  const allDestinations = [
    { slug: "hunza", label: "Hunza Valley & Attabad" },
    { slug: "skardu", label: "Skardu & Deosai Plains" },
    { slug: "kumrat", label: "Kumrat Valley & Dir" },
    { slug: "swat", label: "Swat & Kalam" },
    { slug: "neelum", label: "Neelum Valley" },
    { slug: "murree", label: "Murree & Galyat" },
  ];`;

const newAllDestinations = `  const allDestinations = [
    { slug: "hunza", label: "Hunza Valley & Attabad" },
    { slug: "skardu", label: "Skardu & Deosai Plains" },
    { slug: "swat", label: "Swat & Kalam" },
    { slug: "kumrat", label: "Kumrat Valley & Dir" },
    { slug: "fairy-meadows", label: "Fairy Meadows & Nanga Parbat" },
    { slug: "neelum", label: "Neelum Valley" },
    { slug: "naran-kaghan", label: "Naran Kaghan Valley" },
    { slug: "gilgit", label: "Gilgit & Karakoram Highway" },
    { slug: "astore", label: "Astore & Rama Meadows" },
    { slug: "chitral-kalash", label: "Chitral & Kalash Valleys" },
    { slug: "naltar", label: "Naltar Valley Lakes" },
    { slug: "shogran-siri-paye", label: "Shogran & Siri Paye" },
    { slug: "murree", label: "Murree & Galyat" },
  ];`;

if (homeContent.includes(oldAllDestinations)) {
  homeContent = homeContent.replace(oldAllDestinations, newAllDestinations);
}

// Add Popular Destinations Hub before TourMarketplaceSection if not present
if (!homeContent.includes("Popular Northern Pakistan Destinations")) {
  const targetSection = `{/* Main Multi-Vendor Marketplace Catalog */}`;
  const destinationsSection = `{/* Popular Northern Pakistan Destinations Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
              Regional Destinations
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Popular Northern Pakistan Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore comprehensive destination travel guides across Gilgit-Baltistan, Khyber Pakhtunkhwa, and Azad Kashmir.
            </p>
          </div>
          <Link
            href="/destinations"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Explore all 13 destination guides</span>
            <Compass className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {allDestinations.map((dest) => (
            <Link
              key={dest.slug}
              href={\`/destinations/\${dest.slug}\`}
              className="group p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-900 group-hover:text-sky-600 transition block">
                  {dest.label}
                </span>
              </div>
              <span className="text-[10px] text-sky-600 font-semibold mt-2 flex items-center gap-0.5 group-hover:underline">
                View guide &amp; tours &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Multi-Vendor Marketplace Catalog */}`;

  homeContent = homeContent.replace(targetSection, destinationsSection);
  fs.writeFileSync("src/app/page.tsx", homeContent, "utf8");
  console.log("Updated home page.tsx with all 13 destinations section");
}

// ----------------------------------------------------
// 2. UPDATE src/app/destinations/[slug]/page.tsx
// ----------------------------------------------------
let destContent = fs.readFileSync("src/app/destinations/[slug]/page.tsx", "utf8").replace(/\r\n/g, "\n");

// Replace view all tour packages anchor and link
const oldTourLink = `            <Link
              href={\`/tours?destination=\${dest.slug}\`}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View all tour packages</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>`;

const newTourLink = `            <Link
              href={destinationTourIntentMap[dest.slug] || \`/tours?destination=\${dest.slug}\`}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View all {dest.name} tour packages</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>`;

if (destContent.includes(oldTourLink)) {
  destContent = destContent.replace(oldTourLink, newTourLink);
}

// Add mapping dictionaries if not present
if (!destContent.includes("relatedDestinationsMap")) {
  const mappingHeader = `
const destinationTourIntentMap: Record<string, string> = {
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

const relatedDestinationsMap: Record<string, { slug: string; name: string; province: string }[]> = {
  hunza: [
    { slug: "gilgit", name: "Gilgit Valley", province: "Gilgit-Baltistan" },
    { slug: "naltar", name: "Naltar Valley", province: "Gilgit-Baltistan" },
    { slug: "skardu", name: "Skardu & Deosai", province: "Gilgit-Baltistan" },
  ],
  skardu: [
    { slug: "hunza", name: "Hunza Valley", province: "Gilgit-Baltistan" },
    { slug: "astore", name: "Astore & Rama", province: "Gilgit-Baltistan" },
    { slug: "gilgit", name: "Gilgit Valley", province: "Gilgit-Baltistan" },
  ],
  swat: [
    { slug: "kumrat", name: "Kumrat Valley", province: "Khyber Pakhtunkhwa" },
    { slug: "shogran-siri-paye", name: "Shogran & Siri Paye", province: "Khyber Pakhtunkhwa" },
    { slug: "chitral-kalash", name: "Chitral & Kalash", province: "Khyber Pakhtunkhwa" },
  ],
  kumrat: [
    { slug: "swat", name: "Swat Valley", province: "Khyber Pakhtunkhwa" },
    { slug: "chitral-kalash", name: "Chitral & Kalash", province: "Khyber Pakhtunkhwa" },
    { slug: "naran-kaghan", name: "Naran Kaghan", province: "Khyber Pakhtunkhwa" },
  ],
  murree: [
    { slug: "naran-kaghan", name: "Naran Kaghan", province: "Khyber Pakhtunkhwa" },
    { slug: "shogran-siri-paye", name: "Shogran & Siri Paye", province: "Khyber Pakhtunkhwa" },
    { slug: "neelum", name: "Neelum Valley", province: "Azad Kashmir" },
  ],
  neelum: [
    { slug: "murree", name: "Murree & Galyat", province: "Punjab" },
    { slug: "naran-kaghan", name: "Naran Kaghan", province: "Khyber Pakhtunkhwa" },
    { slug: "shogran-siri-paye", name: "Shogran & Siri Paye", province: "Khyber Pakhtunkhwa" },
  ],
  "fairy-meadows": [
    { slug: "astore", name: "Astore & Rama", province: "Gilgit-Baltistan" },
    { slug: "gilgit", name: "Gilgit Valley", province: "Gilgit-Baltistan" },
    { slug: "hunza", name: "Hunza Valley", province: "Gilgit-Baltistan" },
  ],
  "naran-kaghan": [
    { slug: "shogran-siri-paye", name: "Shogran & Siri Paye", province: "Khyber Pakhtunkhwa" },
    { slug: "neelum", name: "Neelum Valley", province: "Azad Kashmir" },
    { slug: "murree", name: "Murree & Galyat", province: "Punjab" },
  ],
  naltar: [
    { slug: "gilgit", name: "Gilgit Valley", province: "Gilgit-Baltistan" },
    { slug: "hunza", name: "Hunza Valley", province: "Gilgit-Baltistan" },
    { slug: "fairy-meadows", name: "Fairy Meadows", province: "Gilgit-Baltistan" },
  ],
  astore: [
    { slug: "fairy-meadows", name: "Fairy Meadows", province: "Gilgit-Baltistan" },
    { slug: "skardu", name: "Skardu & Deosai", province: "Gilgit-Baltistan" },
    { slug: "gilgit", name: "Gilgit Valley", province: "Gilgit-Baltistan" },
  ],
  "chitral-kalash": [
    { slug: "swat", name: "Swat Valley", province: "Khyber Pakhtunkhwa" },
    { slug: "kumrat", name: "Kumrat Valley", province: "Khyber Pakhtunkhwa" },
    { slug: "gilgit", name: "Gilgit Valley", province: "Gilgit-Baltistan" },
  ],
  "shogran-siri-paye": [
    { slug: "naran-kaghan", name: "Naran Kaghan", province: "Khyber Pakhtunkhwa" },
    { slug: "swat", name: "Swat Valley", province: "Khyber Pakhtunkhwa" },
    { slug: "murree", name: "Murree & Galyat", province: "Punjab" },
  ],
  gilgit: [
    { slug: "hunza", name: "Hunza Valley", province: "Gilgit-Baltistan" },
    { slug: "naltar", name: "Naltar Valley", province: "Gilgit-Baltistan" },
    { slug: "fairy-meadows", name: "Fairy Meadows", province: "Gilgit-Baltistan" },
  ],
};

const relatedBlogGuidesMap: Record<string, { slug: string; title: string; category: string }[]> = {
  hunza: [
    { slug: "hunza-best-time-to-visit", title: "Best Time to Visit Hunza Valley: Cherry Blossom & Autumn", category: "Season Guide" },
    { slug: "skardu-vs-hunza", title: "Skardu vs Hunza: Which Northern Pakistan Valley Should You Choose?", category: "Comparison" },
  ],
  skardu: [
    { slug: "skardu-trip-cost-2026", title: "Skardu Trip Cost 2026: Complete Budget & Luxury Breakdown", category: "Cost Guide" },
    { slug: "skardu-vs-hunza", title: "Skardu vs Hunza: Which Northern Pakistan Valley Should You Choose?", category: "Comparison" },
  ],
  swat: [
    { slug: "kumrat-valley-route-tips", title: "Kumrat Valley Travel Guide: Route, 4x4 Road Conditions & Tips", category: "Route Tips" },
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
  ],
  kumrat: [
    { slug: "kumrat-valley-route-tips", title: "Kumrat Valley Travel Guide: Route, 4x4 Road Conditions & Tips", category: "Route Tips" },
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
  ],
  murree: [
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
    { slug: "hunza-best-time-to-visit", title: "Best Time to Visit Hunza Valley: Cherry Blossom & Autumn", category: "Season Guide" },
  ],
  neelum: [
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
    { slug: "kumrat-valley-route-tips", title: "Kumrat Valley Travel Guide: Route, 4x4 Road Conditions & Tips", category: "Route Tips" },
  ],
  "fairy-meadows": [
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
    { slug: "skardu-trip-cost-2026", title: "Skardu Trip Cost 2026: Complete Budget & Luxury Breakdown", category: "Cost Guide" },
  ],
  "naran-kaghan": [
    { slug: "kumrat-valley-route-tips", title: "Kumrat Valley Travel Guide: Route, 4x4 Road Conditions & Tips", category: "Route Tips" },
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
  ],
  naltar: [
    { slug: "hunza-best-time-to-visit", title: "Best Time to Visit Hunza Valley: Cherry Blossom & Autumn", category: "Season Guide" },
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
  ],
  astore: [
    { slug: "skardu-trip-cost-2026", title: "Skardu Trip Cost 2026: Complete Budget & Luxury Breakdown", category: "Cost Guide" },
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
  ],
  "chitral-kalash": [
    { slug: "kumrat-valley-route-tips", title: "Kumrat Valley Travel Guide: Route, 4x4 Road Conditions & Tips", category: "Route Tips" },
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
  ],
  "shogran-siri-paye": [
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
    { slug: "kumrat-valley-route-tips", title: "Kumrat Valley Travel Guide: Route, 4x4 Road Conditions & Tips", category: "Route Tips" },
  ],
  gilgit: [
    { slug: "hunza-best-time-to-visit", title: "Best Time to Visit Hunza Valley: Cherry Blossom & Autumn", category: "Season Guide" },
    { slug: "skardu-trip-cost-2026", title: "Skardu Trip Cost 2026: Complete Budget & Luxury Breakdown", category: "Cost Guide" },
  ],
};
`;
  // Insert before component function
  destContent = destContent.replace("export default async function DestinationDetailPage", `${mappingHeader}\nexport default async function DestinationDetailPage`);
}

// Add sections before the closing </div> of page
const relatedSections = `
        {/* Section 7: Nearby & Related Destinations */}
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
                Regional Exploration
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Nearby &amp; Related Destinations
              </h2>
            </div>
            <Link
              href="/destinations"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1"
            >
              <span>All 13 Destinations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(relatedDestinationsMap[dest.slug] || []).map((rel) => (
              <Link
                key={rel.slug}
                href={\`/destinations/\${rel.slug}\`}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                    {rel.province}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition mt-1">
                    {rel.name}
                  </h3>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 mt-3">
                  <span>View destination guide</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 8: Related Travel Guides */}
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
                Editorial Guides
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Related Travel Guides &amp; Route Advice
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1"
            >
              <span>Explore All Guides</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(relatedBlogGuidesMap[dest.slug] || []).map((guide) => (
              <Link
                key={guide.slug}
                href={\`/blog/\${guide.slug}\`}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
                    {guide.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-sky-600 transition mt-1 line-clamp-2">
                    {guide.title}
                  </h3>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 mt-3">
                  <span>Read travel guide</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}`;

if (!destContent.includes("Nearby & Related Destinations")) {
  destContent = destContent.replace(/\s*<\/div>\s*<\/div>\s*\);\s*}\s*$/, relatedSections);
  fs.writeFileSync("src/app/destinations/[slug]/page.tsx", destContent, "utf8");
  console.log("Updated destinations/[slug]/page.tsx with related destinations and guides");
}

// ----------------------------------------------------
// 3. UPDATE src/app/blog/[slug]/page.tsx
// ----------------------------------------------------
let blogContent = fs.readFileSync("src/app/blog/[slug]/page.tsx", "utf8").replace(/\r\n/g, "\n");

// Add mapping for destination and related articles in blog page
if (!blogContent.includes("blogDestinationMap")) {
  const blogMaps = `
const blogDestinationMap: Record<string, { slug: string; name: string; tourIntentUrl: string; tourIntentLabel: string }> = {
  "skardu-trip-cost-2026": {
    slug: "skardu",
    name: "Skardu & Deosai Plains",
    tourIntentUrl: "/tours/skardu-tour-packages",
    tourIntentLabel: "Browse Skardu Tour Packages",
  },
  "hunza-best-time-to-visit": {
    slug: "hunza",
    name: "Hunza Valley & Attabad Lake",
    tourIntentUrl: "/tours/hunza-tour-packages",
    tourIntentLabel: "Browse Hunza Tour Packages",
  },
  "kumrat-valley-route-tips": {
    slug: "kumrat",
    name: "Kumrat Valley & Dir",
    tourIntentUrl: "/tours/kumrat-tour-packages",
    tourIntentLabel: "Browse Kumrat Tour Packages",
  },
  "skardu-vs-hunza": {
    slug: "hunza",
    name: "Hunza & Skardu Valleys",
    tourIntentUrl: "/tours/gilgit-baltistan-tour-packages",
    tourIntentLabel: "Browse Gilgit-Baltistan Tours",
  },
  "northern-pakistan-packing-list": {
    slug: "fairy-meadows",
    name: "Fairy Meadows & Northern Valleys",
    tourIntentUrl: "/tours/fairy-meadows-tours",
    tourIntentLabel: "Browse Fairy Meadows Treks",
  },
};
`;
  blogContent = blogContent.replace("export default async function BlogPostPage", `${blogMaps}\nexport default async function BlogPostPage`);
}

// Add Related Guides section right before Back to Blog
if (!blogContent.includes("Related Northern Pakistan Travel Guides")) {
  const targetBack = `{/* Back to Blog */}`;
  const relatedGuidesBlock = `{/* Related Northern Pakistan Travel Guides */}
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
                Recommended Reading
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Related Northern Pakistan Travel Guides
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1"
            >
              <span>All Articles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2).map((relPost) => (
              <Link
                key={relPost.slug}
                href={\`/blog/\${relPost.slug}\`}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
                    {relPost.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-sky-600 transition mt-1 line-clamp-2">
                    {relPost.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {relPost.excerpt}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 mt-3">
                  <span>Read guide &rarr;</span>
                  <span className="text-[10px] text-slate-400 font-normal">{relPost.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Back to Blog */}`;

  blogContent = blogContent.replace(targetBack, relatedGuidesBlock);

  // Also enhance the Call to Action Card in the blog to link directly to its destination and tours
  const oldCtaButtons = `<div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/tours"
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Browse All Tour Packages
            </Link>
            <Link
              href="/destinations"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition"
            >
              Explore Destinations
            </Link>
          </div>`;

  const newCtaButtons = `<div className="pt-2 flex flex-wrap gap-3">
            <Link
              href={blogDestinationMap[post.slug]?.tourIntentUrl || "/tours"}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              {blogDestinationMap[post.slug]?.tourIntentLabel || "Browse All Tour Packages"}
            </Link>
            <Link
              href={\`/destinations/\${blogDestinationMap[post.slug]?.slug || 'hunza'}\`}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition"
            >
              Explore {blogDestinationMap[post.slug]?.name || "Destinations"}
            </Link>
            <Link
              href="/tours"
              className="px-5 py-2.5 bg-white/5 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition text-slate-300"
            >
              All Tours Catalog
            </Link>
          </div>`;

  if (blogContent.includes(oldCtaButtons)) {
    blogContent = blogContent.replace(oldCtaButtons, newCtaButtons);
  }

  fs.writeFileSync("src/app/blog/[slug]/page.tsx", blogContent, "utf8");
  console.log("Updated blog/[slug]/page.tsx with related travel guides and destination links");
}
