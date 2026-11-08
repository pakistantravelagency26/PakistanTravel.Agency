import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDbListing } from "@/services/serverListing.service";
import { SITE_URL, siteConfig } from "@/config/site";
import { MapPin, Calendar, Star, ShieldCheck, ChevronRight, Compass } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Northern Pakistan Tours & Guided Treks | PakistanTravel.Agency",
  description:
    "Book verified guided tours, K2 base camp treks, and seasonal holiday packages across Hunza, Skardu, Fairy Meadows, and Swat directly from local operators.",
  alternates: {
    canonical: `${SITE_URL}/tours`,
  },
  openGraph: {
    title: "Northern Pakistan Tours & Guided Treks | PakistanTravel.Agency",
    description:
      "Curated tour packages and guided mountain expeditions in northern Pakistan with transparent pricing and verified local hosts.",
    url: `${SITE_URL}/tours`,
    siteName: siteConfig.name,
    locale: "en_PK",
    type: "website",
  },
};

export default async function ToursPage() {
  let listings: any[] = [];
  try {
    const rawListings = await prisma.listing.findMany({
      where: {
        type: "TOUR",
        status: "PUBLISHED",
        vendor: { status: "VERIFIED" },
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
    console.error("Failed to load tour listings:", err);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: listings.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TouristTrip",
        name: item.title,
        description: item.description,
        url: `${SITE_URL}/listing/${item.slug}`,
        image: item.photos[0],
        offers: {
          "@type": "Offer",
          price: item.basePrice,
          priceCurrency: "PKR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tours",
        item: `${SITE_URL}/tours`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="min-h-screen bg-slate-50 pb-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#0A5C36] to-[#074729] text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
              <Link href="/" className="hover:underline">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Tours &amp; Treks</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Northern Pakistan Tours &amp; Expeditions
            </h1>
            <p className="text-emerald-100 max-w-2xl text-sm sm:text-base leading-relaxed">
              Explore curated guided tours, cultural road trips, and mountain treks across Gilgit-Baltistan and Khyber Pakhtunkhwa. All departures run by verified independent operators with guaranteed departures.
            </p>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-[#0A5C36]" />
              <span>Featured Tour Packages ({listings.length})</span>
            </h2>
          </div>

          {listings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
              <p className="text-slate-600 font-semibold">
                No active tour departures currently scheduled. Operators are uploading new spring &amp; summer itineraries.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 rounded-xl bg-[#0A5C36] text-white font-bold text-sm hover:bg-[#074729] transition"
              >
                Back to Home
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
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#0A5C36] shadow-sm flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.vendor?.businessName || "Verified Operator"}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.destinationName}</span>
                        {item.duration && (
                          <>
                            <span>•</span>
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.duration}</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#0A5C36] transition line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Starting From</span>
                        <div className="text-lg font-black text-slate-900">
                          PKR {item.basePrice.toLocaleString()}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#0A5C36] group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
