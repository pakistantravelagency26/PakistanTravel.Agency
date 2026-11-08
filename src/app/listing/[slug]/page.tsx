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
    return listings.map((l) => ({ slug: l.slug }));
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
  const listing = await getDbListingBySlugOrId(params.slug);
  const siteUrl = SITE_URL;

  if (!listing) {
    return {
      title: "Experience Not Found | Pakistan Travel Agency",
      description: "Explore tour packages, mountain stays and travel experiences across northern Pakistan.",
    };
  }

  const isTour = listing.type === "TOUR" || listing.type === "ACTIVITY";
  
  // Format Title strictly targeting 50-60 characters
  let title = `${listing.title} | ${isTour ? "Tour" : "Hotel"} in ${listing.city}`;
  if (title.length > 60) {
    title = `${listing.title.slice(0, 44)} | ${listing.city} Trip`;
  } else if (title.length < 50) {
    title = `${listing.title} | ${isTour ? "Tour Package" : "Hotel"} in ${listing.city}, Pakistan`;
    if (title.length > 60) {
      title = `${listing.title} | ${listing.city}, Pakistan`;
    }
  }
  if (title.length > 60) title = title.slice(0, 60);

  // Format Description strictly targeting 140-155 characters (complete sentence, no "...")
  let description = `Book ${listing.title} in ${listing.city} with local host ${listing.vendor.businessName} from PKR ${listing.basePrice.toLocaleString()} with check-in vouchers.`;
  if (description.length > 155) {
    description = `Book ${listing.title.slice(0, 45)} in ${listing.city} starting from PKR ${listing.basePrice.toLocaleString()} with digital check-in vouchers.`;
  }
  if (description.length < 140) {
    description = `Book ${listing.title} in ${listing.city} starting from PKR ${listing.basePrice.toLocaleString()} with digital check-in vouchers and traveler assistance.`;
  }
  if (description.length > 155) {
    description = description.slice(0, 154).trim();
    if (!description.endsWith(".")) description = description.replace(/[,;]$/, "") + ".";
  }

  const canonicalUrl = `${siteUrl}/listing/${listing.slug}`;
  const mainPhoto = listing.photos[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200";

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
          url: mainPhoto,
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
      images: [mainPhoto],
    },
  };
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const listing = await getDbListingBySlugOrId(params.slug);
  const siteUrl = SITE_URL;

  if (!listing) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-slate-50">
        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          404 · Tour Not Found
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Experience Listing Not Available
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          This package may have been updated, archived, or is awaiting vendor review. Explore our other northern journeys.
        </p>
        <Link 
          href="/search" 
          className="px-6 py-3 bg-brand-emerald hover:bg-brand-emeraldDark text-white font-bold rounded-xl text-xs transition shadow-md"
        >
          Explore All Tours &amp; Hotels →
        </Link>
      </div>
    );
  }

  const isTour = listing.type === "TOUR" || listing.type === "ACTIVITY";

  // Google Rich Results Structured Data JSON-LD
  const mainJsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": isTour ? "TouristTrip" : "Hotel",
    name: listing.title,
    description: listing.description,
    image: listing.photos,
    touristType: isTour ? "Adventure Travel, Sightseeing" : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.province,
      addressCountry: "PK",
    },
    // AggregateRating ONLY when a listing has at least 10 real reviews per Requirement 3
    ...(listing.totalReviews >= 10
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: listing.avgRating,
            reviewCount: listing.totalReviews,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: listing.basePrice,
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
      url: `${siteUrl}/listing/${listing.slug}`,
      seller: {
        "@type": "TravelAgency",
        name: "PakistanTravel.Agency",
        url: siteUrl,
      },
    },
  };

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
        name: listing.destinationName,
        item: `${siteUrl}/destinations/${listing.destinationSlug}`,
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
