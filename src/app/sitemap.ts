import { MetadataRoute } from "next";
import { getActiveDbListings } from "@/services/serverListing.service";
import { destinationsData } from "@/data/destinationData";
import { blogPosts } from "@/data/blogData";

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
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
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
      priority: 0.65,
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

  // Static landing pages for all 6 destinations
  const destinationRoutes: MetadataRoute.Sitemap = Object.keys(destinationsData).map((slug) => ({
    url: `${baseUrl}/destinations/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Blog articles
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Dynamic active database listings
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

  return [...staticRoutes, ...destinationRoutes, ...blogRoutes, ...listingRoutes];
}
