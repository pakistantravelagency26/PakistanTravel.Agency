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
    // Cryptographic Webhook Signature & Replay Verification
    // ----------------------------------------------------
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;
    const rawSignatureHeader =
      req.headers.get("x-webhook-signature") ||
      req.headers.get("stripe-signature") ||
      req.headers.get("x-signature");
    const rawTimestampHeader = req.headers.get("x-webhook-timestamp");

    // 1. Replay Protection: Validate timestamp window (max 300 seconds)
    let webhookTimestamp: number | null = null;
    let signatureHash = rawSignatureHeader || "";

    if (rawTimestampHeader) {
      const parsed = parseInt(rawTimestampHeader, 10);
      if (!isNaN(parsed)) {
        webhookTimestamp = parsed > 1e11 ? Math.floor(parsed / 1000) : parsed;
      }
    } else if (rawSignatureHeader && rawSignatureHeader.includes("t=")) {
      // Stripe-style signature header: t=1614555555,v1=...
      const parts = rawSignatureHeader.split(",");
      for (const part of parts) {
        const [k, v] = part.split("=");
        if (k?.trim() === "t") {
          webhookTimestamp = parseInt(v.trim(), 10);
        } else if (k?.trim() === "v1") {
          signatureHash = v.trim();
        }
      }
    }

    if (webhookTimestamp !== null) {
      const nowSeconds = Math.floor(Date.now() / 1000);
      const ageSeconds = nowSeconds - webhookTimestamp;
      if (ageSeconds > 300 || ageSeconds < -60) {
        return NextResponse.json(
          { error: "Webhook rejected: Timestamp expired or replay window exceeded (max 300s)." },
          { status: 401 }
        );
      }
    }

    // 2. Cryptographic Signature Verification
    if (process.env.NODE_ENV === "production" || webhookSecret) {
      if (!webhookSecret) {
        console.error("CRITICAL: PAYMENT_WEBHOOK_SECRET is not configured in production.");
        return NextResponse.json({ error: "Webhook configuration error" }, { status: 500 });
      }

      if (!signatureHash) {
        return NextResponse.json(
          { error: "Missing required cryptographic webhook signature" },
          { status: 401 }
        );
      }

      // Compute expected HMAC SHA-256 (support both direct rawBody and timestamp-prefixed rawBody)
      const expectedDirect = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      const expectedTimestamped = webhookTimestamp !== null
        ? crypto
            .createHmac("sha256", webhookSecret)
            .update(`${webhookTimestamp}.${rawBody}`)
            .digest("hex")
        : "";

      const sigBuffer = Buffer.from(signatureHash);
      const directBuffer = Buffer.from(expectedDirect);
      const timestampedBuffer = Buffer.from(expectedTimestamped);

      const isDirectMatch =
        sigBuffer.length === directBuffer.length &&
        crypto.timingSafeEqual(sigBuffer, directBuffer);

      const isTimestampedMatch =
        expectedTimestamped !== "" &&
        sigBuffer.length === timestampedBuffer.length &&
        crypto.timingSafeEqual(sigBuffer, timestampedBuffer);

      if (!isDirectMatch && !isTimestampedMatch) {
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
