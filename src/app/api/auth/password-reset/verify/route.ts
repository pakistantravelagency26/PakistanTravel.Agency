import { NextRequest, NextResponse } from "next/server";
import { getTrustedClientIp } from "@/lib/clientIp";
import { checkServerlessRateLimit } from "@/lib/serverlessRateLimiter";
import { verifyResetCode } from "@/services/passwordReset.service";
import { z } from "zod";

const verifyResetSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  code: z.string().min(6, "Verification code must be 6 digits.").max(6, "Verification code must be 6 digits."),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifyResetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Email and 6-digit verification code are required." },
        { status: 400 }
      );
    }

    const { email, code } = parsed.data;
    const clientIp = getTrustedClientIp(req.headers);

    const rateResult = await checkServerlessRateLimit(`reset-verify:ip:${clientIp}`, 10, 600);
    if (!rateResult.success) {
      return NextResponse.json(
        { valid: false, error: "Too many verification attempts. Please try again in 10 minutes." },
        { 
          status: 429,
          headers: { "Retry-After": String(rateResult.retryAfterSeconds) }
        }
      );
    }

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
