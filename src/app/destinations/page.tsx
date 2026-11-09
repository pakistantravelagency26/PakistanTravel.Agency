import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Compass } from "lucide-react";
import { destinationsData } from "@/data/destinationData";
import { getSiteSettings, type PageDestinationsSettings } from "@/services/siteSettings.service";

export const revalidate = 60;

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Top Northern Pakistan Destinations",
  description:
    "Explore top tourist destinations in northern Pakistan including Hunza, Skardu, Swat, Kumrat, and Murree with seasonal travel advice.",
  alternates: {
    canonical: `${siteUrl}/destinations`,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: `${siteUrl}/destinations`,
    siteName: "PakistanTravel",
    title: "Top Northern Pakistan Destinations",
    description:
      "Explore top tourist destinations in northern Pakistan including Hunza, Skardu, Swat, Kumrat, and Murree with seasonal travel advice.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
        width: 1200,
        height: 630,
        alt: "Explore Northern Pakistan Travel Destinations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Northern Pakistan Destinations",
    description:
      "Explore top tourist destinations in northern Pakistan including Hunza, Skardu, Swat, Kumrat, and Murree with seasonal travel advice.",
    images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200"],
  },
};

export default async function DestinationsIndexPage() {
  const destinations = Object.values(destinationsData);
  const settings: PageDestinationsSettings = await getSiteSettings("PAGE_DESTINATIONS");

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
        name: "Destinations",
        item: `${siteUrl}/destinations`,
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold">
            <Compass className="w-3.5 h-3.5 text-orange-500" />
            <span>{settings.badgeText || "Discover Northern Pakistan"}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {settings.heading || "Top Travel Destinations in Pakistan"}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {settings.subheading || "Explore comprehensive destination guides, seasonal advice, approximate costs, and guided tours curated by local mountain experts."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
            >
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <Image
                  src={dest.heroImage}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                    {dest.province}
                  </span>
                  <h2 className="text-xl font-extrabold">{dest.name}</h2>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {dest.overview[0]}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-700">
                  <span>Explore Destination Guide</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
