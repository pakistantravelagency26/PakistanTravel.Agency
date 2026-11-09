import type { MetadataRoute } from "next";
import { getActiveDbListings } from "../services/serverListing.service.ts";
import { destinationsData } from "../data/destinationData.ts";
import { blogPosts } from "../data/blogData.ts";
import { tourIntentsData } from "../data/tourIntentsData.ts";
import { SITE_URL } from "../config/site.ts";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Static indexable canonical pages.
  // Note: Omit lastmod where reliable date is unavailable per Google guidelines.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/destinations`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tours`,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about/editorial-policy`,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/partner-info`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/list-your-tour`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Landing pages for all destinations
  const destinationRoutes: MetadataRoute.Sitemap = Object.keys(destinationsData).map((slug) => ({
    url: `${baseUrl}/destinations/${slug}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Tour intent landing pages
  const intentRoutes: MetadataRoute.Sitemap = Object.keys(tourIntentsData).map((slug) => ({
    url: `${baseUrl}/tours/${slug}`,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Blog articles with reliable editorial publication/modified dates
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => {
    const postDate = post.lastUpdatedIso || post.isoDate || post.date;
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      ...(postDate ? { lastModified: new Date(postDate) } : {}),
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  // Dynamic active database listings
  // If getActiveDbListings throws DatabaseError, error bubbles up so endpoint returns 500.
  // This prevents silently serving a partial sitemap with all tours missing.
  const activeListings = await getActiveDbListings();
  const listingRoutes: MetadataRoute.Sitemap = activeListings.map((listing) => {
    const rawDate = listing.updatedAt || listing.createdAt;
    return {
      url: `${baseUrl}/listing/${listing.slug}`,
      ...(rawDate ? { lastModified: new Date(rawDate) } : {}),
      changeFrequency: "daily",
      priority: 0.95,
    };
  });

  return [...staticRoutes, ...destinationRoutes, ...intentRoutes, ...blogRoutes, ...listingRoutes];
}
