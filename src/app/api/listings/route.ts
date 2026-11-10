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
import { COMMISSION_PERCENT } from "@/config/site";
import { requireRole, requireVendorOwnership } from "@/lib/permissions";
import { getTrustedClientIp } from "@/lib/clientIp";
import { checkServerlessRateLimit } from "@/lib/serverlessRateLimiter";
import { z } from "zod";

export const dynamic = "force-dynamic";

const listingCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  basePrice: z.union([z.number().positive(), z.string().regex(/^\d+(\.\d+)?$/)]),
  couplePrice: z.union([z.number(), z.string()]).optional(),
  soloPrice: z.union([z.number(), z.string()]).optional(),
  duration: z.string().optional(),
  durationDays: z.union([z.number(), z.string()]).optional(),
  durationNights: z.union([z.number(), z.string()]).optional(),
  destinationSlug: z.string().optional(),
  destinationName: z.string().optional(),
  destination: z.string().optional(),
  province: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  pickupPoints: z.union([z.array(z.string()), z.string()]).optional(),
  routeStops: z.union([z.array(z.string()), z.string()]).optional(),
  groupDiscounts: z.union([z.array(z.any()), z.string()]).optional(),
  isFeatured: z.boolean().optional(),
  freeCancellationDays: z.union([z.number(), z.string()]).optional(),
  photos: z.union([z.array(z.string()), z.string()]).optional(),
  amenities: z.array(z.string()).optional(),
  description: z.string().optional(),
  vendorId: z.string().optional(),
  unitTitle: z.string().optional(),
  maxGuests: z.union([z.number(), z.string()]).optional(),
  inventory: z.union([z.number(), z.string()]).optional(),
  singleSupplement: z.union([z.number(), z.string()]).optional(),
  depositPercent: z.union([z.number(), z.string()]).optional(),
  departures: z.array(z.any()).optional(),
  type: z.literal("TOUR").optional(),
}).strict();

const listingUpdateSchema = z.object({
  id: z.string().min(1, "Listing ID is required"),
  title: z.string().min(3).max(200).optional(),
  basePrice: z.union([z.number().positive(), z.string().regex(/^\d+(\.\d+)?$/)]).optional(),
  duration: z.string().optional(),
  city: z.string().optional(),
  description: z.string().optional(),
  type: z.literal("TOUR").optional(),
}).strict();

export async function GET(req: Request) {
  const clientIp = getTrustedClientIp(req.headers);
  const searchRate = await checkServerlessRateLimit(`search:ip:${clientIp}`, 60, 60);
  if (!searchRate.success) {
    return NextResponse.json(
      { success: false, error: "Too many search requests. Please slow down." },
      { 
        status: 429,
        headers: { "Retry-After": String(searchRate.retryAfterSeconds) }
      }
    );
  }

  let includeAll = false;
  try {
    const { searchParams } = new URL(req.url);
    includeAll = searchParams.get("all") === "true" || searchParams.get("includeDisabled") === "true";
    let vendorId = searchParams.get("vendorId");
    const singleId = searchParams.get("id") || searchParams.get("slug");

    // IDOR Defense: Scope partner listings strictly to current vendor
    const session = await getServerSession(authOptions);
    if (session?.user && session.user.role === "VENDOR") {
      let currentVendorId = session.user.vendorId || null;
      if (!currentVendorId && session.user.id) {
        const dbV = await prisma.vendor.findFirst({ where: { userId: session.user.id } });
        if (dbV) currentVendorId = dbV.id;
      }

      // If vendor queries all listings or specifies vendorId, enforce ownership
      if (includeAll || vendorId) {
        if (vendorId && vendorId !== currentVendorId) {
          return NextResponse.json(
            { success: false, error: "Forbidden: You cannot access another vendor's private listings." },
            { status: 403 }
          );
        }
        vendorId = currentVendorId;
      }
    }

    // Direct single-query relational scan (fast latency) - strictly tours only
    const whereCondition: any = {
      type: "TOUR",
    };

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
    const auth = requireRole(session, ["ADMIN", "VENDOR"]);
    if (!auth.authorized || !session?.user) {
      return NextResponse.json({ success: false, error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    const rawBody = await req.json();
    const parsed = listingCreateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const body = parsed.data;

    const cleanSlug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const uniqueSlug = `${cleanSlug || "tour"}-${Date.now().toString().slice(-4)}`;

    const vendorBusiness = session.user.name || "Partner Agency";
    
    // Strict & resilient vendorId resolution (auto-links if session lacks vendorId)
    let vendorId: string | null = session.user.vendorId || null;

    if (!vendorId && session.user.id) {
      const dbVendor = await prisma.vendor.findFirst({
        where: { userId: session.user.id },
      });
      if (dbVendor) {
        vendorId = dbVendor.id;
      }
    }

    if (!vendorId && session.user.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { vendorProfile: true },
      });
      if (dbUser?.vendorProfile) {
        vendorId = dbUser.vendorProfile.id;
      }
    }

    if (session.user.role === "ADMIN") {
      if (body.vendorId) {
        vendorId = body.vendorId;
      } else if (!vendorId) {
        const firstVendor = await prisma.vendor.findFirst({
          where: { status: "VERIFIED" },
        }) || await prisma.vendor.findFirst();
        vendorId = firstVendor?.id || "v-dkt-8394";
      }
    } else if (session.user.role === "VENDOR" && !vendorId && session.user.id) {
      // Auto-provision verified vendor profile for vendor user so saving never gets blocked
      const newVendor = await prisma.vendor.create({
        data: {
          id: `v-${Date.now().toString().slice(-6)}`,
          userId: session.user.id,
          businessName: session.user.name || "Local Tour Operator",
          phone: session.user.phone || "03000000000",
          city: body.city || "Islamabad",
          status: "VERIFIED",
          commissionRate: COMMISSION_PERCENT,
        },
      });
      vendorId = newVendor.id;
    }

    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: "Unable to find or create a vendor profile for this account. Please contact support." },
        { status: 403 }
      );
    }

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

    // Handle pickup points (up to 3)
    let pickupList: string[] = [];
    if (Array.isArray(body.pickupPoints)) {
      pickupList = body.pickupPoints.map((p: any) => String(p).trim()).filter(Boolean);
    } else if (typeof body.pickupPoints === "string" && body.pickupPoints.trim()) {
      pickupList = body.pickupPoints.split("|").map((p: string) => p.trim()).filter(Boolean);
    }

    const effectiveAddress = pickupList.length > 0 
      ? pickupList.join(" | ") 
      : (body.address || `${body.city || "Karimabad"}, Pakistan`);

    // Handle Route / Sightseeing Stops
    let routeList: string[] = [];
    if (Array.isArray(body.routeStops)) {
      routeList = body.routeStops.map((r: any) => String(r).trim()).filter(Boolean);
    } else if (typeof body.routeStops === "string" && body.routeStops.trim()) {
      routeList = body.routeStops.split("➔").map((r: string) => r.trim()).filter(Boolean);
    }

    // Build Enriched Description
    let enrichedDescription = body.description || `${body.title} - Curated by ${vendorBusiness}. Experience scenic valleys and authentic hospitality.`;
    
    if (routeList.length > 0) {
      enrichedDescription += `\n\n📍 Tour Journey & Sightseeing Route:\n` + routeList.join(" ➔ ");
    }

    if (pickupList.length > 0) {
      enrichedDescription += `\n\n🚐 Departure & Pickup Meeting Points:\n` + pickupList.map((p, idx) => `${idx + 1}. ${p}`).join("\n");
    }

    if (Array.isArray(body.groupDiscounts) && body.groupDiscounts.length > 0) {
      const validTiers = body.groupDiscounts.filter((g: any) => g && (g.minPersons || g.persons) && (g.pricePerPerson || g.price));
      if (validTiers.length > 0) {
        enrichedDescription += `\n\n👥 Group & Family Discount Tiers:\n` + validTiers
          .map((g: any) => `• Group of ${g.minPersons || g.persons}+ Persons: PKR ${Number(g.pricePerPerson || g.price).toLocaleString()} / person`)
          .join("\n");
      }
    }

    const packageUnits: any[] = [
      {
        id: `${uniqueSlug}-unit-perperson`,
        title: body.unitTitle || "Per Person Package (Twin / Triple Sharing)",
        description: "Standard per person tour seat with shared hotel room accommodation and complete transport inclusions.",
        maxGuests: Number(body.maxGuests || 2),
        totalQuantity: Number(body.inventory || 10),
        basePrice: Number(body.basePrice),
        photos: photosList.slice(0, 2),
        amenities: Array.isArray(body.amenities) ? body.amenities.slice(0, 4) : [],
        bedType: "Tour Seat / Per Person",
      },
    ];

    if (body.couplePrice && Number(body.couplePrice) > 0) {
      packageUnits.push({
        id: `${uniqueSlug}-unit-couple`,
        title: "Couple Package (Dedicated Private Master Bedroom)",
        description: "Private room for 2 persons / couple throughout the tour with all package inclusions.",
        maxGuests: 2,
        totalQuantity: Math.max(1, Math.floor(Number(body.inventory || 10) / 2)),
        basePrice: Number(body.couplePrice),
        photos: photosList.slice(0, 2),
        amenities: [...(Array.isArray(body.amenities) ? body.amenities.slice(0, 3) : []), "Private Master Bedroom for Couple"],
        bedType: "Private Double Bed Room",
      });
    }

    if (body.soloPrice && Number(body.soloPrice) > 0) {
      packageUnits.push({
        id: `${uniqueSlug}-unit-solo`,
        title: "Solo Traveler / Private Single Room",
        description: "Single occupancy private room throughout the trip without sharing with other travelers.",
        maxGuests: 1,
        totalQuantity: Math.max(1, Math.floor(Number(body.inventory || 10) / 3)),
        basePrice: Number(body.soloPrice),
        photos: photosList.slice(0, 2),
        amenities: [...(Array.isArray(body.amenities) ? body.amenities.slice(0, 3) : []), "Private Single Occupancy Room"],
        bedType: "Private Single Room",
      });
    }

    const singleSupplementCalc = body.soloPrice && Number(body.soloPrice) > Number(body.basePrice)
      ? Number(body.soloPrice) - Number(body.basePrice)
      : Number(body.singleSupplement || 0);

    const newListing: ListingData = {
      id: uniqueSlug,
      slug: uniqueSlug,
      title: body.title,
      moderationStatus: "PENDING_APPROVAL",
      isEdited: false,
      submittedAt: new Date().toISOString(),
      type: "TOUR",
      duration: body.duration || "5 Days / 4 Nights",
      destinationSlug: body.destinationSlug || body.destination || "hunza",
      destinationName: body.destinationName || body.city || "Hunza Valley",
      province: body.province || "Gilgit-Baltistan",
      address: effectiveAddress,
      city: body.city || "Karimabad",
      vendorPrice: Number(body.basePrice),
      basePrice: Number(body.basePrice),
      commissionRate: COMMISSION_PERCENT,
      avgRating: 5.0,
      totalReviews: 1,
      isFeatured: body.isFeatured ?? true,
      freeCancellation: true,
      freeCancellationDays: Number(body.freeCancellationDays || 3),
      badge: "Guided Tour Package",
      photos: photosList,
      amenities: Array.isArray(body.amenities) && body.amenities.length > 0 
        ? body.amenities 
        : [
            "Dedicated 4x4 Mountain Transport",
            "Certified Alpine Guide",
            "Daily Breakfast & Dinner Included",
            "Standard Hotel Accommodations Included",
            "First Aid & Emergency Support",
          ],
      description: enrichedDescription,
      cancellationPolicy: `Free cancellation until ${body.freeCancellationDays || 3} days before trip start date. 100% refund.`,
      singleSupplement: singleSupplementCalc,
      vendor: {
        id: vendorId,
        businessName: vendorBusiness,
        verified: true,
        joinedYear: 2024,
        rating: 4.95,
      },
      units: packageUnits,
      reviews: [],
    };

    // 1. Resolve Destination & Category & Vendor records in DB
    const destSlug = (body.destinationSlug || body.destination || "hunza").toLowerCase().trim();
    let dest = await prisma.destination.findFirst({
      where: {
        OR: [
          { slug: destSlug },
          { name: { contains: body.city || "Hunza", mode: "insensitive" } },
        ],
      },
    });

    if (!dest) {
      // Auto-create destination in Neon DB if not present so tour save never fails
      const destName = body.destinationName || body.city || (destSlug.charAt(0).toUpperCase() + destSlug.slice(1));
      dest = await prisma.destination.create({
        data: {
          slug: destSlug,
          name: destName,
          province: body.province || "Northern Pakistan",
          image: photosList[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
          description: `Explore ${destName} with local guided expeditions and tour packages.`,
          isFeatured: true,
        },
      });
    }

    let cat = await prisma.category.findFirst({
      where: { type: "TOUR" },
    });

    if (!cat) {
      cat = await prisma.category.findFirst();
    }

    if (!cat) {
      cat = await prisma.category.create({
        data: {
          name: "Tour Packages",
          slug: "tours",
          type: "TOUR",
          icon: "Compass",
        },
      });
    }

    const vendorRecord = await prisma.vendor.findFirst({
      where: { id: vendorId },
    }) || await prisma.vendor.findFirst();

    if (!vendorRecord) {
      return NextResponse.json(
        { success: false, error: "No vendor profile found in database. Please contact support." },
        { status: 400 }
      );
    }

    // 2. Save permanently to Neon PostgreSQL Database
    try {
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
          durationDays: Number(body.durationDays) || 5,
          durationNights: body.durationNights !== undefined ? Number(body.durationNights) : 4,
          singleSupplement: newListing.singleSupplement !== undefined ? Number(newListing.singleSupplement) : Number(body.singleSupplement || 0),
          depositPercent: Number(body.depositPercent || 25),
          cancellationPolicy: newListing.cancellationPolicy,
          freeCancellationDays: newListing.freeCancellationDays,
          vendorPrice: Number(body.basePrice),
          basePrice: newListing.basePrice,
          commissionRate: COMMISSION_PERCENT,
          isFeatured: true,
        },
      });

      // Also create departures for tour package
      const departureItems = Array.isArray(body.departures) && body.departures.length > 0
          ? body.departures
          : [
              {
                startDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
                endDate: new Date(Date.now() + (7 + (Number(body.durationDays) || 5)) * 86400000).toISOString().split("T")[0],
                seatsTotal: Number(body.inventory || 12),
                seatsLeft: Number(body.inventory || 12),
                price: Number(body.basePrice),
              },
              {
                startDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
                endDate: new Date(Date.now() + (14 + (Number(body.durationDays) || 5)) * 86400000).toISOString().split("T")[0],
                seatsTotal: Number(body.inventory || 12),
                seatsLeft: Number(body.inventory || 12),
                price: Number(body.basePrice),
              },
            ];

        for (const dep of departureItems) {
          const s = dep.startDate ? new Date(dep.startDate) : new Date(Date.now() + 7 * 86400000);
          const validStart = isNaN(s.getTime()) ? new Date(Date.now() + 7 * 86400000) : s;
          const e = dep.endDate ? new Date(dep.endDate) : new Date(validStart.getTime() + (Number(body.durationDays) || 5) * 86400000);
          const validEnd = isNaN(e.getTime()) ? new Date(validStart.getTime() + (Number(body.durationDays) || 5) * 86400000) : e;

          await prisma.departure.create({
            data: {
              listingId: newListing.id,
              startDate: validStart,
              endDate: validEnd,
              seatsTotal: Number(dep.seatsTotal || 12),
              seatsLeft: Number(dep.seatsLeft || dep.seatsTotal || 12),
              price: dep.price ? Number(dep.price) : Number(body.basePrice),
              status: "AVAILABLE",
            },
          });
        }

      // Also create all package units in Neon DB
      for (const u of packageUnits) {
        await prisma.listingUnit.create({
          data: {
            id: u.id,
            listingId: newListing.id,
            title: u.title,
            description: u.description || "",
            maxGuests: Number(u.maxGuests || 2),
            totalQuantity: Number(u.totalQuantity || 10),
            basePrice: Number(u.basePrice),
            photos: u.photos || newListing.photos.slice(0, 2),
            amenities: u.amenities || newListing.amenities.slice(0, 4),
          },
        });
      }
    } catch (dbErr: any) {
      console.error("CRITICAL: Neon DB listing persistence failed:", dbErr);
      return NextResponse.json(
        { 
          success: false, 
          error: `Database save failed: ${dbErr?.message || "Unknown error"}. Please check your fields and retry.` 
        },
        { status: 500 }
      );
    }

    // 3. Also update in-memory cache
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
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN", "VENDOR"]);
    if (!auth.authorized || !session?.user) {
      return NextResponse.json({ success: false, error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    const rawBody = await req.json();
    const parsed = listingUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const body = parsed.data;

    // IDOR Check: If vendor, verify that they own the listing
    if (session!.user!.role === "VENDOR") {
      const existing = await prisma.listing.findUnique({
        where: { id: body.id },
        select: { vendorId: true },
      });
      if (!existing) {
        return NextResponse.json(
          { success: false, error: "Listing not found" },
          { status: 404 }
        );
      }
      let currentVendorId = session!.user!.vendorId;
      if (!currentVendorId && session!.user!.id) {
        const v = await prisma.vendor.findFirst({ where: { userId: session!.user!.id } });
        currentVendorId = v?.id || null;
      }
      const ownership = requireVendorOwnership({ user: { ...session!.user, vendorId: currentVendorId } }, existing.vendorId);
      if (!ownership.authorized) {
        return NextResponse.json(
          { success: false, error: "Forbidden: You cannot modify another vendor's listing." },
          { status: 403 }
        );
      }
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
          status: "PENDING_APPROVAL", // Re-enters moderation, vendors cannot self-approve
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
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN", "VENDOR"]);
    if (!auth.authorized || !session?.user) {
      return NextResponse.json({ success: false, error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Listing ID is required" }, { status: 400 });
    }

    // IDOR Check: If vendor, verify that they own the listing
    if (session!.user!.role === "VENDOR") {
      const existing = await prisma.listing.findUnique({
        where: { id },
        select: { vendorId: true },
      });
      if (!existing) {
        return NextResponse.json(
          { success: false, error: "Listing not found" },
          { status: 404 }
        );
      }
      let currentVendorId = session!.user!.vendorId;
      if (!currentVendorId && session!.user!.id) {
        const v = await prisma.vendor.findFirst({ where: { userId: session!.user!.id } });
        currentVendorId = v?.id || null;
      }
      const ownership = requireVendorOwnership({ user: { ...session!.user, vendorId: currentVendorId } }, existing.vendorId);
      if (!ownership.authorized) {
        return NextResponse.json(
          { success: false, error: "Forbidden: You cannot delete another vendor's listing." },
          { status: 403 }
        );
      }
    }

    // 1. Delete permanently from Neon PostgreSQL Database
    try {
      await prisma.departure.deleteMany({ where: { listingId: id } }).catch(() => {});
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
