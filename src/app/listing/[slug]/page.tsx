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
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pakistan-travel-agency.vercel.app";

  if (!listing) {
    return {
      title: "Experience Not Found | PakistanTravel.Agency",
      description: "Explore verified tours, mountain stays and travel packages across Pakistan.",
    };
  }

  const isTour = listing.type === "TOUR" || listing.type === "ACTIVITY";
  const title = `${listing.title} | ${isTour ? "Tour Package" : "Hotel"} in ${listing.city}`;
  const description = `${listing.description.slice(0, 155)}... Book online with verified operator ${listing.vendor.businessName} starting from PKR ${listing.basePrice.toLocaleString()}. Guaranteed voucher confirmation.`;
  const canonicalUrl = `${siteUrl}/listing/${listing.slug}`;
  const mainPhoto = listing.photos[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200";

  return {
    title,
    description,
    keywords: [
      listing.title,
      `${listing.city} tours`,
      `${listing.destinationName} travel`,
      isTour ? "Pakistan guided tour" : "Pakistan hotel booking",
      listing.vendor.businessName,
      "PakistanTravel.Agency",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: canonicalUrl,
      siteName: "PakistanTravel.Agency",
      title,
      description,
      images: [
        {
          url: mainPhoto,
          width: 1200,
          height: 630,
          alt: listing.title,
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
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pakistan-travel-agency.vercel.app";

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
          This package may have been updated, archived, or is awaiting vendor review. Explore our other verified northern journeys.
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
  const mainJsonLd = {
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: listing.avgRating,
      reviewCount: Math.max(listing.totalReviews, 1),
      bestRating: "5",
      worstRating: "1",
    },
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
        item: `${siteUrl}/search?destination=${listing.destinationSlug}`,
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
