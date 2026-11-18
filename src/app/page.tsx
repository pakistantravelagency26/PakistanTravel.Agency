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

export const revalidate = 60;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: {
    absolute: "Northern Pakistan Tour Marketplace | PakistanTravel",
  },
  description:
    "Book northern Pakistan tours from independent local operators with scheduled departures from Islamabad to Hunza, Skardu, and Swat at direct rates.",
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
      "Book northern Pakistan tours from independent local operators with scheduled departures from Islamabad to Hunza, Skardu, and Swat at direct rates.",
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
      "Book northern Pakistan tours from independent local operators with scheduled departures from Islamabad to Hunza, Skardu, and Swat at direct rates.",
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
    { slug: "swat", label: "Swat & Kalam" },
    { slug: "kumrat", label: "Kumrat Valley & Dir" },
    { slug: "fairy-meadows", label: "Fairy Meadows & Nanga Parbat" },
    { slug: "neelum", label: "Neelum Valley" },
    { slug: "naran-kaghan", label: "Naran Kaghan Valley" },
    { slug: "gilgit", label: "Gilgit & Karakoram Highway" },
    { slug: "astore", label: "Astore & Rama Meadows" },
    { slug: "chitral-kalash", label: "Chitral & Kalash Valleys" },
    { slug: "naltar", label: "Naltar Valley Lakes" },
    { slug: "shogran-siri-paye", label: "Shogran & Siri Paye" },
    { slug: "murree", label: "Murree & Galyat" },
  ];

  const availableDestinations = allDestinations.filter(
    (d) => activeDestinationSlugs.size === 0 || activeDestinationSlugs.has(d.slug)
  );

  return (
    <div className="space-y-12 pb-20 bg-brand-primaryLight">
      {/* Dynamic Top Announcement Banner */}
      {announcement?.isEnabled && announcement?.text && (
        <div className="bg-gradient-to-r from-brand-primaryDark via-brand-primary to-brand-primaryDark text-white text-xs py-2.5 px-4 text-center font-semibold shadow-sm flex items-center justify-center gap-2">
          <span>{listings.length > 0 ? `Autumn & Early Winter 2026 Season Booking Open across ${Array.from(new Set(listings.map((l: any) => l.destinationName || l.city))).join(", ")}!` : (announcement.text || "Explore Northern Pakistan Guided Tour Packages & Scheduled Departures")}</span>
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
      <section className="relative pt-12 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-navy via-brand-primaryDark to-brand-navy">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-brand-primaryDark text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>{hero?.badgeText || "Northern Pakistan Tour Operator Marketplace"}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {hero?.title || "Discover Pakistan's Majestic Mountains & Valleys"}
          </h1>

          <p className="text-sm sm:text-base text-purple-100 max-w-2xl mx-auto leading-relaxed">
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
              <MapPin className="w-5 h-5 text-brand-primary shrink-0" />
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
              <Calendar className="w-5 h-5 text-brand-primary shrink-0" />
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
                className="w-full h-full min-h-[52px] bg-gradient-to-r from-brand-primary to-brand-primary hover:from-brand-primaryDark hover:to-brand-primaryDark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
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
            <div className="w-9 h-9 rounded-xl bg-brand-primaryLight text-brand-primary flex items-center justify-center font-bold">
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

      {/* Popular Northern Pakistan Destinations Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block">
              Regional Destinations
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Popular Northern Pakistan Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore comprehensive destination travel guides across Gilgit-Baltistan, Khyber Pakhtunkhwa, and Azad Kashmir.
            </p>
          </div>
          <Link
            href="/destinations"
            className="text-xs font-bold text-brand-primary hover:text-brand-primaryDark hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Explore all 13 destination guides</span>
            <Compass className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {allDestinations.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="group p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-purple-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-900 group-hover:text-brand-primary transition block">
                  {dest.label}
                </span>
              </div>
              <span className="text-[10px] text-brand-primary font-semibold mt-2 flex items-center gap-0.5 group-hover:underline">
                View guide &amp; tours &rarr;
              </span>
            </Link>
          ))}
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
