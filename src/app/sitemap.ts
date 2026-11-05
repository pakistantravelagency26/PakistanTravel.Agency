import { MetadataRoute } from "next";
import { getActiveDbListings } from "@/services/serverListing.service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pakistantravel.agency";

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
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
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
      priority: 0.9,
    }));
  } catch (err) {
    console.warn("Sitemap DB fetch fallback:", err);
  }

  return [...staticRoutes, ...destinationRoutes, ...listingRoutes];
}
