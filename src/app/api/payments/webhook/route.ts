import { NextResponse } from "next/server";
import { handlePaymentWebhookIdempotent } from "@/services/booking.service";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { transactionRef, amount, paymentMethod, rawResponse } = body;

    if (!transactionRef || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "transactionRef, amount, and paymentMethod are required" },
        { status: 400 }
      );
    }

    // ----------------------------------------------------
    // Cryptographic Webhook Signature Verification
    // ----------------------------------------------------
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;
    const incomingSignature =
      req.headers.get("x-webhook-signature") ||
      req.headers.get("stripe-signature") ||
      req.headers.get("x-signature");

    if (process.env.NODE_ENV === "production" || webhookSecret) {
      if (!webhookSecret) {
        console.error("CRITICAL: PAYMENT_WEBHOOK_SECRET is not configured in production.");
        return NextResponse.json({ error: "Webhook configuration error" }, { status: 500 });
      }

      if (!incomingSignature) {
        return NextResponse.json(
          { error: "Missing required cryptographic webhook signature" },
          { status: 401 }
        );
      }

      // Compute expected HMAC SHA-256
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      const signatureBuffer = Buffer.from(incomingSignature);
      const expectedBuffer = Buffer.from(expectedSignature);

      if (
        signatureBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
      ) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
      }
    }

    const result = await handlePaymentWebhookIdempotent({
      transactionRef,
      amount: Number(amount),
      paymentMethod,
      rawResponse,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
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
