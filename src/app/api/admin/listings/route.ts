import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getAllListingsForAdmin, ListingData } from "@/services/listing.service";
import { formatDbListing } from "@/services/serverListing.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    // 1. Fetch all currently existing vendor IDs from DB
    const dbVendors = await prisma.vendor.findMany({ select: { id: true } });
    const validVendorIds = new Set(dbVendors.map((v) => v.id));

    // 2. Query ONLY listings that belong to currently existing vendors and are TOUR type
    const dbListings = await prisma.listing.findMany({
      where: {
        vendorId: { in: Array.from(validVendorIds) },
        type: "TOUR",
      },
      include: {
        vendor: true,
        destination: true,
        units: true,
        departures: {
          orderBy: { startDate: "asc" },
        },
        reviews: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted: ListingData[] = dbListings.map(formatDbListing);

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
