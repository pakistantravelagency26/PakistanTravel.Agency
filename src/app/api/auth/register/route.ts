import { NextResponse } from "next/server";
import { z } from "zod";
import { registerLocalUser, findUserByEmail } from "@/services/user.service";
import { checkServerlessRateLimit } from "@/lib/serverlessRateLimiter";
import { getTrustedClientIp } from "@/lib/clientIp";
import { validatePasswordStrength } from "@/lib/password";

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
    email: z.string().email("Invalid email address").max(120),
    phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
    password: z
      .string()
      .min(12, "Password must be at least 12 characters long")
      .superRefine((val, ctx) => {
        const check = validatePasswordStrength(val);
        if (!check.valid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: check.error || "Password does not meet complexity requirements",
          });
        }
      }),
    role: z.enum(["CUSTOMER", "VENDOR"]).default("CUSTOMER"),
    businessName: z.string().max(100).optional(),
    city: z.string().max(60).optional(),
    whatsapp: z.string().max(30).optional(),
    cnicOrTaxNumber: z.string().max(40).optional(),
    listingType: z.literal("TOUR").optional(),
  })
  .strict();

export async function POST(req: Request) {
  try {
    // 1. IP-based rate limiting on registration (max 5 registrations per 10 minutes)
    const clientIp = getTrustedClientIp(req.headers);
    const rateCheck = await checkServerlessRateLimit(`register-ip:${clientIp}`, 5, 600);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: "Too many registration attempts. Please try again later.",
          retryAfterSeconds: rateCheck.retryAfterSeconds,
        },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    // Explicit rejection of privilege escalation attempts
    if (body.role === "ADMIN" || body.role === "SUPER_ADMIN" || body.staffRole || body.permissions) {
      return NextResponse.json(
        { error: "Unauthorized role assignment. Administrative accounts cannot be registered via public web forms." },
        { status: 403 }
      );
    }

    if (
      body.status !== undefined ||
      body.commissionRate !== undefined ||
      body.payoutSchedule !== undefined ||
      body.isVerified !== undefined
    ) {
      return NextResponse.json(
        { error: "Client-controlled status or commission fields are prohibited." },
        { status: 400 }
      );
    }

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, password, role, businessName, city, whatsapp, cnicOrTaxNumber } = parsed.data;

    // Strict vendor WhatsApp validation: required Pakistani mobile format
    if (role === "VENDOR") {
      const cleanWa = (whatsapp || "").replace(/[\s\-()]/g, "");
      const isPakistaniWa = /^(\+92|0|92)?3\d{9}$/.test(cleanWa);
      if (!whatsapp || !isPakistaniWa) {
        return NextResponse.json(
          { error: "A valid Pakistani WhatsApp number is required for operator registration (e.g. 03001234567 or +92 300 1234567)." },
          { status: 400 }
        );
      }
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already registered
    const existing = await findUserByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const newUser = await registerLocalUser({
      name,
      email: normalizedEmail,
      phone,
      password,
      role,
      businessName,
      city,
      whatsapp,
      cnicOrTaxNumber,
    });

    // If registered as VENDOR / Tour Operator, dispatch transactional emails
    if (role === "VENDOR") {
      try {
        const { sendPartnerRegistrationEmails } = await import("@/services/email.service");
        await sendPartnerRegistrationEmails({
          companyName: businessName || `${name}'s Travel Agency`,
          contactName: name,
          email: normalizedEmail,
          phone,
          whatsapp,
          city,
          cnicOrTaxNumber,
        });
      } catch (mailErr) {
        console.warn("[REGISTER API] Failed to send partner registration emails:", mailErr);
      }
    }

    return NextResponse.json(
      {
        message: role === "VENDOR"
          ? "Partner registration submitted successfully. Your account is awaiting administrative approval."
          : "Registration successful",
        pendingApproval: role === "VENDOR",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
