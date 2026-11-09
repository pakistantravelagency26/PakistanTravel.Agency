import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ArrowLeft, ChevronRight, Share2, Compass, HelpCircle } from "lucide-react";
import { blogPosts } from "@/data/blogData";

export const revalidate = 60;

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
    return {
      title: "Article Not Found | Pakistan Travel Agency",
      description: "Explore northern Pakistan travel guides, itineraries, and expert booking advice.",
    };
  }

  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;

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
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1600,
          height: 900,
          alt: post.coverAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.metaDescription,
      images: [post.coverImage],
    },
  };
}

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
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
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
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <span className="font-bold text-slate-900 block">{post.author.name}</span>
                <span className="text-[11px] text-slate-400">{post.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
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
        {post.content.map((sec, idx) => (
          <section key={idx} className="space-y-4">
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
                {p}
              </p>
            ))}

            {sec.list && (
              <ul className="space-y-2.5 my-3 pl-2">
                {sec.list.map((item, lIdx) => (
                  <li key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0 mt-2"></span>
                    <span>{item}</span>
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

        {/* Call to action card */}
        <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Compass className="w-4 h-4" />
            <span>Ready for Adventure?</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">
            Explore Northern Tours with PakistanTravel.Agency
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Book guided expeditions in Hunza, Skardu, and Swat with local mountain operators, flexible cancellation, and digital voucher issuance.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
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
          </div>
        </div>

        {/* Back to Blog */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
