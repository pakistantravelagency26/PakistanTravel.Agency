import { MetadataRoute } from "next";
import { getActiveDbListings } from "@/services/serverListing.service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pakistan-travel-agency.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const destinationRoutes: MetadataRoute.Sitemap = [
    "hunza",
    "skardu",
    "swat",
    "murree",
    "kumrat",
    "islamabad",
  ].map((slug) => ({
    url: `${baseUrl}/search?destination=${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  let listingRoutes: MetadataRoute.Sitemap = [];
  try {
    const activeListings = await getActiveDbListings();
    listingRoutes = activeListings.map((listing) => ({
      url: `${baseUrl}/listing/${listing.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    }));
  } catch (err) {
    console.warn("Sitemap DB fetch fallback:", err);
  }

  return [...staticRoutes, ...destinationRoutes, ...listingRoutes];
}
