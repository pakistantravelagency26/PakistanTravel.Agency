import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { processPendingEmailOutbox } from "@/services/email.service";

/**
 * GET /api/admin/emails/outbox
 * Returns aggregated outbox statistics and recent outgoing communications
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const auth = requireRole(session, ["ADMIN"]);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const [pendingCount, sentCount, failedCount, recentEmails] = await Promise.all([
      prisma.emailOutbox.count({ where: { status: "PENDING" } }),
      prisma.emailOutbox.count({ where: { status: "SENT" } }),
      prisma.emailOutbox.count({ where: { status: "FAILED" } }),
      prisma.emailOutbox.findMany({
        take: 30,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          to: true,
          recipientRole: true,
          subject: true,
          eventType: true,
          status: true,
          attempts: true,
          lastError: true,
          sentAt: true,
          createdAt: true,
          bookingId: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        pending: pendingCount,
        sent: sentCount,
        failed: failedCount,
        total: pendingCount + sentCount + failedCount,
      },
      emails: recentEmails,
    });
  } catch (err: any) {
    console.error("GET /api/admin/emails/outbox error:", err);
    return NextResponse.json({ error: "Failed to retrieve outbox statistics" }, { status: 500 });
  }
}

/**
 * POST /api/admin/emails/outbox
 * Manually trigger outbox delivery retry worker
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const auth = requireRole(session, ["ADMIN"]);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const result = await processPendingEmailOutbox(50);
    return NextResponse.json({
      success: true,
      message: `Processed ${result.processed} pending email(s): ${result.succeeded} succeeded, ${result.failed} failed.`,
      result,
    });
  } catch (err: any) {
    console.error("POST /api/admin/emails/outbox error:", err);
    return NextResponse.json({ error: "Failed to run outbox retry engine" }, { status: 500 });
  }
}
