import { NextRequest, NextResponse } from "next/server";
import { getTrustedClientIp } from "@/lib/clientIp";
import { checkServerlessRateLimit } from "@/lib/serverlessRateLimiter";
import { requestPasswordReset } from "@/services/passwordReset.service";
import { z } from "zod";

const requestResetSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestResetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid email address format." },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const clientIp = getTrustedClientIp(req.headers);

    const rateResult = await checkServerlessRateLimit(`reset-request:ip:${clientIp}`, 5, 600);
    if (!rateResult.success) {
      return NextResponse.json(
        { error: "Too many password reset requests. Please try again in 10 minutes." },
        { 
          status: 429,
          headers: { "Retry-After": String(rateResult.retryAfterSeconds) }
        }
      );
    }

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
