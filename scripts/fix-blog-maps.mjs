import fs from "fs";

let content = fs.readFileSync("src/app/blog/[slug]/page.tsx", "utf8").replace(/\r\n/g, "\n");

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

if (!content.includes("const blogDestinationMap")) {
  content = content.replace("export default function BlogPostPage", `${blogMaps}\nexport default function BlogPostPage`);
  fs.writeFileSync("src/app/blog/[slug]/page.tsx", content, "utf8");
  console.log("Inserted blogDestinationMap into src/app/blog/[slug]/page.tsx");
}
