import { NextResponse } from "next/server";
import { handlePaymentWebhookIdempotent } from "@/services/booking.service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transactionRef, amount, paymentMethod, rawResponse } = body;

    if (!transactionRef || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "transactionRef, amount, and paymentMethod are required" },
        { status: 400 }
      );
    }

    const result = await handlePaymentWebhookIdempotent({
      transactionRef,
      amount: Number(amount),
      paymentMethod,
      rawResponse,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      bookingId: result.bookingId,
    });
  } catch (error: any) {
    console.error("Payment webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failure", details: error.message },
      { status: 500 }
    );
  }
}
