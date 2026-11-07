import type { Metadata } from "next";
import { getActiveDbListings } from "@/services/serverListing.service";
import { SearchClientView } from "@/components/search/SearchClientView";

export const revalidate = 60;

interface SearchPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pakistan-travel-agency.vercel.app";
  const filterKeys = Object.keys(searchParams || {}).filter(
    (k) => searchParams?.[k] !== undefined && searchParams?.[k] !== ""
  );
  const isFiltered = filterKeys.length > 0;

  return {
    title: "Search Tours, Hotels & Mountain Expeditions in Pakistan",
    description: "Search and compare verified travel packages, guided tours in Hunza, Skardu, Swat, and Kumrat, luxury mountain hotels, and 4x4 rentals across Pakistan.",
    alternates: {
      canonical: `${siteUrl}/search`,
      languages: {
        "en-PK": `${siteUrl}/search`,
        "ur-PK": `${siteUrl}/ur/search`,
      },
    },
    robots: {
      index: !isFiltered,
      follow: true,
    },
    openGraph: {
      title: "Search Tours, Hotels & Mountain Expeditions in Pakistan",
      description: "Search and compare verified travel packages, guided tours in Hunza, Skardu, Swat, and Kumrat, luxury mountain hotels, and 4x4 rentals across Pakistan.",
      url: `${siteUrl}/search`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Search Tours, Hotels & Mountain Expeditions in Pakistan",
      description: "Search and compare verified travel packages, guided tours in Hunza, Skardu, Swat, and Kumrat, luxury mountain hotels, and 4x4 rentals across Pakistan.",
    },
  };
}

export default async function SearchPage() {
  const initialListings = await getActiveDbListings();

  return <SearchClientView initialListings={initialListings} />;
}
