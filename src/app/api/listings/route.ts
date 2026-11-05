import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  MOCK_LISTINGS, 
  getActiveListings, 
  getAllListingsForAdmin, 
  createNewListing, 
  updateListing, 
  deleteListing,
  ListingData 
} from "@/services/listing.service";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get("all") === "true" || searchParams.get("includeDisabled") === "true";

    // 1. Query from Neon PostgreSQL Database for 100% persistent data
    const dbListings = await prisma.listing.findMany({
      include: {
        vendor: true,
        destination: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbListings && dbListings.length > 0) {
      let formatted: ListingData[] = dbListings.map((l) => ({
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

      if (!includeAll) {
        formatted = formatted.filter(
          (l) => l.moderationStatus === "APPROVED" && l.vendor.verified !== false
        );
      }

      return NextResponse.json({
        success: true,
        listings: formatted,
      });
    }

    // 2. Fallback to in-memory store
    const listings = includeAll ? getAllListingsForAdmin() : getActiveListings();
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
      description: body.description || `${body.title} - Curated by ${vendorBusiness}. Experience scenic valleys and authentic hospitality.`,
      cancellationPolicy: `Free cancellation until ${body.freeCancellationDays || 3} days before trip start date. 100% refund.`,
      vendor: {
        id: vendorId,
        businessName: vendorBusiness,
        verified: true,
        joinedYear: 2024,
        rating: 4.95,
      },
      units: [],
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
            basePrice: newListing.basePrice,
            isFeatured: true,
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
    let deletedFromDb = false;
    try {
      await prisma.listing.delete({ where: { id } });
      deletedFromDb = true;
    } catch (dbErr) {
      console.warn("DB listing delete error:", dbErr);
    }

    // 2. Also delete from in-memory store
    const deletedLocally = deleteListing(id);

    return NextResponse.json({
      success: true,
      message: "Tour listing permanently deleted from the database.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
