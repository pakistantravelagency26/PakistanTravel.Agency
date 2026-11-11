import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { 
  ChevronRight, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Compass, 
  HelpCircle, 
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { tourIntentsData } from "@/data/tourIntentsData";
import { destinationsData } from "@/data/destinationData";
import { prisma } from "@/lib/prisma";
import { formatDbListing } from "@/services/serverListing.service";
import { CustomTripRequestForm } from "@/components/tours/CustomTripRequestForm";

export const revalidate = 60;

export async function generateStaticParams() {
  return Object.keys(tourIntentsData).map((slug) => ({ intent: slug }));
}

interface TourIntentPageProps {
  params: {
    intent: string;
  };
}

export async function generateMetadata({ params }: TourIntentPageProps): Promise<Metadata> {
  const intent = tourIntentsData[params.intent];
  const siteUrl = SITE_URL;

  if (!intent) {
    return {
      title: "Tour Packages Not Found | PakistanTravel",
      description: "Compare and book guided northern Pakistan tour packages across Hunza, Skardu, Swat, and Kumrat.",
    };
  }

  // Count published tours for this intent to determine robots indexing
  let count = 0;
  try {
    count = await prisma.listing.count({
      where: {
        type: "TOUR",
        status: "PUBLISHED",
        
        ...(intent.destinationSlug ? { destination: { slug: intent.destinationSlug } } : {}),
      },
    });
  } catch (err) {
    console.warn("Prisma count fallback for intent metadata:", err);
  }

  const canonicalUrl = `${siteUrl}/tours/${intent.slug}`;

  return {
    title: intent.seoTitle,
    description: intent.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    // If 0 published tours exist, set noindex to protect search quality
    robots: count === 0 ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: canonicalUrl,
      siteName: "PakistanTravel",
      title: `${intent.seoTitle} | PakistanTravel`,
      description: intent.metaDescription,
      images: [
        {
          url: `${siteUrl}/images/og/home-og.jpg`,
          width: 1200,
          height: 630,
          alt: `${intent.title} in Northern Pakistan`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${intent.seoTitle} | PakistanTravel`,
      description: intent.metaDescription,
      images: [`${siteUrl}/images/og/home-og.jpg`],
    },
  };
}

export default async function TourIntentPage({ params }: TourIntentPageProps) {
  const intent = tourIntentsData[params.intent];
  const siteUrl = SITE_URL;

  if (!intent) {
    notFound();
  }

  let listings: any[] = [];
  try {
    const rawListings = await prisma.listing.findMany({
      where: {
        type: "TOUR",
        status: "PUBLISHED",
        
        ...(intent.destinationSlug ? { destination: { slug: intent.destinationSlug } } : {}),
      },
      include: {
        vendor: true,
        destination: true,
        units: true,
        departures: { orderBy: { startDate: "asc" } },
        reviews: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    listings = rawListings.map(formatDbListing);
  } catch (err) {
    console.error("Failed to load tour intent listings:", err);
  }

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
        name: "Tour Packages",
        item: `${siteUrl}/tours`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: intent.title,
        item: `${siteUrl}/tours/${intent.slug}`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: intent.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const relatedDestinations = Object.values(destinationsData).slice(0, 6);

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/tours" className="hover:text-white transition">Tours</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold truncate max-w-[240px]">{intent.title}</span>
          </nav>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Mountain Itineraries</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            {intent.h1}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {intent.metaDescription}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Server-Rendered Editorial Intro (200-300 words) */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              About Our {intent.title}
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            {intent.introText.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </section>

        {/* Listings Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
                Available Packages
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {listings.length > 0 ? `Featured ${intent.title} (${listings.length})` : `Browse ${intent.title}`}
              </h2>
            </div>
          </div>

          {listings.length === 0 ? (
            /* 0 Published Tours State: Shows Request Form Prominently */
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  New Seasonal Packages Are Being Onboarded
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Local operators are currently updating their 2026 departure dates and itineraries for {intent.title.toLowerCase()}. Submit a custom trip request below to receive custom proposals directly from verified operators.
                </p>
              </div>

              {/* Prominent Custom Trip Request Form */}
              <CustomTripRequestForm defaultDestination={intent.destinationSlug || ""} />
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
                    {item.photos?.[0] ? (
                      <Image
                        src={item.photos[0]}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No image available
                      </div>
                    )}
                    <span className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-400" />
                      <span>{item.duration || "Multi-Day Tour"}</span>
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-[11px] text-sky-600 font-semibold">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{item.city}, {item.province}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.vendor.businessName}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">From / Person</span>
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

        {/* Custom Trip Request Form (when listings are present) */}
        {listings.length > 0 && (
          <section className="space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Tailored Planning</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Need a Custom Itinerary?</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Submit your travel dates and group preferences to receive custom quotes directly from local operators.
              </p>
            </div>
            <CustomTripRequestForm defaultDestination={intent.destinationSlug || ""} />
          </section>
        )}

        {/* Related Destinations Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Explore Northern Destinations
            </h2>
            <Link href="/destinations" className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedDestinations.map((d) => (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                className="group p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-sky-300 hover:shadow-md transition text-center space-y-1"
              >
                <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto text-xs font-bold group-hover:bg-sky-600 group-hover:text-white transition">
                  {d.name.charAt(0)}
                </div>
                <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-sky-600 transition truncate">
                  {d.name}
                </h3>
                <span className="text-[10px] text-slate-400 block truncate">{d.province}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQs Section with FAQPage Schema */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-600" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions About {intent.title}
            </h2>
          </div>

          <div className="space-y-3">
            {intent.faqs.map((f, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-1.5">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{f.q}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
