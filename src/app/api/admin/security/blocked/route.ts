import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { unblockLogin } from "@/lib/loginThrottle";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const auth = requireRole(session, ["ADMIN"]);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const blockedLogins = await prisma.blockedLogin.findMany({
      orderBy: { blockedAt: "desc" },
      take: 50,
    });

    const recentAuditLogs = await prisma.auditLog.findMany({
      where: {
        action: {
          in: ["ACCOUNT_LOCKED_3_FAILS", "IP_BLOCKED_EXCESSIVE_FAILURES", "MANUAL_LOGIN_UNBLOCK"],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      blockedLogins,
      recentAuditLogs,
    });
  } catch (err: any) {
    console.error("GET /api/admin/security/blocked error:", err);
    return NextResponse.json({ error: "Failed to load security status" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const auth = requireRole(session, ["ADMIN"]);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { blockId } = body;

    if (!blockId || typeof blockId !== "string") {
      return NextResponse.json({ error: "Missing or invalid blockId" }, { status: 400 });
    }

    const adminEmail = session?.user?.email || "admin@pakistantravel.agency";
    const success = await unblockLogin(blockId, adminEmail);

    if (!success) {
      return NextResponse.json({ error: "Failed to unblock target or record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Target unblocked successfully" });
  } catch (err: any) {
    console.error("POST /api/admin/security/blocked error:", err);
    return NextResponse.json({ error: "Failed to process unblock" }, { status: 500 });
  }
}
