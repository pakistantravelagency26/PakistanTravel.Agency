import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDbListing } from "@/services/serverListing.service";
import { SITE_URL, siteConfig } from "@/config/site";
import { MapPin, Building2, ShieldCheck, ChevronRight } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Hotels, Resorts & Luxury Stays in Northern Pakistan | PakistanTravel.Agency",
  description:
    "Find boutique hotels, alpine glamping domes, and traditional heritage guest houses across Hunza, Skardu, Gilgit, and Swat valley with transparent rates.",
  alternates: {
    canonical: `${SITE_URL}/hotels`,
  },
  openGraph: {
    title: "Hotels & Mountain Resorts in Northern Pakistan | PakistanTravel.Agency",
    description:
      "Handpicked mountain hotels, resorts, and riverfront lodges in Gilgit-Baltistan and Khyber Pakhtunkhwa.",
    url: `${SITE_URL}/hotels`,
    siteName: siteConfig.name,
    locale: "en_PK",
    type: "website",
  },
};

export default async function HotelsPage() {
  let listings: any[] = [];
  try {
    const rawListings = await prisma.listing.findMany({
      where: {
        type: "HOTEL",
        status: "PUBLISHED",
        vendor: { status: "VERIFIED" },
      },
      include: {
        vendor: true,
        destination: true,
        units: true,
        reviews: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    listings = rawListings.map(formatDbListing);
  } catch (err) {
    console.error("Failed to load hotel listings:", err);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: listings.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Hotel",
        name: item.title,
        description: item.description,
        url: `${SITE_URL}/listing/${item.slug}`,
        image: item.photos[0],
        address: {
          "@type": "PostalAddress",
          addressLocality: item.city,
          addressRegion: item.province,
          addressCountry: "PK",
        },
        priceRange: `PKR ${item.basePrice}`,
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
        name: "Hotels",
        item: `${SITE_URL}/hotels`,
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
        <div className="bg-gradient-to-b from-[#0A5C36] to-[#074729] text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
              <Link href="/" className="hover:underline">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Hotels &amp; Resorts</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Hotels &amp; Resorts in Northern Pakistan
            </h1>
            <p className="text-emerald-100 max-w-2xl text-sm sm:text-base leading-relaxed">
              Find boutique chalets, glamping domes, and scenic mountain hotels in Hunza, Skardu, Swat, and Fairy Meadows. Direct reservations backed by verified local hosts.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#0A5C36]" />
              <span>Available Accommodations ({listings.length})</span>
            </h2>
          </div>

          {listings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
              <p className="text-slate-600 font-semibold">
                No active hotel rooms currently listed for direct booking. Local property owners are updating room inventories.
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
                      <span>{item.vendor?.businessName || "Verified Host"}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.destinationName}</span>
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#0A5C36] transition line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Rate Per Night</span>
                        <div className="text-lg font-black text-slate-900">
                          PKR {item.basePrice.toLocaleString()}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#0A5C36] group-hover:underline">
                        Book Room →
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
