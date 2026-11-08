import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const auth = requireRole(session, ["ADMIN"]);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { userId, reason } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Missing or invalid userId" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    const adminEmail = session?.user?.email || "admin@pakistantravel.agency";

    // Reset 2FA fields and invalidate active sessions for security
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
        },
      }),
      prisma.auditLog.create({
        data: {
          action: "ADMIN_RESET_2FA",
          actorEmail: adminEmail,
          resourceType: "USER",
          resourceId: userId,
          details: `Admin ${adminEmail} reset 2FA for ${targetUser.email}. Reason: ${reason || "Account recovery requested"}. User must re-enroll.`,
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
