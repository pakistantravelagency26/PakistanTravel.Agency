import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBooking, getAllBookings, getBookingsByEmail, getBookingsByVendorId } from "@/services/booking.service";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    // Role-based authorization to prevent IDOR and mass data disclosure
    if (session.user.role === "ADMIN") {
      const bookings = await getAllBookings();
      return NextResponse.json({ success: true, bookings });
    }

    if (session.user.role === "VENDOR") {
      const vendorId = session.user.vendorId;
      if (!vendorId) {
        return NextResponse.json({ success: false, error: "No vendor profile linked" }, { status: 403 });
      }
      const bookings = await getBookingsByVendorId(vendorId);
      return NextResponse.json({ success: true, bookings });
    }

    // Customer: only see their own bookings
    const customerEmail = session.user.email;
    if (!customerEmail) {
      return NextResponse.json({ success: true, bookings: [] });
    }
    const bookings = await getBookingsByEmail(customerEmail);
    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error("[BookingsAPI] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve booking records." }, { status: 500 });
  }
}

const bookingSchema = z.object({
  listingId: z.string(),
  listingTitle: z.string(),
  listingPhoto: z.string().optional(),
  unitTitle: z.string().optional(),
  destination: z.string(),
  departureId: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  nightsCount: z.number().min(1),
  guestsCount: z.number().min(1),
  unitsCount: z.number().min(1),
  totalAmount: z.number().positive(),
  depositAmount: z.number().optional(),
  balanceDue: z.number().optional(),
  isSoloTraveler: z.boolean().optional(),
  singleSupplement: z.number().optional(),
  paymentMethod: z.enum(["STRIPE", "JAZZCASH", "EASYPAISA", "CASH_ON_ARRIVAL"]),
  paymentChoice: z.enum(["FULL", "DEPOSIT", "ON_ARRIVAL"]).optional(),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(10),
  cnicOrPassport: z.string().min(5),
  specialRequests: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";

    const rateCheck = checkRateLimit(`booking-ip:${clientIp}`, 10, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: `Too many booking attempts. Please retry after ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      listingId,
      listingTitle,
      listingPhoto,
      unitTitle,
      destination,
      departureId,
      startDate,
      endDate,
      nightsCount,
      guestsCount,
      unitsCount,
      totalAmount,
      depositAmount,
      balanceDue,
      isSoloTraveler,
      singleSupplement,
      paymentMethod,
      paymentChoice,
      guestName,
      guestEmail,
      guestPhone,
      cnicOrPassport,
      specialRequests,
    } = parsed.data;

    // Validate that listing is an active Tour
    const listingCheck = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { type: true },
    });
    if (listingCheck && listingCheck.type !== "TOUR") {
      return NextResponse.json(
        { error: "This listing is not available for booking as PakistanTravel.Agency is a tours-only marketplace." },
        { status: 400 }
      );
    }

    // Resolve payment status and booking flow status
    // Cash on arrival: status is PENDING_PAYMENT (Hold reservation request, balance due at property)
    // Online card/wallet: status is CONFIRMED with instant voucher
    const isCashOnArrival = paymentMethod === "CASH_ON_ARRIVAL" || paymentChoice === "ON_ARRIVAL";
    const paymentStatus = isCashOnArrival ? "PENDING" : "PAID";
    const status = isCashOnArrival ? "PENDING_PAYMENT" : "CONFIRMED";

    const booking = await createBooking({
      listingId,
      listingTitle,
      listingPhoto,
      unitTitle,
      destination,
      departureId,
      startDate,
      endDate,
      nightsCount,
      guestsCount,
      unitsCount,
      totalAmount,
      depositAmount,
      balanceDue,
      isSoloTraveler,
      singleSupplement,
      paymentMethod,
      paymentStatus,
      status,
      guestName,
      guestEmail,
      guestPhone,
      cnicOrPassport,
      specialRequests,
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    console.error("Booking Creation Error:", error);
    // If overbooking error from transaction
    if (error.message?.includes("Overbooking prevented") || error.message?.includes("seats remaining")) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to process booking" },
      { status: 500 }
    );
  }
}
