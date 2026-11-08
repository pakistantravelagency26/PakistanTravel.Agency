import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, ArrowRight, Sparkles } from "lucide-react";
import { blogPosts } from "@/data/blogData";
import { getSiteSettings, type PageBlogSettings } from "@/services/siteSettings.service";

export const revalidate = 60;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Northern Pakistan Travel Blog & Guides",
  description:
    "Explore expert travel guides, seasonal itineraries, budgeting breakdowns, and packing tips for touring Hunza, Skardu, Swat, and Kumrat.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/blog`,
    siteName: "PakistanTravel",
    title: "Northern Pakistan Travel Blog & Guides",
    description:
      "Explore expert travel guides, seasonal itineraries, budgeting breakdowns, and packing tips for touring Hunza, Skardu, Swat, and Kumrat.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200",
        width: 1200,
        height: 630,
        alt: "PakistanTravel Northern Expeditions and Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Northern Pakistan Travel Blog & Guides",
    description:
      "Explore expert travel guides, seasonal itineraries, budgeting breakdowns, and packing tips for touring Hunza, Skardu, Swat, and Kumrat.",
    images: ["https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200"],
  },
};

export default async function BlogIndexPage() {
  const settings: PageBlogSettings = await getSiteSettings("PAGE_BLOG");

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
    ],
  };

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "PakistanTravel.Agency Travel Blog",
    description: "Expert northern Pakistan travel guides, cost breakdowns, and seasonal advice.",
    url: `${siteUrl}/blog`,
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      datePublished: post.date,
      url: `${siteUrl}/blog/${post.slug}`,
      image: post.coverImage,
      author: {
        "@type": "Person",
        name: post.author.name,
      },
    })),
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>{settings.badgeText || "Northern Travel Insights & Guides"}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {settings.heading || "Pakistan Travel Blog & Expeditions"}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {settings.subheading || "Essential trip planning advice, real seasonal costs, route conditions, and gear checklists curated by certified mountain guides."}
          </p>
        </div>

        {/* Featured Post Card (First Article) */}
        {blogPosts.length > 0 && (
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-0 group">
            <div className="relative h-64 sm:h-80 lg:h-auto lg:col-span-7 overflow-hidden bg-slate-100">
              <Image
                src={blogPosts[0].coverImage}
                alt={blogPosts[0].coverAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {blogPosts[0].category}
              </span>
            </div>

            <div className="p-6 sm:p-10 lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {blogPosts[0].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {blogPosts[0].readTime}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-sky-600 transition leading-snug">
                  <Link href={`/blog/${blogPosts[0].slug}`}>
                    {blogPosts[0].title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                    {blogPosts[0].author.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{blogPosts[0].author.name}</span>
                    <span className="text-[10px] text-slate-500">{blogPosts[0].author.role}</span>
                  </div>
                </div>

                <Link
                  href={`/blog/${blogPosts[0].slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Remaining Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article
              key={post.slug}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
            >
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                <Image
                  src={post.coverImage}
                  alt={post.coverAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">
                    By {post.author.name}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-bold text-sky-600 group-hover:text-sky-700 flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
