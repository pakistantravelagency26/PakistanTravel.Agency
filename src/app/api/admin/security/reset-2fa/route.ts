import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const auth = requireRole(session, ["ADMIN"]);
  if (!auth.authorized || !session?.user) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
  }

  // Enforce SUPER_ADMIN authority only
  const isSuperAdmin =
    session!.user?.role === "ADMIN" &&
    ((session!.user as any).staffRole === "SUPER_ADMIN" || (session!.user as any).permissions === "ALL");

  if (!isSuperAdmin) {
    return NextResponse.json(
      { error: "Forbidden: Only Super Administrators can reset 2FA configuration." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { userId, reason } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Missing or invalid userId" }, { status: 400 });
    }

    // Prohibit resetting own 2FA
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: "Forbidden: Administrators cannot reset their own 2FA credentials. Another Super Admin must perform this action." },
        { status: 400 }
      );
    }

    // Require identity verification reason
    if (!reason || typeof reason !== "string" || reason.trim().length < 5) {
      return NextResponse.json(
        { error: "A documented identity verification reason (minimum 5 characters) is required for audit compliance." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    const adminEmail = session.user.email || "admin@pakistantravel.agency";

    // Atomically reset 2FA fields and invalidate active sessions via tokenVersion & sessionVersion
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null,
          twoFactorPendingSecret: null,
          twoFactorRecoveryCodes: null,
          twoFactorEnrolledAt: null,
          tokenVersion: { increment: 1 },
          sessionVersion: { increment: 1 },
        },
      }),
      prisma.auditLog.create({
        data: {
          action: "ADMIN_RESET_2FA",
          actorId: session.user.id,
          actorEmail: adminEmail,
          resourceType: "USER",
          resourceId: userId,
          details: `Super Admin ${adminEmail} reset 2FA for ${targetUser.email}. Identity verification reason: ${reason.trim()}. Active sessions revoked; user forced to re-enroll on next login.`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `2FA has been successfully reset for ${targetUser.email}. They will be required to re-enroll on next sign-in.`,
    });
  } catch (err: any) {
    console.error("POST /api/admin/security/reset-2fa error:", err);
    return NextResponse.json({ error: "Failed to reset 2FA for user" }, { status: 500 });
  }
}
