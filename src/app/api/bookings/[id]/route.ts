import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBookingById } from "@/services/booking.service";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await getBookingById(params.id);
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const url = new URL(req.url);
    const guestEmailParam = url.searchParams.get("email")?.toLowerCase().trim();

    // IDOR Protection:
    // 1. Admin has access
    const isAdmin = session?.user?.role === "ADMIN";

    // 2. Booking owner (by authenticated email or valid guest confirmation email param)
    const isOwner =
      (session?.user?.email &&
        booking.guestEmail.toLowerCase() === session.user.email.toLowerCase()) ||
      (guestEmailParam && booking.guestEmail.toLowerCase() === guestEmailParam);

    // 3. Vendor who owns this listing
    let isVendorOwner = false;
    if (session?.user?.role === "VENDOR" && session.user.vendorId) {
      const listing = await prisma.listing.findUnique({
        where: { id: booking.listingId },
        select: { vendorId: true },
      });
      if (listing?.vendorId === session.user.vendorId) {
        isVendorOwner = true;
      }
    }

    if (!isAdmin && !isOwner && !isVendorOwner) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You do not have permission to view this booking." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
