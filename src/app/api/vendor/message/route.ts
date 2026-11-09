import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkServerlessRateLimit } from "@/lib/serverlessRateLimiter";
import { getTrustedClientIp } from "@/lib/clientIp";
import { containsContactLeakage, maskContactLeakage } from "@/lib/antiLeakage";
import { z } from "zod";

export const dynamic = "force-dynamic";

const operatorMessageSchema = z.object({
  listingId: z.string().optional().nullable(),
  listingTitle: z.string().optional().nullable(),
  vendorId: z.string().optional().nullable(),
  senderName: z.string().min(2, "Please provide your full name.").max(100),
  senderEmail: z.string().email("A valid email is required to receive the operator's response."),
  message: z.string().min(10, "Please write a message with at least 10 characters.").max(1500, "Message exceeds maximum allowed length of 1500 characters."),
}).strict();

export async function POST(req: Request) {
  try {
    const clientIp = getTrustedClientIp(req.headers);
    const rateCheck = await checkServerlessRateLimit(`operator-msg:${clientIp}`, 5, 600);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many inquiries sent. Please retry after ${rateCheck.retryAfterSeconds} seconds.`,
        },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const parsed = operatorMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { listingId, listingTitle, vendorId, senderName, senderEmail, message } = parsed.data;
    const rawMessage = message.trim();

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
