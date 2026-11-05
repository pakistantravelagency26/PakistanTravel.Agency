import { NextResponse } from "next/server";
import { createBooking } from "@/services/booking.service";
import { z } from "zod";

const bookingSchema = z.object({
  listingId: z.string(),
  listingTitle: z.string(),
  listingPhoto: z.string(),
  unitTitle: z.string(),
  destination: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  nightsCount: z.number().min(1),
  guestsCount: z.number().min(1),
  unitsCount: z.number().min(1),
  totalAmount: z.number().positive(),
  paymentMethod: z.enum(["STRIPE", "JAZZCASH", "EASYPAISA", "CASH_ON_ARRIVAL"]),
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
      startDate,
      endDate,
      nightsCount,
      guestsCount,
      unitsCount,
      totalAmount,
      paymentMethod,
      guestName,
      guestEmail,
      guestPhone,
      cnicOrPassport,
      specialRequests,
    } = parsed.data;

    const paymentStatus = paymentMethod === "CASH_ON_ARRIVAL" ? "PENDING" : "PAID";

    const booking = await createBooking({
      listingId,
      listingTitle,
      listingPhoto,
      unitTitle,
      destination,
      startDate,
      endDate,
      nightsCount,
      guestsCount,
      unitsCount,
      totalAmount,
      paymentMethod,
      paymentStatus,
      status: "CONFIRMED",
      guestName,
      guestEmail,
      guestPhone,
      cnicOrPassport,
      specialRequests,
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    console.error("Booking Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
