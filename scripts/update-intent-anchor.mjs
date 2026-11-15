import fs from "fs";

let content = fs.readFileSync("src/app/tours/[intent]/page.tsx", "utf8");

content = content.replace(
  `            <Link href="/destinations" className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>`,
  `            <Link href="/destinations" className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
              <span>View all northern destinations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>`
);

fs.writeFileSync("src/app/tours/[intent]/page.tsx", content);
console.log("Updated tours/[intent]/page.tsx successfully");
