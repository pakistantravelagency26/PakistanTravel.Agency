import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view"); // "tickets" | "logs"
    const status = searchParams.get("status");

    if (view === "logs") {
      const chatSessions = await prisma.chatSession.findMany({
        take: 30,
        orderBy: { createdAt: "desc" },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      return NextResponse.json({
        success: true,
        sessions: chatSessions,
      });
    }

    // Default: fetch tickets
    const where: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (error: unknown) {
    console.error("[AdminTicketsAPI] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { ticketId, status, priority, adminNotes } = body;

    if (!ticketId) {
      return NextResponse.json({ success: false, error: "Ticket ID is required" }, { status: 400 });
    }

    const updated = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      ticket: updated,
    });
  } catch (error: unknown) {
    console.error("[AdminTicketsAPI] PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
