import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getAllVendors } from "@/services/vendor.service";
import { getAllListingsForAdmin } from "@/services/listing.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    // 1. Compute directly from Neon PostgreSQL Database for 100% persistent accuracy
    const dbVendors = await prisma.vendor.findMany({
      include: {
        listings: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const validVendorIds = new Set(dbVendors.map((v) => v.id));

    // Only include listings that belong to currently existing vendors
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

    // Neon DB is active: compute strictly from database (even if 0 vendors or 0 tours)
    const totalVendors = dbVendors.length;
    const activeVendors = dbVendors.filter((v) => v.status === "VERIFIED").length;
    const disabledVendors = dbVendors.filter((v) => v.status !== "VERIFIED").length;

    const totalTours = dbListings.length;
    const approvedTours = dbListings.filter((l) => l.status === "PUBLISHED").length;
    const pendingTours = dbListings.filter((l) => l.status === "PENDING_APPROVAL").length;
    const rejectedTours = dbListings.filter((l) => l.status === "ARCHIVED" || l.status === "DRAFT").length;

    const totalPrice = dbListings.reduce((acc, l) => acc + Number(l.basePrice || 0), 0);
    const avgPrice = totalTours > 0 ? Math.round(totalPrice / totalTours) : 0;

    // Group tours by destination
    const destinationMap: { [dest: string]: number } = {};
    dbListings.forEach((l) => {
      const dest = l.destination?.name || l.city || "Other";
      destinationMap[dest] = (destinationMap[dest] || 0) + 1;
    });

    const destinations = Object.entries(destinationMap).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / (totalTours || 1)) * 100),
    }));

    // Vendor directory with real synchronized tour counts
    const vendorsWithCounts = dbVendors.map((v) => {
      const details = (v.bankDetails as any) || {};
      const vendorListings = dbListings.filter((l) => l.vendorId === v.id);
      return {
        id: v.id,
        companyName: v.businessName,
        city: v.city,
        tourismLicense: v.cnicOrTaxNumber || "REG-PENDING",
        phone1: details.phone1 || v.phone,
        status: v.status === "VERIFIED" ? ("ENABLED" as const) : ("DISABLED" as const),
        listingsCount: vendorListings.length,
      };
    });

    // Recent listings
    const recentListings = dbListings.slice(0, 8).map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      destinationName: l.destination?.name || l.city,
      province: l.destination?.province || "Pakistan",
      basePrice: Number(l.basePrice),
      duration: "5 Days / 4 Nights",
      photos: l.photos.length > 0 ? l.photos : ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"],
      moderationStatus: l.status === "PUBLISHED" ? ("APPROVED" as const) : l.status === "PENDING_APPROVAL" ? ("PENDING_APPROVAL" as const) : ("REJECTED" as const),
      vendor: {
        id: l.vendorId,
        businessName: l.vendor?.businessName || "Partner Agency",
      },
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalVendors,
        activeVendors,
        disabledVendors,
        totalTours,
        approvedTours,
        pendingTours,
        rejectedTours,
        avgPrice,
      },
      destinations,
      vendors: vendorsWithCounts,
      recentListings,
    });
  } catch (error: any) {
    console.error("Neon DB overview query error, falling back to memory:", error);
    // Fallback to in-memory store ONLY if DB network connection completely fails
    const vendors = getAllVendors();
    const listings = getAllListingsForAdmin();

    const totalVendors = vendors.length;
    const activeVendors = vendors.filter((v) => v.status === "ENABLED").length;
    const disabledVendors = vendors.filter((v) => v.status === "DISABLED").length;

    const totalTours = listings.length;
    const approvedTours = listings.filter((l) => !l.moderationStatus || l.moderationStatus === "APPROVED").length;
    const pendingTours = listings.filter((l) => l.moderationStatus === "PENDING_APPROVAL").length;
    const rejectedTours = listings.filter((l) => l.moderationStatus === "REJECTED").length;

    const totalPrice = listings.reduce((acc, l) => acc + (l.basePrice || 0), 0);
    const avgPrice = totalTours > 0 ? Math.round(totalPrice / totalTours) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalVendors,
        activeVendors,
        disabledVendors,
        totalTours,
        approvedTours,
        pendingTours,
        rejectedTours,
        avgPrice,
      },
      destinations: [],
      vendors: [],
      recentListings: [],
    });
  }
}
