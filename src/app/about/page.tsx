import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import { Compass, ShieldCheck, Heart, Award, Target, Eye, BookOpen } from "lucide-react";
import { getSiteSettings } from "@/services/siteSettings.service";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "About Our Tour Marketplace",
  description:
    "Learn about PakistanTravel, our marketplace mission connecting travelers directly with independent local tour operators across northern Pakistan.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/about`,
    siteName: "PakistanTravel",
    title: "About Our Tour Marketplace",
    description:
      "Learn about PakistanTravel, our marketplace mission connecting travelers directly with independent local tour operators across northern Pakistan.",
    images: [
      {
        url: `${siteUrl}/images/og/home-og.jpg`,
        width: 1200,
        height: 630,
        alt: "PakistanTravel Marketplace and Mountain Hospitality",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Our Tour Marketplace",
    description:
      "Learn about PakistanTravel, our marketplace mission connecting travelers directly with independent local tour operators across northern Pakistan.",
    images: [`${siteUrl}/images/og/home-og.jpg`],
  },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const about = settings.PAGE_ABOUT;

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
        name: "About Us",
        item: `${siteUrl}/about`,
      },
    ],
  };

  const publishedListingCount = await prisma.listing.count({
    where: { status: "PUBLISHED" },
  }).catch(() => 0);

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100">
            <Compass className="w-4 h-4" /> Multi-Vendor Tourism Marketplace
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {about.heading}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {about.subheading}
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-lg">Our Mission</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {about.mission}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-lg">Our Vision</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {about.vision}
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">About the Marketplace</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {about.story}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">Independent Tour Operators</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Independent local tour operators manage their tour packages and itineraries directly. Credentials, where provided, are submitted by operators.{" "}
              <Link href="/partner-info" className="text-sky-600 underline font-medium">Read partner guidelines</Link>.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">Clear Booking Process</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time booking management ensures your reservation request is delivered to the operator with clear confirmation milestones.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">Local Empowerment</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We empower indigenous mountain tour guides and local family-run lodges by connecting them directly with travelers across Pakistan.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-sky-600 to-teal-600 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to explore Pakistan?</h2>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto">
            From the world&apos;s second-highest plateau at Deosai to the turquoise waters of Attabad Lake.
          </p>
          <div className="pt-2">
            <Link
              href="/search"
              className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition shadow-lg inline-block"
            >
              {publishedListingCount > 0
                ? `Browse All ${publishedListingCount} Expeditions`
                : "Explore Destinations"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
