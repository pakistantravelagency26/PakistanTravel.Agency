import { NextResponse } from "next/server";
import { createBooking, getAllBookings } from "@/services/booking.service";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bookings = await getAllBookings();
    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
