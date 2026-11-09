import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";
import { generateTotpSecret, getOtpAuthUrl, generateRecoveryCodes } from "@/lib/totp";
import { encryptTotpSecret } from "@/lib/totpCrypto";
import { getTrustedClientIp } from "@/lib/clientIp";
import { checkServerlessRateLimit } from "@/lib/serverlessRateLimiter";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientIp = getTrustedClientIp(req.headers);
  const rateResult = await checkServerlessRateLimit(`2fa-setup:ip:${clientIp}`, 5, 300);
  if (!rateResult.success) {
    return NextResponse.json(
      { error: "Too many 2FA setup attempts. Please try again in 5 minutes." },
      { 
        status: 429,
        headers: { "Retry-After": String(rateResult.retryAfterSeconds) }
      }
    );
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
