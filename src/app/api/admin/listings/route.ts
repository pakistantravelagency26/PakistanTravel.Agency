import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllListingsForAdmin, ListingData } from "@/services/listing.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Query from Neon PostgreSQL Database for permanent storage
    const dbListings = await prisma.listing.findMany({
      include: {
        vendor: true,
        destination: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbListings && dbListings.length > 0) {
      const formatted: ListingData[] = dbListings.map((l) => ({
        id: l.id,
        slug: l.slug,
        title: l.title,
        type: l.type as any,
        duration: "5 Days / 4 Nights",
        destinationSlug: l.destination?.slug || "hunza",
        destinationName: l.destination?.name || l.city,
        province: l.destination?.province || "Gilgit-Baltistan",
        address: l.address,
        city: l.city,
        basePrice: Number(l.basePrice),
        avgRating: l.avgRating || 5.0,
        totalReviews: l.totalReviews || 1,
        isFeatured: l.isFeatured,
        freeCancellation: true,
        freeCancellationDays: l.freeCancellationDays,
        badge: l.type === "TOUR" ? "Verified Tour" : "Verified Stay",
        photos: l.photos.length > 0 ? l.photos : [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
        ],
        amenities: l.amenities,
        description: l.description,
        cancellationPolicy: l.cancellationPolicy,
        moderationStatus: l.status === "PUBLISHED" ? "APPROVED" : l.status === "PENDING_APPROVAL" ? "PENDING_APPROVAL" : "REJECTED",
        vendor: {
          id: l.vendorId,
          businessName: l.vendor?.businessName || "Partner Agency",
          verified: l.vendor?.status === "VERIFIED",
          joinedYear: 2024,
          rating: 4.95,
        },
        units: [],
        reviews: [],
      }));

      return NextResponse.json({
        success: true,
        listings: formatted,
      });
    }

    // 2. Fallback to in-memory
    const listings = getAllListingsForAdmin();
    return NextResponse.json({
      success: true,
      listings,
    });
  } catch (error: any) {
    const listings = getAllListingsForAdmin();
    return NextResponse.json({
      success: true,
      listings,
    });
  }
}
