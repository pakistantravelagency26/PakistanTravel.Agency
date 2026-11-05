import { NextResponse } from "next/server";
import { getAllVendors } from "@/services/vendor.service";
import { getAllListingsForAdmin } from "@/services/listing.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

    // Group tours by destination
    const destinationMap: { [dest: string]: number } = {};
    listings.forEach((l) => {
      const dest = l.destinationName || l.city || "Other";
      destinationMap[dest] = (destinationMap[dest] || 0) + 1;
    });

    const destinations = Object.entries(destinationMap).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / (totalTours || 1)) * 100),
    }));

    // Vendor directory with real tour counts
    const vendorsWithCounts = vendors.map((v) => {
      const vendorTours = listings.filter((l) => l.vendor?.id === v.id);
      return {
        ...v,
        listingsCount: vendorTours.length,
      };
    });

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
      recentListings: listings.slice(0, 6),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
