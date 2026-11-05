import type { Metadata } from "next";
import { getActiveDbListings } from "@/services/serverListing.service";
import { SearchClientView } from "@/components/search/SearchClientView";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Search Tours, Hotels & Mountain Expeditions in Pakistan",
  description: "Search and compare verified travel packages, guided tours in Hunza, Skardu, Swat, and Kumrat, luxury mountain hotels, and 4x4 rentals across Pakistan.",
  keywords: [
    "Pakistan tours search",
    "Hunza hotels search",
    "Skardu tour packages",
    "Swat Kalam travel packages",
    "Kumrat valley expedition",
    "4x4 northern areas rental",
    "Pakistan travel booking",
  ],
  alternates: {
    canonical: "/search",
  },
  openGraph: {
    title: "Search Tours, Hotels & Mountain Expeditions | PakistanTravel.Agency",
    description: "Explore and book verified tour packages and luxury stays across Pakistan with instant voucher confirmation.",
    url: "/search",
  },
};

export default async function SearchPage() {
  const initialListings = await getActiveDbListings();

  return <SearchClientView initialListings={initialListings} />;
}
