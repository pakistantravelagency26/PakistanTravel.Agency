import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cancelBooking, getBookingById } from "@/services/booking.service";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const booking = await getBookingById(params.id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // IDOR Authorization verification
    const isOwner =
      session.user.email &&
      booking.guestEmail.toLowerCase() === session.user.email.toLowerCase();
    const isAdmin = session.user.role === "ADMIN";

    let isAuthorizedVendor = false;
    if (session.user.role === "VENDOR" && session.user.vendorId) {
      const { prisma } = await import("@/lib/prisma");
      const listing = await prisma.listing.findUnique({
        where: { id: booking.listingId },
        select: { vendorId: true },
      });
      if (listing?.vendorId === session.user.vendorId) {
        isAuthorizedVendor = true;
      }
    }

    if (!isAdmin && !isOwner && !isAuthorizedVendor) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to cancel this booking" },
        { status: 403 }
      );
    }

    const success = await cancelBooking(params.id);
    if (!success) {
      return NextResponse.json({ error: "Booking could not be cancelled" }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}
