import { NextRequest, NextResponse } from "next/server";
import { getTrustedClientIp } from "@/lib/clientIp";
import { completePasswordReset } from "@/services/passwordReset.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Email, 6-digit code, and new password are required." },
        { status: 400 }
      );
    }

    const clientIp = getTrustedClientIp(req.headers);
    const result = await completePasswordReset(email, code, newPassword, clientIp);

    if (!result.success) {
      return NextResponse.json({ error: result.error || result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err: any) {
    console.error("POST /api/auth/password-reset/complete error:", err);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}
