import fs from "fs";

let content = fs.readFileSync("src/config/siteSettings.constants.ts", "utf8");

const col1LinksRegex = /col1Links:\s*\[[\s\S]*?\],/;
const col2LinksRegex = /col2Links:\s*\[[\s\S]*?\],/;

const newCol1 = `col1Links: [
      { id: "c1-1", label: "Hunza Valley & Attabad Lake", url: "/destinations/hunza" },
      { id: "c1-2", label: "Skardu & Deosai Plains", url: "/destinations/skardu" },
      { id: "c1-3", label: "Swat Valley & Kalam", url: "/destinations/swat" },
      { id: "c1-4", label: "Kumrat Valley & Dir", url: "/destinations/kumrat" },
      { id: "c1-5", label: "Murree & Galyat Tours", url: "/destinations/murree" },
      { id: "c1-6", label: "Neelum Valley (Azad Kashmir)", url: "/destinations/neelum" },
      { id: "c1-7", label: "Fairy Meadows & Nanga Parbat", url: "/destinations/fairy-meadows" },
      { id: "c1-8", label: "Naran Kaghan Valley", url: "/destinations/naran-kaghan" },
      { id: "c1-9", label: "Naltar Valley Lakes", url: "/destinations/naltar" },
      { id: "c1-10", label: "Astore & Rama Meadows", url: "/destinations/astore" },
      { id: "c1-11", label: "Chitral & Kalash Valleys", url: "/destinations/chitral-kalash" },
      { id: "c1-12", label: "Shogran & Siri Paye", url: "/destinations/shogran-siri-paye" },
      { id: "c1-13", label: "Gilgit & Karakoram Highway", url: "/destinations/gilgit" },
    ],`;

const newCol2 = `col2Links: [
      { id: "c2-1", label: "Guided Northern Tours Catalog", url: "/tours" },
      { id: "c2-2", label: "All Regional Destinations Hub", url: "/destinations" },
      { id: "c2-3", label: "Hunza Tour Packages", url: "/tours/hunza-tour-packages" },
      { id: "c2-4", label: "Skardu Tour Packages", url: "/tours/skardu-tour-packages" },
      { id: "c2-5", label: "Swat Valley Tour Packages", url: "/tours/swat-tour-packages" },
      { id: "c2-6", label: "Swat & Kalam Summer Tours", url: "/tours/swat-kalam-tour-packages" },
      { id: "c2-7", label: "Kumrat Valley Tour Packages", url: "/tours/kumrat-tour-packages" },
      { id: "c2-8", label: "Neelum Valley Tour Packages", url: "/tours/neelum-tour-packages" },
      { id: "c2-9", label: "Neelum Valley Expeditions", url: "/tours/neelum-valley-tour-packages" },
      { id: "c2-10", label: "Gilgit-Baltistan Tour Packages", url: "/tours/gilgit-baltistan-tour-packages" },
      { id: "c2-11", label: "Fairy Meadows Trek Packages", url: "/tours/fairy-meadows-tours" },
      { id: "c2-12", label: "Winter Tours Pakistan", url: "/tours/winter-tours-pakistan" },
    ],`;

content = content.replace(col1LinksRegex, newCol1);
content = content.replace(col2LinksRegex, newCol2);

fs.writeFileSync("src/config/siteSettings.constants.ts", content, "utf8");
console.log("Successfully updated siteSettings.constants.ts with 13 destinations and 10 tour packages");
