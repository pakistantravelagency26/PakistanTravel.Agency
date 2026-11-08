import { NextRequest, NextResponse } from "next/server";
import { createSupportTicket } from "@/lib/supportTickets";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { customerName, customerContact, category, message, sessionId, metadata } = body;

    if (!customerName || typeof customerName !== "string" || !customerName.trim()) {
      return NextResponse.json({ error: "Your name is required." }, { status: 400 });
    }

    if (!customerContact || typeof customerContact !== "string" || !customerContact.trim()) {
      return NextResponse.json(
        { error: "A valid email address or phone number is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Please enter your message or complaint details." }, { status: 400 });
    }

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
