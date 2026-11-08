import { NextRequest, NextResponse } from "next/server";
import { getTrustedClientIp } from "@/lib/clientIp";
import { requestPasswordReset } from "@/services/passwordReset.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const clientIp = getTrustedClientIp(req.headers);
    const result = await requestPasswordReset(email, clientIp);

    if (!result.success) {
      return NextResponse.json({ error: result.error || result.message }, { status: 429 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err: any) {
    console.error("POST /api/auth/password-reset/request error:", err);
    return NextResponse.json({ error: "Failed to process password reset request." }, { status: 500 });
  }
}
