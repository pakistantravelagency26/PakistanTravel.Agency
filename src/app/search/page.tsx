import type { Metadata } from "next";
import { getActiveDbListings } from "@/services/serverListing.service";
import { SearchClientView } from "@/components/search/SearchClientView";

export const revalidate = 60;

interface SearchPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pakistantravel-agency.vercel.app";

  return {
    title: "Search Tours, Hotels & Mountain Expeditions",
    description:
      "Search and compare travel packages, guided tours in Hunza, Skardu, Swat, and Kumrat, luxury mountain hotels, and 4x4 rentals across Pakistan.",
    alternates: {
      canonical: `${siteUrl}/search`,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: `${siteUrl}/search`,
      siteName: "PakistanTravel",
      title: "Search Tours, Hotels & Mountain Expeditions",
      description:
        "Search and compare travel packages, guided tours in Hunza, Skardu, Swat, and Kumrat, luxury mountain hotels, and 4x4 rentals across Pakistan.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
          width: 1200,
          height: 630,
          alt: "Search Tours and Stays across Northern Pakistan",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Search Tours, Hotels & Mountain Expeditions",
      description:
        "Search and compare travel packages, guided tours in Hunza, Skardu, Swat, and Kumrat, luxury mountain hotels, and 4x4 rentals across Pakistan.",
      images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"],
    },
  };
}

export default async function SearchPage() {
  const initialListings = await getActiveDbListings();

  return <SearchClientView initialListings={initialListings} />;
}
