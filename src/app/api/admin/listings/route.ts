import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllListingsForAdmin, ListingData } from "@/services/listing.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Fetch all currently existing vendor IDs from DB
    const dbVendors = await prisma.vendor.findMany({ select: { id: true } });
    const validVendorIds = new Set(dbVendors.map((v) => v.id));

    // 2. Query ONLY listings that belong to currently existing vendors
    const dbListings = await prisma.listing.findMany({
      where: {
        vendorId: { in: Array.from(validVendorIds) },
      },
      include: {
        vendor: true,
        destination: true,
      },
      orderBy: { createdAt: "desc" },
    });

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
      commissionRate: l.commissionRate !== undefined && l.commissionRate !== null ? Number(l.commissionRate) : 12.0,
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
  } catch (error: any) {
    console.error("Neon DB admin listings query error, falling back to memory:", error);
    const listings = getAllListingsForAdmin();
    return NextResponse.json({
      success: true,
      listings,
    });
  }
}
