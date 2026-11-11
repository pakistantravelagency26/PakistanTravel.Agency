import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Calendar,
  Search,
  ShieldCheck,
  Sparkles,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { getActiveDbListings } from "@/services/serverListing.service";
import { TourMarketplaceSection } from "@/components/home/TourMarketplaceSection";
import { getSiteSettings } from "@/services/siteSettings.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: {
    absolute: "Northern Pakistan Tour Marketplace | PakistanTravel",
  },
  description:
    "Book northern Pakistan tours from independent local operators with departures from Islamabad, Lahore, and Karachi to Hunza, Skardu, and Swat.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "PakistanTravel",
    title: "Northern Pakistan Tour Marketplace | PakistanTravel",
    description:
      "Book northern Pakistan tours from independent local operators with departures from Islamabad, Lahore, and Karachi to Hunza, Skardu, and Swat.",
    images: [
      {
        url: `${siteUrl}/images/og/home-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Northern Pakistan Karakoram Mountain Landscape and Tour Valley",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Northern Pakistan Tour Marketplace | PakistanTravel",
    description:
      "Book northern Pakistan tours from independent local operators with departures from Islamabad, Lahore, and Karachi to Hunza, Skardu, and Swat.",
    images: [`${siteUrl}/images/og/home-og.jpg`],
  },
};

export default async function HomePage() {
  let listings: any[] = [];
  try {
    listings = await getActiveDbListings();
  } catch (err) {
    console.error("[HomePage] Active DB listings query error:", err);
  }
  const settings = await getSiteSettings();
  const hero = settings.HERO;
  const announcement = settings.ANNOUNCEMENT;

  // Filter dropdown destinations strictly by real available tour listings
  const activeDestinationSlugs = new Set(listings.map((l) => l.destinationSlug));

  const allDestinations = [
    { slug: "hunza", label: "Hunza Valley & Attabad" },
    { slug: "skardu", label: "Skardu & Deosai Plains" },
    { slug: "kumrat", label: "Kumrat Valley & Dir" },
    { slug: "swat", label: "Swat & Kalam" },
    { slug: "neelum", label: "Neelum Valley" },
    { slug: "murree", label: "Murree & Galyat" },
  ];

  const availableDestinations = allDestinations.filter(
    (d) => activeDestinationSlugs.size === 0 || activeDestinationSlugs.has(d.slug)
  );

  return (
    <div className="space-y-12 pb-20 bg-slate-50/50">
      {/* Dynamic Top Announcement Banner */}
      {announcement?.isEnabled && announcement?.text && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white text-xs py-2.5 px-4 text-center font-semibold shadow-sm flex items-center justify-center gap-2">
          <span>{announcement.text}</span>
          {announcement.linkUrl && (
            <Link
              href={announcement.linkUrl}
              className="underline font-bold hover:text-white/80 transition ml-1"
            >
              {announcement.linkText || "Learn More →"}
            </Link>
          )}
        </div>
      )}

      {/* Light & Modern Hero Banner */}
      <section className="relative pt-12 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50/80 via-white to-slate-50">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-sky-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>{hero?.badgeText || "Northern Pakistan Tour Operator Marketplace"}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            {hero?.title || "Discover Pakistan's Majestic Mountains & Valleys"}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {hero?.subtitle || "Compare and book guided tour packages directly from independent local operators across northern Pakistan."}
          </p>
        </div>

        {/* Clean Floating Search Bar */}
        <div className="max-w-4xl mx-auto mt-10">
          <form
            action="/tours"
            method="GET"
            className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-3"
          >
            {/* Destination */}
            <div className="md:col-span-6 bg-slate-50 hover:bg-slate-100/70 transition rounded-2xl px-4 py-3 flex items-center gap-3 text-slate-800 border border-slate-100">
              <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
              <div className="w-full text-left">
                <label htmlFor="destination-select" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Where in Pakistan?</label>
                <select
                  id="destination-select"
                  name="destination"
                  className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 outline-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="">All Northern Destinations</option>
                  {availableDestinations.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Travel Date */}
            <div className="md:col-span-3 bg-slate-50 hover:bg-slate-100/70 transition rounded-2xl px-4 py-3 flex items-center gap-3 text-slate-800 border border-slate-100">
              <Calendar className="w-5 h-5 text-teal-600 shrink-0" />
              <div className="w-full text-left">
                <label htmlFor="travel-date-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">When?</label>
                <input
                  id="travel-date-input"
                  type="date"
                  name="date"
                  className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-3 flex items-center">
              <button
                type="submit"
                className="w-full h-full min-h-[52px] bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Search className="w-4 h-4" />
                <span>Search Tours</span>
              </button>
            </div>
          </form>
        </div>

        {/* Confidence Badges */}
        <div className="max-w-4xl mx-auto mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-600">
          <Link href="/partner-info" className="flex items-center gap-3 hover:opacity-80 transition group">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block group-hover:text-emerald-700">
                {hero?.badge1Title || "Independent Local Tour Operators"}
              </span>
              <span className="text-[11px] text-slate-400">
                {hero?.badge1Sub || "Regional Partner Network · Partner Information"}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                {hero?.badge2Title || "JazzCash & EasyPaisa"}
              </span>
              <span className="text-[11px] text-slate-400">
                {hero?.badge2Sub || "Plus Credit Cards & Bank Transfer"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                {hero?.badge3Title || "Customer Support Desk"}
              </span>
              <span className="text-[11px] text-slate-400">
                {hero?.badge3Sub || "24/7 AI Chat · Email Desk Mon-Sat"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Multi-Vendor Marketplace Catalog */}
      <TourMarketplaceSection 
        initialListings={listings} 
        customSettings={settings.MARKETPLACE_SECTION} 
      />
    </div>
  );
}
