import { NextResponse } from "next/server";
import { cancelBooking } from "@/services/booking.service";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await cancelBooking(params.id);
    if (!success) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}
