import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";
import { generateTotpSecret, getOtpAuthUrl, generateRecoveryCodes } from "@/lib/totp";
import { encryptTotpSecret } from "@/lib/totpCrypto";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate secret and recovery codes
    const secret = generateTotpSecret();
    const otpAuthUrl = getOtpAuthUrl(user.email, secret);
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl, {
      margin: 1,
      width: 250,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });

    const { plaintext, hashed } = generateRecoveryCodes(10);
    const encryptedSecret = encryptTotpSecret(secret);

    // Save pending secret & hashed recovery codes
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorPendingSecret: encryptedSecret,
        twoFactorRecoveryCodes: JSON.stringify(hashed),
      },
    });

    return NextResponse.json({
      secret,
      qrCodeDataUrl,
      recoveryCodes: plaintext,
    });
  } catch (err: any) {
    console.error("POST /api/auth/2fa/setup error:", err);
    return NextResponse.json({ error: "Failed to initiate 2FA setup" }, { status: 500 });
  }
}
