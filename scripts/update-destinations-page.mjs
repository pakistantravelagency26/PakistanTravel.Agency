import fs from "fs";

let content = fs.readFileSync("src/app/destinations/page.tsx", "utf8");

// 1. Update anchor text: Explore Destination Guide -> Explore {dest.name} travel guide
content = content.replace(
  "<span>Explore Destination Guide</span>",
  "<span>Explore {dest.name} travel guide</span>"
);

// 2. Add rich 160-word intro paragraph
const oldHeader = `          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {settings.subheading || "Explore comprehensive destination guides, seasonal advice, approximate costs, and guided tours curated by local mountain experts."}
          </p>`;

const newHeader = `          <div className="space-y-4 text-left sm:text-center text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl mx-auto">
            <p>
              Northern Pakistan encompasses some of the highest mountain ranges on earth, including the Karakoram, Himalayas, and Hindu Kush. Traversing across Gilgit-Baltistan, Khyber Pakhtunkhwa, and Azad Kashmir, these distinct travel regions offer dramatic landscapes ranging from the turquoise waters of Attabad Lake in Hunza to the high-altitude wilderness of Deosai Plains in Skardu.
            </p>
            <p>
              Each destination possesses its own unique topography, cultural heritage, and seasonal road logistics. While alpine routes such as Babusar Pass and Deosai typically open between late June and October, valleys like Swat, Murree, and Neelum remain accessible year-round for seasonal sightseeing and cultural tours. Whether planning a cultural tour to Karimabad or an expedition across Baltistan, choosing independent local tour operators ensures safe 4x4 transport, vetted hotel stays, and experienced mountain guides. Browse our regional guides below for key sights, seasonal access updates, and direct tour packages.
            </p>
          </div>`;

content = content.replace(oldHeader, newHeader);

fs.writeFileSync("src/app/destinations/page.tsx", content);
console.log("Updated destinations/page.tsx successfully");
