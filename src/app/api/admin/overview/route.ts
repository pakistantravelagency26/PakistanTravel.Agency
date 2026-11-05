import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllVendors } from "@/services/vendor.service";
import { getAllListingsForAdmin } from "@/services/listing.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Compute directly from Neon PostgreSQL Database for 100% persistent accuracy
    const dbVendors = await prisma.vendor.findMany({
      include: {
        listings: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const dbListings = await prisma.listing.findMany({
      include: {
        vendor: true,
        destination: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbVendors && dbVendors.length > 0) {
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

      // Vendor directory with real tour counts
      const vendorsWithCounts = dbVendors.map((v) => {
        const details = (v.bankDetails as any) || {};
        return {
          id: v.id,
          companyName: v.businessName,
          city: v.city,
          tourismLicense: v.cnicOrTaxNumber || "DTS-VERIFIED",
          phone1: details.phone1 || v.phone,
          status: v.status === "VERIFIED" ? ("ENABLED" as const) : ("DISABLED" as const),
          listingsCount: v.listings.length,
        };
      });

      // Recent listings
      const recentListings = dbListings.slice(0, 6).map((l) => ({
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
    }

    // 2. Fallback to in-memory store
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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
