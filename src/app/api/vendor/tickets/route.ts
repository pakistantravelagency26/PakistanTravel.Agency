import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createSupportTicket } from "@/lib/supportTickets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized: Vendor session required" }, { status: 401 });
    }

    const email = session.user.email?.toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ success: false, error: "Missing vendor email" }, { status: 400 });
    }

    const tickets = await prisma.supportTicket.findMany({
      where: {
        OR: [
          { customerContact: email },
          { source: "VENDOR" },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Filter to only this vendor's tickets if not admin
    const vendorTickets = session.user.role === "ADMIN" 
      ? tickets 
      : tickets.filter((t) => t.customerContact?.toLowerCase() === email);

    return NextResponse.json({
      success: true,
      tickets: vendorTickets,
    });
  } catch (error: any) {
    console.error("[VendorTicketsAPI] GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized: Vendor session required" }, { status: 401 });
    }

    const body = await req.json();
    const { category, priority, message, subject } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ success: false, error: "Please enter your message or question details." }, { status: 400 });
    }

    const vendorName = session.user.name || "Verified Partner";
    const vendorEmail = session.user.email || "";

    const combinedMessage = subject 
      ? `[Subject: ${subject.trim()}]\n\n${message.trim()}`
      : message.trim();

    const ticket = await createSupportTicket({
      customerName: vendorName,
      customerContact: vendorEmail,
      category: category || "GENERAL",
      message: combinedMessage,
      source: "CONTACT_FORM",
      metadata: {
        isVendor: true,
        vendorId: (session.user as any).vendorId || null,
        vendorRole: session.user.role,
        priority: priority || "MEDIUM",
      },
    });

    // Update source to VENDOR
    await prisma.supportTicket.update({
      where: { id: ticket.id },
      data: {
        source: "VENDOR",
        priority: priority || "MEDIUM",
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
      message: `Support ticket ${ticket.ticketNumber} opened successfully. PakistanTravel.Agency support desk will respond shortly.`,
    });
  } catch (error: any) {
    console.error("[VendorTicketsAPI] POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
