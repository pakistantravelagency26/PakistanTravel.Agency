import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ eligible: false, reason: "NOT_AUTHENTICATED" });
    }

    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get("listingId");

    if (!listingId) {
      return NextResponse.json({ eligible: false, reason: "MISSING_LISTING_ID" });
    }

    const completedBooking = await prisma.booking.findFirst({
      where: {
        listingId,
        user: { email: session.user.email },
        status: "COMPLETED",
      },
    });

    if (completedBooking) {
      return NextResponse.json({ eligible: true, bookingId: completedBooking.id });
    }

    return NextResponse.json({ eligible: false, reason: "NO_COMPLETED_BOOKING" });
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    return NextResponse.json({ eligible: false, reason: "ERROR" });
  }
}
