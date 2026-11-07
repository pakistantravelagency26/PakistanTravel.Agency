import { NextResponse } from "next/server";
import { getBookingById } from "@/services/booking.service";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await getBookingById(params.id);
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
