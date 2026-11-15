import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock, RefreshCw, ArrowLeft, ChevronRight, HelpCircle, Compass, List } from "lucide-react";
import { blogPosts } from "@/data/blogData";

export const revalidate = 60;
export const dynamicParams = false;

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  const siteUrl = SITE_URL;

  if (!post) {
    notFound();
  }

  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const ogImageUrl = `${siteUrl}/og?title=${encodeURIComponent(post.title)}&category=TRAVEL%20GUIDE&subtitle=${encodeURIComponent((post.readTime || "5 min read") + " • Northern Pakistan Editorial")}`;

  return {
    title: post.seoTitle,
    description: post.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      locale: "en_PK",
      url: canonicalUrl,
      siteName: "PakistanTravel",
      title: post.seoTitle,
      description: post.metaDescription,
      publishedTime: post.isoDate || post.date,
      modifiedTime: post.lastUpdatedIso || post.isoDate,
      authors: [post.author.name],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.coverAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.metaDescription,
      images: [ogImageUrl],
    },
  };
}

function renderParagraphWithLinks(text: string) {
  // Simple parser for [link text](/url)
  const parts = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const linkText = match[1];
    const linkUrl = match[2];
    parts.push(
      <Link
        key={match.index}
        href={linkUrl}
        className="font-bold text-sky-600 hover:text-sky-700 underline underline-offset-2"
      >
        {linkText}
      </Link>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}



const relatedBlogPostsMap: Record<string, string[]> = {
  "skardu-trip-cost-2026": ["skardu-vs-hunza", "northern-pakistan-packing-list"],
  "hunza-best-time-to-visit": ["skardu-vs-hunza", "northern-pakistan-packing-list"],
  "kumrat-valley-route-tips": ["northern-pakistan-packing-list", "skardu-trip-cost-2026"],
  "skardu-vs-hunza": ["skardu-trip-cost-2026", "hunza-best-time-to-visit"],
  "northern-pakistan-packing-list": ["hunza-best-time-to-visit", "kumrat-valley-route-tips"],
};

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

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  const siteUrl = SITE_URL;

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: [post.coverImage],
    datePublished: post.isoDate || post.date,
    dateModified: post.lastUpdatedIso || post.isoDate || post.date,
    author: {
      "@type": "Organization",
      name: post.author.name,
      url: `${siteUrl}/about/editorial-policy`,
    },
    publisher: {
      "@type": "Organization",
      name: "PakistanTravel",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Travel Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${post.slug}`,
      },
    ],
  };

  const faqJsonLd = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  } : null;

  const headings = post.content
    .filter((sec) => sec.heading && sec.id)
    .map((sec) => ({ id: sec.id!, title: sec.heading! }));

  return (
    <article className="bg-slate-50 min-h-screen pb-24 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200/80 pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-slate-700 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-slate-700 transition">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 truncate max-w-[200px]">{post.category}</span>
          </nav>

          <span className="inline-block bg-sky-50 text-sky-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            {post.category}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500 border-t border-slate-100">
            <Link
              href="/about/editorial-policy"
              className="flex items-center gap-3 group hover:opacity-90 transition"
            >
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs group-hover:bg-emerald-700 transition">
                P
              </div>
              <div>
                <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition block">
                  {post.author.name}
                </span>
                <span className="text-[11px] text-slate-400">{post.author.role} • Editorial Policy</span>
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Published: {post.date}</span>
              </span>
              {post.lastUpdated && (
                <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  <RefreshCw className="w-3 h-3" />
                  <span>Updated: {post.lastUpdated}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.readTime}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4">
        <div className="relative h-72 sm:h-96 md:h-[420px] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200">
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-12 space-y-10">
        {/* Table of Contents */}
        {headings.length > 0 && (
          <nav aria-label="Table of Contents" className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <List className="w-4 h-4 text-sky-600" />
              <span>Table of Contents</span>
            </div>
            <ol className="space-y-1.5 text-xs sm:text-sm text-slate-600 pl-4 list-decimal marker:text-sky-600">
              {headings.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="hover:text-sky-600 hover:underline transition">
                    {h.title}
                  </a>
                </li>
              ))}
              {post.faqs && post.faqs.length > 0 && (
                <li>
                  <a href="#frequently-asked-questions" className="hover:text-sky-600 hover:underline transition">
                    Frequently Asked Questions
                  </a>
                </li>
              )}
            </ol>
          </nav>
        )}

        {/* Post Sections */}
        {post.content.map((sec, idx) => (
          <section key={idx} id={sec.id} className="space-y-4 scroll-mt-20">
            {sec.heading && (
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {sec.heading}
              </h2>
            )}

            {sec.subheading && (
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                {sec.subheading}
              </h3>
            )}

            {sec.paragraphs?.map((p, pIdx) => (
              <p key={pIdx} className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {renderParagraphWithLinks(p)}
              </p>
            ))}

            {sec.list && (
              <ul className="space-y-2.5 my-3 pl-2">
                {sec.list.map((item, lIdx) => (
                  <li key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0 mt-2"></span>
                    <span>{renderParagraphWithLinks(item)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* 2026 Market Rates & Cost Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Market Rates Disclaimer:</strong> Estimated costs and rates discussed in our travel guides are based on 2026 market benchmarks and fluctuate with seasonal demand, fuel prices, and regional conditions. Confirm current rates directly with operators before booking.
          </p>
        </div>

        {/* Call to Action Card */}
        <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Compass className="w-4 h-4" />
            <span>Ready for Adventure?</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">
            Explore Northern Tours with PakistanTravel.Agency
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Book guided tour packages across Hunza, Skardu, and Swat with independent local tour operators, flexible cancellation, and digital vouchers.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href={blogDestinationMap[post.slug]?.tourIntentUrl || "/tours"}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              {blogDestinationMap[post.slug]?.tourIntentLabel || "Browse All Tour Packages"}
            </Link>
            <Link
              href={`/destinations/${blogDestinationMap[post.slug]?.slug || 'hunza'}`}
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
          </div>
        </div>

        {/* Post FAQs Block (with FAQPage Schema) */}
        {post.faqs && post.faqs.length > 0 && (
          <section id="frequently-asked-questions" className="space-y-4 pt-6 border-t border-slate-200 scroll-mt-20">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-sky-600" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {post.faqs.map((f, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1.5">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{f.q}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Northern Pakistan Travel Guides */}
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
            {((relatedBlogPostsMap[post.slug] || []).map((slug) => blogPosts.find((p) => p.slug === slug)).filter(Boolean) as typeof blogPosts).map((relPost) => (
              <Link
                key={relPost.slug}
                href={`/blog/${relPost.slug}`}
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

        {/* Back to Blog */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>
          <Link
            href="/about/editorial-policy"
            className="text-xs text-slate-400 hover:text-slate-600 transition"
          >
            Editorial Policy &amp; Standards →
          </Link>
        </div>
      </div>
    </article>
  );
}
