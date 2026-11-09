import { NextRequest, NextResponse } from "next/server";
import { getTrustedClientIp } from "@/lib/clientIp";
import { completePasswordReset } from "@/services/passwordReset.service";
import { z } from "zod";

const completeResetSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  code: z.string().min(6, "Verification code must be 6 digits.").max(6, "Verification code must be 6 digits."),
  newPassword: z.string().min(12, "New password must be at least 12 characters long."),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = completeResetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Email, 6-digit code, and valid new password (12+ chars) are required." },
        { status: 400 }
      );
    }

    const { email, code, newPassword } = parsed.data;
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
