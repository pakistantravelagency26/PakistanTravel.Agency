import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyTotpCode } from "@/lib/totp";
import { decryptTotpSecret } from "@/lib/totpCrypto";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { code } = body;

    if (!code || !/^\d{6}$/.test(code.trim())) {
      return NextResponse.json({ error: "Please enter a valid 6-digit code from Google Authenticator." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.twoFactorPendingSecret) {
      return NextResponse.json({ error: "No pending 2FA setup found. Please start setup again." }, { status: 400 });
    }

    const decryptedSecret = decryptTotpSecret(user.twoFactorPendingSecret);
    const isValid = verifyTotpCode(code.trim(), decryptedSecret, 1);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code. Please check the code shown in Google Authenticator and try again." },
        { status: 400 }
      );
    }

    // Promote pending secret to active 2FA secret
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorSecret: user.twoFactorPendingSecret,
        twoFactorPendingSecret: null,
        twoFactorEnabled: true,
        twoFactorEnrolledAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "2FA_ENROLLED",
        actorEmail: user.email,
        actorId: user.id,
        resourceType: "USER",
        resourceId: user.id,
        details: "Mandatory Google Authenticator 2FA successfully configured and verified.",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Two-Factor Authentication has been successfully enabled on your account.",
    });
  } catch (err: any) {
    console.error("POST /api/auth/2fa/confirm error:", err);
    return NextResponse.json({ error: "Failed to confirm 2FA" }, { status: 500 });
  }
}
