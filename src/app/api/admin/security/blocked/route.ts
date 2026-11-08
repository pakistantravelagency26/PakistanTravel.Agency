import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { unblockLogin, clearMemoryLocks, getPairKey, getIpKey } from "@/lib/loginThrottle";

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
          in: [
            "ACCOUNT_LOCKED_3_FAILS",
            "IP_BLOCKED_EXCESSIVE_FAILURES",
            "MANUAL_LOGIN_UNBLOCK",
            "ADMIN_RESET_2FA",
            "STAFF_SUSPENDED",
            "STAFF_UNBLOCKED",
            "STAFF_DELETED",
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const recentFailedAttempts = await prisma.loginAttempt.findMany({
      where: { success: false },
      orderBy: { attemptAt: "desc" },
      take: 25,
    });

    return NextResponse.json({
      blockedLogins,
      recentAuditLogs,
      recentFailedAttempts,
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
    const { blockId, target } = body;

    const adminEmail = session?.user?.email || "admin@pakistantravel.agency";

    if (blockId && typeof blockId === "string") {
      const success = await unblockLogin(blockId, adminEmail);
      if (!success) {
        return NextResponse.json({ error: "Failed to unblock target or record not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Target unblocked successfully" });
    }

    if (target && typeof target === "string") {
      const cleanTarget = target.trim().toLowerCase();
      const updated = await prisma.blockedLogin.updateMany({
        where: {
          target: cleanTarget,
          unblockedAt: null,
        },
        data: {
          unblockedAt: new Date(),
          unblockedBy: adminEmail,
        },
      });

      clearMemoryLocks();

      await prisma.auditLog.create({
        data: {
          action: "MANUAL_LOGIN_UNBLOCK",
          actorId: session?.user?.id || null,
          actorEmail: adminEmail,
          resourceType: "LOGIN_BLOCK",
          details: `Admin ${adminEmail} cleared all blocks for target: ${cleanTarget} (${updated.count} records cleared).`,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Cleared blocks for target "${cleanTarget}" (${updated.count} active blocks removed).`,
      });
    }

    return NextResponse.json({ error: "Missing or invalid blockId or target" }, { status: 400 });
  } catch (err: any) {
    console.error("POST /api/admin/security/blocked error:", err);
    return NextResponse.json({ error: "Failed to process unblock" }, { status: 500 });
  }
}
