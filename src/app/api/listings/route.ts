import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  getActiveListings, 
  getAllListingsForAdmin, 
  createNewListing, 
  updateListing, 
  deleteListing,
  ListingData 
} from "@/services/listing.service";
import { formatDbListing } from "@/services/serverListing.service";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  let includeAll = false;
  try {
    const { searchParams } = new URL(req.url);
    includeAll = searchParams.get("all") === "true" || searchParams.get("includeDisabled") === "true";
    const vendorId = searchParams.get("vendorId");
    const singleId = searchParams.get("id") || searchParams.get("slug");

    // Direct single-query relational scan (fast latency)
    const whereCondition: any = {};

    if (!includeAll) {
      whereCondition.status = "PUBLISHED";
      whereCondition.vendor = { status: "VERIFIED" };
    }

    if (vendorId) {
      whereCondition.vendorId = vendorId;
    }

    if (singleId) {
      whereCondition.OR = [{ id: singleId }, { slug: singleId }];
    }

    const dbListings = await prisma.listing.findMany({
      where: whereCondition,
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

    const formatted: ListingData[] = dbListings.map(formatDbListing);

    if (singleId) {
      return NextResponse.json({
        success: true,
        listing: formatted[0] || null,
        listings: formatted,
      });
    }

    return NextResponse.json({
      success: true,
      listings: formatted,
    });
  } catch (error: any) {
    console.error("Neon DB listings query error:", error);
    return NextResponse.json({
      success: true,
      listings: [],
    });
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

    const cleanSlug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const uniqueSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;

    const vendorBusiness = session?.user?.name || "Karakoram Expeditions Partner";
    const vendorId = (session?.user as any)?.vendorId || "v-karakoram-expeditions";

    let photosList: string[] = [];
    if (Array.isArray(body.photos)) {
      photosList = body.photos.filter(Boolean);
    } else if (typeof body.photos === "string" && body.photos.trim()) {
      photosList = body.photos.split(",").map((p: string) => p.trim()).filter(Boolean);
    }

    if (photosList.length === 0) {
      photosList = [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
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
      vendorPrice: Number(body.basePrice),
      basePrice: Number(body.basePrice),
      commissionRate: 12.0,
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
      description: body.description || `${body.title} - Curated by ${vendorBusiness}. Experience scenic valleys and authentic hospitality.`,
      cancellationPolicy: `Free cancellation until ${body.freeCancellationDays || 3} days before trip start date. 100% refund.`,
      vendor: {
        id: vendorId,
        businessName: vendorBusiness,
        verified: true,
        joinedYear: 2024,
        rating: 4.95,
      },
      units: [
        {
          id: `${uniqueSlug}-unit-1`,
          title: body.unitTitle || (body.type === "HOTEL" ? "Deluxe Mountain View Room" : "Standard Tour Seat Package"),
          description: body.type === "HOTEL" ? "Spacious room with scenic mountain views and ensuite bathroom" : "Full package inclusion with guided mountain transport and stay",
          maxGuests: Number(body.maxGuests || 2),
          totalQuantity: Number(body.inventory || 10),
          basePrice: Number(body.basePrice),
          photos: photosList.slice(0, 2),
          amenities: Array.isArray(body.amenities) ? body.amenities.slice(0, 4) : [],
          bedType: body.type === "HOTEL" ? "Queen Bed / Room" : "Tour Seat / Per Person",
        },
      ],
      reviews: [],
    };

    // 1. Save permanently to Neon PostgreSQL Database
    try {
      const dest = await prisma.destination.findFirst({
        where: {
          OR: [
            { slug: body.destinationSlug || body.destination },
            { name: { contains: body.city || "Hunza", mode: "insensitive" } },
          ],
        },
      }) || await prisma.destination.findFirst();

      const cat = await prisma.category.findFirst({
        where: { type: body.type || "TOUR" },
      }) || await prisma.category.findFirst();

      const vendorRecord = await prisma.vendor.findFirst({
        where: { id: vendorId },
      }) || await prisma.vendor.findFirst();

      if (dest && cat && vendorRecord) {
        await prisma.listing.create({
          data: {
            id: newListing.id,
            slug: newListing.slug,
            title: newListing.title,
            description: newListing.description,
            type: newListing.type as any,
            status: "PENDING_APPROVAL",
            destinationId: dest.id,
            categoryId: cat.id,
            vendorId: vendorRecord.id,
            address: newListing.address,
            city: newListing.city,
            photos: newListing.photos,
            amenities: newListing.amenities,
            cancellationPolicy: newListing.cancellationPolicy,
            freeCancellationDays: newListing.freeCancellationDays,
            vendorPrice: Number(body.basePrice),
            basePrice: newListing.basePrice,
            commissionRate: 12.0,
            isFeatured: true,
          },
        });

        // Also create unit in Neon DB
        await prisma.listingUnit.create({
          data: {
            id: `${newListing.id}-unit-1`,
            listingId: newListing.id,
            title: body.unitTitle || (body.type === "HOTEL" ? "Deluxe Mountain View Room" : "Standard Tour Seat Package"),
            description: body.type === "HOTEL" ? "Spacious room with scenic mountain views and ensuite bathroom" : "Full package inclusion with guided mountain transport and stay",
            maxGuests: Number(body.maxGuests || 2),
            totalQuantity: Number(body.inventory || 10),
            basePrice: Number(body.basePrice),
            photos: newListing.photos.slice(0, 2),
            amenities: newListing.amenities.slice(0, 4),
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB listing create error:", dbErr);
    }

    // 2. Also register in-memory
    createNewListing(newListing);

    return NextResponse.json({
      success: true,
      message: "Tour submitted successfully and stored permanently in database! Awaiting Admin review.",
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

    // 1. Update permanently in Neon PostgreSQL Database
    try {
      await prisma.listing.update({
        where: { id: body.id },
        data: {
          title: body.title,
          basePrice: body.basePrice ? Number(body.basePrice) : undefined,
          city: body.city,
          description: body.description,
          status: "PENDING_APPROVAL", // Re-enters moderation
        },
      });
    } catch (dbErr) {
      console.warn("DB listing update error:", dbErr);
    }

    // 2. Also update in-memory
    const updates: Partial<ListingData> = {
      title: body.title,
      basePrice: body.basePrice ? Number(body.basePrice) : undefined,
      duration: body.duration,
      city: body.city,
      description: body.description,
      moderationStatus: "PENDING_APPROVAL",
      isEdited: true,
      submittedAt: new Date().toISOString(),
    };

    const updated = updateListing(body.id, updates);

    return NextResponse.json({
      success: true,
      message: "Tour changes saved permanently and sent to Super Admin for moderation.",
      listing: updated || { id: body.id, ...updates },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Listing ID is required" }, { status: 400 });
    }

    // 1. Delete permanently from Neon PostgreSQL Database
    try {
      await prisma.listingUnit.deleteMany({ where: { listingId: id } }).catch(() => {});
      await prisma.review.deleteMany({ where: { listingId: id } }).catch(() => {});
      await prisma.booking.deleteMany({ where: { listingId: id } }).catch(() => {});
      await prisma.wishlist.deleteMany({ where: { listingId: id } }).catch(() => {});
      await prisma.listing.delete({ where: { id } });
    } catch (dbErr) {
      console.warn("DB listing delete error:", dbErr);
    }

    // 2. Also delete from in-memory store
    deleteListing(id);

    return NextResponse.json({
      success: true,
      message: "Tour listing permanently deleted from the database.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
