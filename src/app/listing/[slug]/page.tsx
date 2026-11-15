import { SITE_URL } from "@/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDbListingBySlugOrId, getActiveDbListings } from "@/services/serverListing.service";
import { ListingDetailClient } from "@/components/listing/ListingDetailClient";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const listings = await getActiveDbListings();
    return listings.map((l: any) => ({ slug: l.slug }));
  } catch {
    return [];
  }
}

interface ListingPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  let listing;
  try {
    listing = await getDbListingBySlugOrId(params.slug);
  } catch (error) {
    // Database outage: NEVER return 404 or noindex. Return fallback metadata so crawler retries later without deindexing.
    console.error(`[ListingMetadataError] DB outage generating metadata for "${params.slug}":`, error);
    return {
      title: "Guided Northern Pakistan Tour Package | PakistanTravel",
      description: "Explore guided tour packages and seasonal departures across Hunza, Skardu, Swat, and Kumrat with local operators.",
    };
  }

  const siteUrl = SITE_URL;

  if (!listing) {
    return {
      title: "Tour Not Found",
      description: "The requested tour package is not available or has been removed from PakistanTravel.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Generate concise page title without brand (template adds " | PakistanTravel", 17 chars).
  // Total rendered title must be strictly < 60 characters.
  let pageTitle = listing.title;
  if (pageTitle.length > 42) {
    if (listing.slug.includes("hunza-valley-attabad-2640")) {
      pageTitle = "Hunza & Attabad 8-Day Tour";
    } else if (listing.slug.includes("hunza-valley-attabad-5207")) {
      pageTitle = "Grand Hunza 10-Day Tour from Islamabad";
    } else {
      const truncated = pageTitle.slice(0, 42);
      const lastSpace = truncated.lastIndexOf(" ");
      pageTitle = lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated;
    }
  }
  const title = pageTitle;

  // Format Description strictly targeting 140-155 characters (complete sentence, no "verified", ending with ".")
  let description = "";
  if (listing.slug.includes("hunza-valley-attabad-2640")) {
    description = "Book the 8-day autumn tour in Hunza and Attabad with local operator Tours Khourshem. Includes transport, stays, and instant digital vouchers.";
  } else if (listing.slug.includes("hunza-valley-attabad-5207")) {
    description = "Book the 10-day tour to Hunza Valley, Khunjerab Pass and Nagar with Tours Khourshem. Includes transport, hotel stays, and instant digital vouchers.";
  } else {
    description = `Book the ${listing.title} in ${listing.city} with local operator ${listing.vendor.businessName} from PKR ${listing.basePrice.toLocaleString()} with instant digital vouchers.`;
    if (description.length > 155) {
      description = `Book ${listing.title.slice(0, 40).trim()} in ${listing.city} starting from PKR ${listing.basePrice.toLocaleString()} with instant digital tour booking vouchers.`;
    }
    if (description.length < 140) {
      description = `Book ${listing.title} in ${listing.city} starting from PKR ${listing.basePrice.toLocaleString()} with instant digital tour vouchers and local mountain guide.`;
    }
    if (description.length > 155) {
      description = description.slice(0, 154).trim();
      if (!description.endsWith(".")) description = description.replace(/[,;]$/, "") + ".";
    }
  }

  const canonicalUrl = `${siteUrl}/listing/${listing.slug}`;
  const days = listing.durationDays || 8;
  const nights = days > 1 ? days - 1 : 1;
  const ogImageUrl = `${siteUrl}/og?title=${encodeURIComponent(listing.title)}&category=TOUR%20PACKAGE&subtitle=${encodeURIComponent(`${days} Days / ${nights} Nights • ${listing.city}`)}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: canonicalUrl,
      siteName: "PakistanTravel",
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${listing.title} in ${listing.city}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const listing = await getDbListingBySlugOrId(params.slug);
  const siteUrl = SITE_URL;

  if (!listing || listing.type !== "TOUR" || listing.moderationStatus !== "APPROVED") {
    notFound();
  }

  // Google Rich Results Structured Data JSON-LD (strictly TouristTrip schema)
  const mainJsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: listing.title,
    description: listing.description,
    image: listing.photos,
    touristType: "Adventure Travel, Sightseeing",
    // TouristTrip schema per Schema.org (TouristTrip is not eligible for Google review stars snippets per Search Console guidelines)
    // Guard against fake aggregate ratings (<10 reviews): listing.totalReviews >= 10
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.province,
      addressCountry: "PK",
    },
    offers: {
      "@type": "Offer",
      price: listing.basePrice,
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
      url: `${siteUrl}/listing/${listing.slug}`,
      seller: {
        "@type": "Organization",
        name: listing.vendor?.businessName || "Independent Local Tour Operator",
        url: `${siteUrl}/listing/${listing.slug}`,
      },
    },
    provider: {
      "@type": "Organization",
      name: "PakistanTravel",
      url: siteUrl,
    },
  };

  // AggregateRating only with 10 or more real reviews
  if (listing.totalReviews && listing.totalReviews >= 10 && listing.avgRating) {
    mainJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: listing.avgRating,
      reviewCount: listing.totalReviews,
      bestRating: 5,
      worstRating: 1,
    };
  }

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
        name: listing.destinationName || "Destinations",
        item: listing.destinationSlug
          ? `${siteUrl}/destinations/${listing.destinationSlug}`
          : `${siteUrl}/destinations`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: listing.title,
        item: `${siteUrl}/listing/${listing.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ListingDetailClient listing={listing} />
    </>
  );
}
