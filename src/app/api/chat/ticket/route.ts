import { NextRequest, NextResponse } from "next/server";
import { createSupportTicket } from "@/lib/supportTickets";
import { z } from "zod";

export const dynamic = "force-dynamic";

const chatTicketSchema = z.object({
  customerName: z.string().min(2, "Your name is required.").max(100),
  customerContact: z.string().min(5, "A valid email address or phone number is required.").max(100),
  category: z.enum(["GENERAL", "COMPLAINT", "REFUND", "PAYMENT"]).default("GENERAL"),
  message: z.string().min(5, "Please enter your message or complaint details.").max(2000),
  sessionId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = chatTicketSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid ticket data format." },
        { status: 400 }
      );
    }

    const { customerName, customerContact, category, message, sessionId, metadata } = parsed.data;

    const ticket = await createSupportTicket({
      customerName: customerName.trim(),
      customerContact: customerContact.trim(),
      category: category || "GENERAL",
      message: message.trim(),
      source: "CHATBOT",
      metadata: {
        ...(metadata || {}),
        sessionId,
      },
    });

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    });
  } catch (err: unknown) {
    console.error("[SupportTicketAPI] Creation error:", err);
    return NextResponse.json(
      { error: "Failed to create support ticket. Please contact support via email." },
      { status: 500 }
    );
  }
}
