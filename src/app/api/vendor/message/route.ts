import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { containsContactLeakage, maskContactLeakage } from "@/lib/antiLeakage";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";

    const rateCheck = checkRateLimit(`operator-msg:${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many inquiries sent. Please retry after ${rateCheck.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { listingId, listingTitle, vendorId, senderName, senderEmail, message } = body;

    if (!senderName || !senderName.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide your full name." },
        { status: 400 }
      );
    }

    if (!senderEmail || !senderEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email is required to receive the operator's response." },
        { status: 400 }
      );
    }

    const rawMessage = (typeof message === "string" ? message : "").trim();
    if (!rawMessage || rawMessage.length < 10) {
      return NextResponse.json(
        { success: false, error: "Please write a message with at least 10 characters." },
        { status: 400 }
      );
    }

    if (rawMessage.length > 1500) {
      return NextResponse.json(
        { success: false, error: "Message exceeds maximum allowed length of 1500 characters." },
        { status: 400 }
      );
    }

    // Anti-leakage enforcement: Block phone numbers, emails, WhatsApp links before booking
    if (containsContactLeakage(rawMessage)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Direct contact details (phone numbers, WhatsApp, emails) are blocked before booking confirmation to prevent commission bypass. Please ask your questions directly without sharing contact info.",
        },
        { status: 400 }
      );
    }

    const cleanMessage = maskContactLeakage(rawMessage);

    // Create enquiry record in Neon DB
    const enquiry = await prisma.enquiry.create({
      data: {
        destination: listingTitle || "Northern Tour Inquiry",
        travelDate: null,
        travelers: 1,
        budgetRange: null,
        customerName: senderName.trim(),
        customerPhone: "RELAY_VIA_PLATFORM",
        customerEmail: senderEmail.trim().toLowerCase(),
        specialRequests: `[Listing: ${listingId || "N/A"}] [Vendor: ${vendorId || "N/A"}]\n${cleanMessage}`,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been relayed to the tour operator. They will reply to your registered email.",
      enquiryId: enquiry.id,
    });
  } catch (error: any) {
    console.error("Operator message relay error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message to operator. Please try again later." },
      { status: 500 }
    );
  }
}
