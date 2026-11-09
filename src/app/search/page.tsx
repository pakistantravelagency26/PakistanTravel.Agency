import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import { getActiveDbListings } from "@/services/serverListing.service";
import { SearchClientView } from "@/components/search/SearchClientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SearchPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = SITE_URL;

  return {
    title: "Search Northern Pakistan Tour Packages | PakistanTravel",
    description:
      "Search and compare guided tour packages across Hunza, Skardu, Swat, and Kumrat from independent local tour operators.",
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
      title: "Search Northern Pakistan Tour Packages",
      description:
        "Search and compare guided tour packages across Hunza, Skardu, Swat, and Kumrat from independent local tour operators.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
          width: 1200,
          height: 630,
          alt: "Search Tour Packages across Northern Pakistan",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Search Northern Pakistan Tour Packages",
      description:
        "Search and compare guided tour packages across Hunza, Skardu, Swat, and Kumrat from independent local tour operators.",
      images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"],
    },
  };
}

export default async function SearchPage() {
  let initialListings: any[] = [];
  try {
    initialListings = await getActiveDbListings();
  } catch (err) {
    console.warn("[SearchPage] Active DB listings query fallback:", err);
  }

  return <SearchClientView initialListings={initialListings} />;
}
