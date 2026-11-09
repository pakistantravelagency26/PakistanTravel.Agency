import React from "react";
const cache = <T extends (...args: any[]) => any>(fn: T): T => {
  return ((React as any).cache ? (React as any).cache(fn) : fn) as T;
};
import { prisma } from "../lib/prisma.ts";
import type { ListingData } from "./listing.service.ts";
import { sanitizePublicVendor } from "../lib/antiLeakage.ts";
import { siteConfig } from "../config/site.ts";

export class DatabaseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "DatabaseError";
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}

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

  const durationDays = Number(l.durationDays) || (l.title.includes("7-Day") ? 7 : l.title.includes("5-Day") ? 5 : l.title.includes("4-Day") ? 4 : 1);
  const durationNights = l.durationNights !== undefined && l.durationNights !== null ? Number(l.durationNights) : Math.max(0, durationDays - 1);
  const duration = `${durationDays} Days / ${durationNights} Nights`;

  const cancellationPolicy = l.cancellationPolicy || siteConfig.cancellationPolicy.summary;

  return {
    id: l.id,
    slug: l.slug,
    title: l.title,
    type: "TOUR" as any,
    durationDays,
    durationNights,
    duration,
    destinationSlug: l.destination?.slug || "hunza",
    destinationName: l.destination?.name || l.city,
    province: l.destination?.province || "Gilgit-Baltistan",
    address: l.address,
    city: l.city,
    vendorPrice: l.vendorPrice !== undefined && l.vendorPrice !== null ? Number(l.vendorPrice) : Number(l.basePrice),
    basePrice: Number(l.basePrice),
    commissionRate: l.commissionRate !== undefined && l.commissionRate !== null ? Number(l.commissionRate) : siteConfig.marketplace.commissionPercent,
    avgRating: l.avgRating || 4.9,
    totalReviews: l.totalReviews || 1,
    isFeatured: l.isFeatured,
    freeCancellation: true,
    freeCancellationDays: l.freeCancellationDays || siteConfig.cancellationPolicy.fullRefundDays,
    badge: "Guided Tour Package",
    photos,
    amenities,
    description: l.description,
    cancellationPolicy,
    singleSupplement: l.singleSupplement !== undefined && l.singleSupplement !== null ? Number(l.singleSupplement) : Math.round(Number(l.basePrice) * 0.35),
    depositPercent: l.depositPercent !== undefined && l.depositPercent !== null ? Number(l.depositPercent) : 25,
    departures: Array.isArray(l.departures) ? l.departures.map((d: any) => ({
      id: d.id,
      startDate: d.startDate instanceof Date ? d.startDate.toISOString().split("T")[0] : String(d.startDate).split("T")[0],
      endDate: d.endDate instanceof Date ? d.endDate.toISOString().split("T")[0] : String(d.endDate).split("T")[0],
      seatsTotal: Number(d.seatsTotal || 12),
      seatsLeft: Number(d.seatsLeft || 0),
      price: d.price ? Number(d.price) : undefined,
      status: d.status || "AVAILABLE",
    })) : [],
    moderationStatus: l.status === "PUBLISHED" ? "APPROVED" : l.status === "PENDING_APPROVAL" ? "PENDING_APPROVAL" : "REJECTED",
    vendor: sanitizePublicVendor({
      ...l.vendor,
      vendorId: l.vendorId,
      city: l.vendor?.city || l.city,
    }),
    units: Array.isArray(l.units) && l.units.length > 0 ? l.units.map((u: any) => ({
      id: u.id,
      title: u.title,
      description: u.description || "",
      maxGuests: u.maxGuests || 2,
      totalQuantity: u.totalQuantity || 1,
      basePrice: Number(u.basePrice),
      photos: u.photos || [],
      amenities: u.amenities || [],
      bedType: u.bedType || "Standard Tour Seat",
    })) : [
      {
        id: `${l.id}-unit-standard`,
        title: "Standard Tour Seat Package",
        description: "Full tour package inclusion with guided mountain transport and standard hotel night stays",
        maxGuests: 2,
        totalQuantity: 10,
        basePrice: Number(l.basePrice),
        photos: photos.slice(0, 2),
        amenities: amenities.slice(0, 3),
        bedType: "Tour Seat / Per Person",
      }
    ],
    updatedAt: l.updatedAt instanceof Date ? l.updatedAt.toISOString() : l.updatedAt ? String(l.updatedAt) : undefined,
    createdAt: l.createdAt instanceof Date ? l.createdAt.toISOString() : l.createdAt ? String(l.createdAt) : undefined,
    reviews: Array.isArray(l.reviews) ? l.reviews.map((r: any) => ({
      id: r.id,
      userName: r.user?.name || "Traveler",
      userCity: "Pakistan",
      rating: r.rating || 5,
      date: r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : "2026-10-01",
      comment: r.comment || "",
      vendorReply: r.vendorReply || undefined,
    })) : [],
  };
}

export const getActiveDbListings = cache(async (): Promise<ListingData[]> => {
  let dbListings;
  try {
    dbListings = await prisma.listing.findMany({
      where: {
        status: "PUBLISHED",
        type: "TOUR",
        vendor: { status: "VERIFIED" },
      },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            city: true,
            status: true,
          },
        },
        destination: true,
        units: true,
        departures: {
          orderBy: { startDate: "asc" },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[DatabaseError] Error fetching active DB listings:", error);
    throw new DatabaseError("Database failure while retrieving active tour listings", { cause: error });
  }

  return dbListings.map(formatDbListing);
});

export const getDbListingBySlugOrId = cache(async (idOrSlug: string): Promise<ListingData | null> => {
  let dbListing;
  try {
    dbListing = await prisma.listing.findFirst({
      where: {
        status: "PUBLISHED",
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            city: true,
            status: true,
          },
        },
        destination: true,
        units: true,
        departures: {
          orderBy: { startDate: "asc" },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(`[DatabaseError] Error fetching DB listing by slug/id "${idOrSlug}":`, error);
    throw new DatabaseError(`Database failure while retrieving listing "${idOrSlug}"`, { cause: error });
  }

  if (!dbListing || dbListing.type !== "TOUR") return null;

  return formatDbListing(dbListing);
});
