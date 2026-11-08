import { NextRequest, NextResponse } from "next/server";
import { getTrustedClientIp } from "@/lib/clientIp";
import { verifyResetCode } from "@/services/passwordReset.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ error: "Email and 6-digit verification code are required." }, { status: 400 });
    }

    const clientIp = getTrustedClientIp(req.headers);
    const result = await verifyResetCode(email, code, clientIp);

    if (!result.valid) {
      return NextResponse.json({ valid: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ valid: true, message: "Code verified successfully." });
  } catch (err: any) {
    console.error("POST /api/auth/password-reset/verify error:", err);
    return NextResponse.json({ error: "Failed to verify reset code." }, { status: 500 });
  }
}
