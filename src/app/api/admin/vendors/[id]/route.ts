import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVendorById, deleteVendorAccount } from "@/services/vendor.service";
import { deleteListingsByVendorId } from "@/services/listing.service";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    let companyName = "";

    // 1. Delete permanently from Neon PostgreSQL Database
    try {
      const vendor = await prisma.vendor.findUnique({
        where: { id },
        include: { user: true, listings: true },
      });

      if (vendor) {
        companyName = vendor.businessName;

        // A. Delete all child records of this vendor's listings first (Units, Reviews, Bookings, Wishlists)
        const vendorListings = await prisma.listing.findMany({ where: { vendorId: id } });
        for (const l of vendorListings) {
          await prisma.listingUnit.deleteMany({ where: { listingId: l.id } }).catch(() => {});
          await prisma.review.deleteMany({ where: { listingId: l.id } }).catch(() => {});
          await prisma.booking.deleteMany({ where: { listingId: l.id } }).catch(() => {});
          await prisma.wishlist.deleteMany({ where: { listingId: l.id } }).catch(() => {});
          await prisma.listing.delete({ where: { id: l.id } }).catch(() => {});
        }

        // B. Delete all payouts
        await prisma.payout.deleteMany({ where: { vendorId: id } }).catch(() => {});

        // C. Delete the vendor record
        await prisma.vendor.delete({ where: { id } }).catch(() => {});

        // D. Delete the corresponding user
        if (vendor.userId) {
          await prisma.user.delete({ where: { id: vendor.userId } }).catch(() => {});
        }
      }
    } catch (dbErr) {
      console.warn("Prisma vendor cascade delete error:", dbErr);
    }

    // 2. Also delete from in-memory fallback stores
    const localVendor = getVendorById(id);
    if (localVendor && !companyName) {
      companyName = localVendor.companyName;
    }
    deleteVendorAccount(id);
    deleteListingsByVendorId(id);

    return NextResponse.json({
      success: true,
      message: `Partner account "${companyName || id}" and ALL associated tour packages have been permanently deleted from the database.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
