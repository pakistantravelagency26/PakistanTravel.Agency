import fs from "fs";

let content = fs.readFileSync("src/app/blog/page.tsx", "utf8");

content = content.replace(
  `                <Link
                  href={\`/blog/\${blogPosts[0].slug}\`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>`,
  `                <Link
                  href={\`/blog/\${blogPosts[0].slug}\`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
                  aria-label={\`Read full article: \${blogPosts[0].title}\`}
                >
                  <span>Read {blogPosts[0].title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>`
);

content = content.replace(
  `                  <Link
                    href={\`/blog/\${post.slug}\`}
                    className="font-bold text-sky-600 group-hover:text-sky-700 flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </Link>`,
  `                  <Link
                    href={\`/blog/\${post.slug}\`}
                    className="font-bold text-sky-600 group-hover:text-sky-700 flex items-center gap-1 text-xs"
                    aria-label={\`Read guide: \${post.title}\`}
                  >
                    <span>Read {post.title} guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </Link>`
);

fs.writeFileSync("src/app/blog/page.tsx", content);
console.log("Updated blog/page.tsx successfully");
