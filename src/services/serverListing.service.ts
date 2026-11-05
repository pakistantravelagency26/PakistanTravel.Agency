import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { ListingData } from "./listing.service";

export function formatDbListing(l: any): ListingData {
  const photos = Array.isArray(l.photos) && l.photos.length > 0 ? l.photos : [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
  ];

  const amenities = Array.isArray(l.amenities) && l.amenities.length > 0 ? l.amenities : [
    "Dedicated Mountain Transport",
    "Certified Tour Guide",
    "Hotel Accommodations Included",
    "Daily Breakfast Included",
  ];

  return {
    id: l.id,
    slug: l.slug,
    title: l.title,
    type: l.type as any,
    duration: l.type === "TOUR" ? "4 Days / 3 Nights" : undefined,
    destinationSlug: l.destination?.slug || "pakistan",
    destinationName: l.destination?.name || l.city,
    province: l.destination?.province || "Pakistan",
    address: l.address,
    city: l.city,
    vendorPrice: l.vendorPrice !== undefined && l.vendorPrice !== null ? Number(l.vendorPrice) : Number(l.basePrice),
    basePrice: Number(l.basePrice),
    commissionRate: l.commissionRate !== undefined && l.commissionRate !== null ? Number(l.commissionRate) : 12.0,
    avgRating: l.avgRating || 4.9,
    totalReviews: l.totalReviews || 1,
    isFeatured: l.isFeatured,
    freeCancellation: true,
    freeCancellationDays: l.freeCancellationDays || 3,
    badge: l.type === "TOUR" ? "Verified Tour" : "Verified Stay",
    photos,
    amenities,
    description: l.description,
    cancellationPolicy: l.cancellationPolicy || "Free cancellation until 3 days before start date. 100% refund.",
    moderationStatus: l.status === "PUBLISHED" ? "APPROVED" : l.status === "PENDING_APPROVAL" ? "PENDING_APPROVAL" : "REJECTED",
    vendor: {
      id: l.vendorId,
      businessName: l.vendor?.businessName || "Verified Travel Partner",
      verified: l.vendor?.status === "VERIFIED",
      joinedYear: 2024,
      rating: 4.95,
    },
    units: Array.isArray(l.units) && l.units.length > 0 ? l.units.map((u: any) => ({
      id: u.id,
      title: u.title,
      description: u.description || "",
      maxGuests: u.maxGuests || 2,
      totalQuantity: u.totalQuantity || 1,
      basePrice: Number(u.basePrice),
      photos: u.photos || [],
      amenities: u.amenities || [],
      bedType: u.bedType || "Standard",
    })) : [
      {
        id: `${l.id}-unit-standard`,
        title: l.type === "TOUR" ? "Standard Tour Seat" : "Deluxe Room",
        description: "Full package inclusion with guided mountain transport and stay",
        maxGuests: 2,
        totalQuantity: 10,
        basePrice: Number(l.basePrice),
        photos: photos.slice(0, 2),
        amenities: amenities.slice(0, 3),
        bedType: "Queen Bed / Seat",
      }
    ],
    reviews: Array.isArray(l.reviews) ? l.reviews.map((r: any) => ({
      id: r.id,
      userName: r.user?.name || "Verified Traveler",
      userCity: "Pakistan",
      rating: r.rating || 5,
      date: r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : "2026-10-01",
      comment: r.comment || "",
      vendorReply: r.vendorReply || undefined,
    })) : [],
  };
}

export const getActiveDbListings = cache(async (): Promise<ListingData[]> => {
  try {
    const dbListings = await prisma.listing.findMany({
      where: {
        status: "PUBLISHED",
        vendor: { status: "VERIFIED" },
      },
      include: {
        vendor: true,
        destination: true,
        units: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return dbListings.map(formatDbListing);
  } catch (error) {
    console.error("Error fetching active DB listings:", error);
    return [];
  }
});

export const getDbListingBySlugOrId = cache(async (idOrSlug: string): Promise<ListingData | null> => {
  try {
    const dbListing = await prisma.listing.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        vendor: true,
        destination: true,
        units: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!dbListing) return null;

    return formatDbListing(dbListing);
  } catch (error) {
    console.error("Error fetching DB listing by slug/id:", error);
    return null;
  }
});
