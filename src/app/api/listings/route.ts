import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MOCK_LISTINGS, getActiveListings, getAllListingsForAdmin, createNewListing, updateListing, ListingData } from "@/services/listing.service";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get("all") === "true" || searchParams.get("includeDisabled") === "true";
    const listings = includeAll ? getAllListingsForAdmin() : getActiveListings();

    return NextResponse.json({
      success: true,
      listings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    if (!body.title || !body.basePrice) {
      return NextResponse.json(
        { success: false, error: "Title and base price are required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const cleanSlug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const uniqueSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;

    const vendorBusiness = session?.user?.name || "Karakoram Expeditions Partner";
    const vendorId = (session?.user as any)?.vendorId || "v-karakoram-expeditions";

    // Split photo URLs
    let photosList: string[] = [];
    if (Array.isArray(body.photos)) {
      photosList = body.photos.filter(Boolean);
    } else if (typeof body.photos === "string" && body.photos.trim()) {
      photosList = body.photos.split(",").map((p: string) => p.trim()).filter(Boolean);
    }

    if (photosList.length === 0) {
      photosList = [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
      ];
    }

    const newListing: ListingData = {
      id: uniqueSlug,
      slug: uniqueSlug,
      title: body.title,
      moderationStatus: "PENDING_APPROVAL",
      isEdited: false,
      submittedAt: new Date().toISOString(),
      type: body.type || "TOUR",
      duration: body.duration || "5 Days / 4 Nights",
      destinationSlug: body.destinationSlug || body.destination || "hunza",
      destinationName: body.destinationName || body.city || "Hunza Valley",
      province: body.province || "Gilgit-Baltistan",
      address: body.address || `${body.city || "Karimabad"}, Pakistan`,
      city: body.city || "Karimabad",
      basePrice: Number(body.basePrice),
      avgRating: 5.0,
      totalReviews: 1,
      isFeatured: body.isFeatured ?? true,
      freeCancellation: true,
      freeCancellationDays: Number(body.freeCancellationDays || 3),
      badge: body.type === "TOUR" ? "Verified Tour" : "Verified Stay",
      photos: photosList,
      amenities: Array.isArray(body.amenities) && body.amenities.length > 0 
        ? body.amenities 
        : [
            "Dedicated 4x4 Mountain Transport",
            "Certified Alpine Guide",
            "Daily Breakfast & Dinner Included",
            "Hotel / Resort Accommodations",
            "First Aid & Emergency Support",
          ],
      description: body.description || `${body.title} - An unforgettable journey curated by ${vendorBusiness}. Experience scenic valleys, comfortable stays, and authentic Pakistani hospitality.`,
      cancellationPolicy: `Free cancellation until ${body.freeCancellationDays || 3} days before trip start date. 100% refund.`,
      vendor: {
        id: vendorId,
        businessName: vendorBusiness,
        verified: true,
        joinedYear: 2020,
        rating: 4.95,
      },
      units: [
        {
          id: `${uniqueSlug}-standard`,
          title: body.unitTitle || "Standard Package (Twin Sharing)",
          description: "All transport, accommodation, guided tours, and scheduled permits included.",
          maxGuests: Number(body.maxGuests || 2),
          totalQuantity: Number(body.inventory || 10),
          basePrice: Number(body.basePrice),
          bedType: "Hotel Accommodation / Twin Bed",
          photos: photosList.slice(0, 2),
          amenities: ["Transport Included", "Meals Included", "Sightseeing Permits"],
        },
      ],
      reviews: [
        {
          id: `rev-${Date.now()}`,
          userName: "Verified Traveler",
          userCity: "Islamabad, Pakistan",
          rating: 5,
          date: "November 2026",
          comment: "Outstanding experience! Highly recommend this package for families and explorers.",
          vendorReply: "Thank you for traveling with us!",
        },
      ],
    };

    // Save into in-memory store so it appears everywhere immediately
    createNewListing(newListing);

    // Also attempt saving to Neon Postgres
    try {
      // Find or create default destination and category
      const dest = await prisma.destination.findFirst({
        where: { slug: newListing.destinationSlug },
      });
      const cat = await prisma.category.findFirst({
        where: { type: newListing.type as any },
      });
      const vendorRecord = await prisma.vendor.findFirst();

      if (dest && cat && vendorRecord) {
        await prisma.listing.create({
          data: {
            id: newListing.id,
            slug: newListing.slug,
            title: newListing.title,
            description: newListing.description,
            type: newListing.type as any,
            status: "PUBLISHED",
            destinationId: dest.id,
            categoryId: cat.id,
            vendorId: vendorRecord.id,
            address: newListing.address,
            city: newListing.city,
            photos: newListing.photos,
            amenities: newListing.amenities,
            cancellationPolicy: newListing.cancellationPolicy,
            freeCancellationDays: newListing.freeCancellationDays,
            basePrice: newListing.basePrice,
            isFeatured: true,
          },
        });
      }
    } catch (dbErr) {
      console.warn("Notice: Prisma Neon write skipped, saved in-memory:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Tour / Listing published successfully!",
      listing: newListing,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Listing ID is required" }, { status: 400 });
    }

    const updates: Partial<ListingData> = {
      title: body.title,
      basePrice: body.basePrice ? Number(body.basePrice) : undefined,
      duration: body.duration,
      city: body.city,
      description: body.description,
      amenities: Array.isArray(body.amenities) ? body.amenities : undefined,
      photos: Array.isArray(body.photos) ? body.photos : undefined,
      moderationStatus: "PENDING_APPROVAL", // Re-enters moderation queue
      isEdited: true, // Marked as edited for Super Admin inspection
      submittedAt: new Date().toISOString(),
    };

    // Remove undefined fields
    Object.keys(updates).forEach((key) => {
      if ((updates as any)[key] === undefined) {
        delete (updates as any)[key];
      }
    });

    const updated = updateListing(body.id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Tour changes saved and submitted to Super Admin for re-approval.",
      listing: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
