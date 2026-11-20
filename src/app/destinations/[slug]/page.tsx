export const dynamicParams = false;
import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Compass, 
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { destinationsData } from "@/data/destinationData";
import { prisma } from "@/lib/prisma";
import { defaultTravelCosts, resolveTravelCosts, travelCostsKey } from "@/config/travelCosts";
import { formatDbListing } from "@/services/serverListing.service";
import { ListingData } from "@/services/listing.service";

export const revalidate = 60;

export async function generateStaticParams() {
  return Object.keys(destinationsData).map((slug) => ({ slug }));
}

interface DestinationPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const dest = destinationsData[params.slug];
  const siteUrl = SITE_URL;

  if (!dest) {
    return {
      title: "Destination Not Found | Pakistan Travel Agency",
      description: "Compare and book guided northern Pakistan tour packages across Hunza, Skardu, Swat, and Kumrat.",
    };
  }

  const canonicalUrl = `${siteUrl}/destinations/${dest.slug}`;
  const ogImageUrl = `${siteUrl}/og?title=${encodeURIComponent(dest.name + " Travel Guide")}&category=DESTINATION&subtitle=${encodeURIComponent((dest.tagline || dest.name) + " • " + dest.province)}`;

  return {
    title: dest.seoTitle,
    description: dest.seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: canonicalUrl,
      siteName: "PakistanTravel",
      title: dest.seoTitle,
      description: dest.seoDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${dest.name} northern Pakistan scenery`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dest.seoTitle,
      description: dest.seoDescription,
      images: [ogImageUrl],
    },
  };
}


const destinationTourIntentMap: Record<string, string> = {
  hunza: "/tours/hunza-tour-packages",
  skardu: "/tours/skardu-tour-packages",
  swat: "/tours/swat-tour-packages",
  kumrat: "/tours/kumrat-tour-packages",
  neelum: "/tours/neelum-tour-packages",
  "fairy-meadows": "/tours/fairy-meadows-tours",
  gilgit: "/tours/gilgit-baltistan-tour-packages",
  naltar: "/tours/gilgit-baltistan-tour-packages",
  astore: "/tours/gilgit-baltistan-tour-packages",
};

const relatedDestinationsMap: Record<string, { slug: string; name: string; province: string }[]> = {
  hunza: [
    { slug: "gilgit", name: "Gilgit Valley", province: "Gilgit-Baltistan" },
    { slug: "naltar", name: "Naltar Valley", province: "Gilgit-Baltistan" },
    { slug: "skardu", name: "Skardu & Deosai", province: "Gilgit-Baltistan" },
  ],
  skardu: [
    { slug: "hunza", name: "Hunza Valley", province: "Gilgit-Baltistan" },
    { slug: "astore", name: "Astore & Rama", province: "Gilgit-Baltistan" },
    { slug: "gilgit", name: "Gilgit Valley", province: "Gilgit-Baltistan" },
  ],
  swat: [
    { slug: "kumrat", name: "Kumrat Valley", province: "Khyber Pakhtunkhwa" },
    { slug: "shogran-siri-paye", name: "Shogran & Siri Paye", province: "Khyber Pakhtunkhwa" },
    { slug: "chitral-kalash", name: "Chitral & Kalash", province: "Khyber Pakhtunkhwa" },
  ],
  kumrat: [
    { slug: "swat", name: "Swat Valley", province: "Khyber Pakhtunkhwa" },
    { slug: "chitral-kalash", name: "Chitral & Kalash", province: "Khyber Pakhtunkhwa" },
    { slug: "naran-kaghan", name: "Naran Kaghan", province: "Khyber Pakhtunkhwa" },
  ],
  murree: [
    { slug: "naran-kaghan", name: "Naran Kaghan", province: "Khyber Pakhtunkhwa" },
    { slug: "shogran-siri-paye", name: "Shogran & Siri Paye", province: "Khyber Pakhtunkhwa" },
    { slug: "neelum", name: "Neelum Valley", province: "Azad Kashmir" },
  ],
  neelum: [
    { slug: "murree", name: "Murree & Galyat", province: "Punjab" },
    { slug: "naran-kaghan", name: "Naran Kaghan", province: "Khyber Pakhtunkhwa" },
    { slug: "shogran-siri-paye", name: "Shogran & Siri Paye", province: "Khyber Pakhtunkhwa" },
  ],
  "fairy-meadows": [
    { slug: "astore", name: "Astore & Rama", province: "Gilgit-Baltistan" },
    { slug: "gilgit", name: "Gilgit Valley", province: "Gilgit-Baltistan" },
    { slug: "hunza", name: "Hunza Valley", province: "Gilgit-Baltistan" },
  ],
  "naran-kaghan": [
    { slug: "shogran-siri-paye", name: "Shogran & Siri Paye", province: "Khyber Pakhtunkhwa" },
    { slug: "neelum", name: "Neelum Valley", province: "Azad Kashmir" },
    { slug: "murree", name: "Murree & Galyat", province: "Punjab" },
  ],
  naltar: [
    { slug: "gilgit", name: "Gilgit Valley", province: "Gilgit-Baltistan" },
    { slug: "hunza", name: "Hunza Valley", province: "Gilgit-Baltistan" },
    { slug: "fairy-meadows", name: "Fairy Meadows", province: "Gilgit-Baltistan" },
  ],
  astore: [
    { slug: "fairy-meadows", name: "Fairy Meadows", province: "Gilgit-Baltistan" },
    { slug: "skardu", name: "Skardu & Deosai", province: "Gilgit-Baltistan" },
    { slug: "gilgit", name: "Gilgit Valley", province: "Gilgit-Baltistan" },
  ],
  "chitral-kalash": [
    { slug: "swat", name: "Swat Valley", province: "Khyber Pakhtunkhwa" },
    { slug: "kumrat", name: "Kumrat Valley", province: "Khyber Pakhtunkhwa" },
    { slug: "gilgit", name: "Gilgit Valley", province: "Gilgit-Baltistan" },
  ],
  "shogran-siri-paye": [
    { slug: "naran-kaghan", name: "Naran Kaghan", province: "Khyber Pakhtunkhwa" },
    { slug: "swat", name: "Swat Valley", province: "Khyber Pakhtunkhwa" },
    { slug: "murree", name: "Murree & Galyat", province: "Punjab" },
  ],
  gilgit: [
    { slug: "hunza", name: "Hunza Valley", province: "Gilgit-Baltistan" },
    { slug: "naltar", name: "Naltar Valley", province: "Gilgit-Baltistan" },
    { slug: "fairy-meadows", name: "Fairy Meadows", province: "Gilgit-Baltistan" },
  ],
};

const relatedBlogGuidesMap: Record<string, { slug: string; title: string; category: string }[]> = {
  hunza: [
    { slug: "hunza-best-time-to-visit", title: "Best Time to Visit Hunza Valley: Cherry Blossom & Autumn", category: "Season Guide" },
    { slug: "skardu-vs-hunza", title: "Skardu vs Hunza: Which Northern Pakistan Valley Should You Choose?", category: "Comparison" },
  ],
  skardu: [
    { slug: "skardu-trip-cost-2026", title: "Skardu Trip Cost 2026: Complete Budget & Luxury Breakdown", category: "Cost Guide" },
    { slug: "skardu-vs-hunza", title: "Skardu vs Hunza: Which Northern Pakistan Valley Should You Choose?", category: "Comparison" },
  ],
  swat: [
    { slug: "kumrat-valley-route-tips", title: "Kumrat Valley Travel Guide: Route, 4x4 Road Conditions & Tips", category: "Route Tips" },
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
  ],
  kumrat: [
    { slug: "kumrat-valley-route-tips", title: "Kumrat Valley Travel Guide: Route, 4x4 Road Conditions & Tips", category: "Route Tips" },
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
  ],
  murree: [
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
    { slug: "hunza-best-time-to-visit", title: "Best Time to Visit Hunza Valley: Cherry Blossom & Autumn", category: "Season Guide" },
  ],
  neelum: [
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
    { slug: "kumrat-valley-route-tips", title: "Kumrat Valley Travel Guide: Route, 4x4 Road Conditions & Tips", category: "Route Tips" },
  ],
  "fairy-meadows": [
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
    { slug: "skardu-trip-cost-2026", title: "Skardu Trip Cost 2026: Complete Budget & Luxury Breakdown", category: "Cost Guide" },
  ],
  "naran-kaghan": [
    { slug: "kumrat-valley-route-tips", title: "Kumrat Valley Travel Guide: Route, 4x4 Road Conditions & Tips", category: "Route Tips" },
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
  ],
  naltar: [
    { slug: "hunza-best-time-to-visit", title: "Best Time to Visit Hunza Valley: Cherry Blossom & Autumn", category: "Season Guide" },
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
  ],
  astore: [
    { slug: "skardu-trip-cost-2026", title: "Skardu Trip Cost 2026: Complete Budget & Luxury Breakdown", category: "Cost Guide" },
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
  ],
  "chitral-kalash": [
    { slug: "kumrat-valley-route-tips", title: "Kumrat Valley Travel Guide: Route, 4x4 Road Conditions & Tips", category: "Route Tips" },
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
  ],
  "shogran-siri-paye": [
    { slug: "northern-pakistan-packing-list", title: "Northern Pakistan Packing List: What to Bring for Mountain Tours", category: "Packing Guide" },
    { slug: "kumrat-valley-route-tips", title: "Kumrat Valley Travel Guide: Route, 4x4 Road Conditions & Tips", category: "Route Tips" },
  ],
  gilgit: [
    { slug: "hunza-best-time-to-visit", title: "Best Time to Visit Hunza Valley: Cherry Blossom & Autumn", category: "Season Guide" },
    { slug: "skardu-trip-cost-2026", title: "Skardu Trip Cost 2026: Complete Budget & Luxury Breakdown", category: "Cost Guide" },
  ],
};

export default async function DestinationDetailPage({ params }: DestinationPageProps) {
  const dest = destinationsData[params.slug];
  const siteUrl = SITE_URL;

  if (!dest) {
    notFound();
  }

  let travelCosts = defaultTravelCosts(dest.approximateCosts);
  try {
    const record = await prisma.siteSetting.findUnique({ where: { key: travelCostsKey(dest.slug) } });
    travelCosts = resolveTravelCosts(travelCosts, record?.value);
  } catch (error) {
    console.error("Could not load destination travel costs:", error);
  }

  // Fetch real database listings for this destination
  let listings: ListingData[] = [];
  try {
    const dbListings = await prisma.listing.findMany({
      where: {
        status: "PUBLISHED",
        destination: { slug: dest.slug },
      },
      include: {
        vendor: true,
        destination: true,
        units: true,
        reviews: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    listings = dbListings.map(formatDbListing);
  } catch (err) {
    console.warn("DB destination query fallback:", err);
  }

  // JSON-LD Schemas: TouristDestination, BreadcrumbList, FAQPage
  const touristDestinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: dest.name,
    description: dest.seoDescription,
    image: dest.heroImage,
    touristType: ["Adventure Tourism", "Eco Tourism", "Cultural Tourism"],
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: dest.province,
      addressCountry: "PK",
    },
  };

  const breadcrumbSchema = {
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
        name: "Destinations",
        item: `${siteUrl}/destinations`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: dest.name,
        item: `${siteUrl}/destinations/${dest.slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dest.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristDestinationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative h-[480px] sm:h-[540px] w-full flex items-end">
        <Image
          src={dest.heroImage}
          alt={`${dest.name} scenic landscape in ${dest.province}`}
          fill
          priority
          sizes="(max-width: 1600px) 100vw, 1600px"
          quality={75}
          className="object-cover brightness-[0.75]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-white space-y-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-bold">{dest.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>{dest.province}, Pakistan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
            {dest.name} Travel &amp; Tour Guide
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl font-normal leading-relaxed">
            {dest.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
            <span className="inline-flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Last updated: November 2026 · PakistanTravel Editorial Desk</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 text-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Rates and travel durations are seasonal estimates</span>
            </span>
          </div>
        </div>
      </section>

      {/* Content Body Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Key Travel Facts Panel */}
        {dest.keyFacts && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Altitude</span>
              <p className="text-sm font-extrabold text-slate-900">{dest.keyFacts.altitude}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Best Travel Season</span>
              <p className="text-sm font-extrabold text-slate-900">{dest.keyFacts.bestSeason}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Distance from Islamabad</span>
              <p className="text-sm font-extrabold text-slate-900">{dest.keyFacts.distanceFromIslamabad}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Road Condition</span>
              <p className="text-sm font-extrabold text-slate-900">{dest.keyFacts.roadCondition}</p>
            </div>
          </div>
        )}

        {/* Section 1: Comprehensive Editorial Overview (500+ Words) */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-primary" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              About &amp; Geography of {dest.name}
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            {dest.overview.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </section>

        {/* Section 2: Best Time to Visit & Seasonal Guide */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Best Time to Visit {dest.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Peak Summer
              </span>
              <h3 className="font-extrabold text-base text-slate-900">{dest.bestTimeToVisit.peakSeason}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{dest.bestTimeToVisit.peakDescription}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                Golden Autumn
              </span>
              <h3 className="font-extrabold text-base text-slate-900">{dest.bestTimeToVisit.shoulderSeason}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{dest.bestTimeToVisit.shoulderDescription}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primaryDark bg-brand-primaryLight px-2.5 py-1 rounded-full">
                Winter &amp; Blossom
              </span>
              <h3 className="font-extrabold text-base text-slate-900">{dest.bestTimeToVisit.offSeason}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{dest.bestTimeToVisit.offDescription}</p>
            </div>
          </div>
        </section>

        {/* Section 3: Approximate Travel Costs (PKR Budget vs Luxury) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {travelCosts.heading}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Backpacker / Budget</span>
                <p className="text-2xl font-black text-slate-900">{travelCosts.budgetPerDay}</p>
                <p className="text-[11px] text-slate-500">{travelCosts.budgetDescription}</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Comfort / Mid-Range</span>
                <p className="text-2xl font-black text-emerald-950">{travelCosts.midRangePerDay}</p>
                <p className="text-[11px] text-emerald-800">{travelCosts.midRangeDescription}</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Luxury Heritage Tour Tier</span>
                <p className="text-2xl font-black text-white">{travelCosts.luxuryPerDay}</p>
                <p className="text-[11px] text-slate-300">{travelCosts.luxuryDescription}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Pricing Disclaimer:</strong> {travelCosts.notes} Confirm current rates directly with operators before booking.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Top Attractions & Landmarks */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Top Attractions &amp; Highlights in {dest.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {dest.topAttractions.map((att, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-brand-primaryDark flex items-center justify-center text-xs font-black">
                  {idx + 1}
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">{att.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{att.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Available Tour Packages */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block">
                Available Guided Tours
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Tour Packages in {dest.name}
              </h2>
            </div>
            <Link
              href={destinationTourIntentMap[dest.slug] || `/tours?destination=${dest.slug}`}
              className="text-xs font-bold text-brand-primary hover:text-brand-primaryDark hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View all {dest.name} tour packages</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
              <p className="text-sm font-bold text-slate-700">
                New seasonal tour packages for {dest.name} are currently being onboarded by local operators.
              </p>
              <Link
                href="/tours"
                className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Browse All Northern Tour Packages →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <Link
                  key={item.id}
                  href={`/listing/${item.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.photos[0]}
                      alt={`${item.title} - ${dest.name}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-400" />
                      <span>{item.duration || "Multi-Day Tour"}</span>
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-[11px] text-brand-primary font-semibold">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{item.city}, {item.province}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-primary transition line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.vendor.businessName}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        From / Person
                      </span>
                      <span className="text-base font-extrabold text-slate-900">
                        PKR {item.basePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Section 6: Frequently Asked Questions (with FAQPage Schema) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-primary" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions About {dest.name}
            </h2>
          </div>

          <div className="space-y-4">
            {dest.faqs.map((f, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{f.q}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
        {/* Section 7: Nearby & Related Destinations */}
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block">
                Regional Exploration
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Nearby &amp; Related Destinations
              </h2>
            </div>
            <Link
              href="/destinations"
              className="text-xs font-bold text-brand-primary hover:text-brand-primaryDark hover:underline flex items-center gap-1"
            >
              <span>All 13 Destinations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(relatedDestinationsMap[dest.slug] || []).map((rel) => (
              <Link
                key={rel.slug}
                href={`/destinations/${rel.slug}`}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-purple-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                    {rel.province}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-brand-primary transition mt-1">
                    {rel.name}
                  </h3>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-primary mt-3">
                  <span>View destination guide</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 8: Related Travel Guides */}
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block">
                Editorial Guides
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Related Travel Guides &amp; Route Advice
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs font-bold text-brand-primary hover:text-brand-primaryDark hover:underline flex items-center gap-1"
            >
              <span>Explore All Guides</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(relatedBlogGuidesMap[dest.slug] || []).map((guide) => (
              <Link
                key={guide.slug}
                href={`/blog/${guide.slug}`}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-purple-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">
                    {guide.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-brand-primary transition mt-1 line-clamp-2">
                    {guide.title}
                  </h3>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-primary mt-3">
                  <span>Read travel guide</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}