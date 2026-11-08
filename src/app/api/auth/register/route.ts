import { NextResponse } from "next/server";
import { z } from "zod";
import { registerLocalUser, findUserByEmail } from "@/services/user.service";
import { checkRateLimit } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Invalid email address").max(120),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["CUSTOMER", "VENDOR"]).default("CUSTOMER"),
  businessName: z.string().max(100).optional(),
  city: z.string().max(60).optional(),
  whatsapp: z.string().max(30).optional(),
  cnicOrTaxNumber: z.string().max(40).optional(),
});

export async function POST(req: Request) {
  try {
    // 1. IP-based rate limiting on registration (max 5 registrations per 10 minutes)
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";

    const rateCheck = checkRateLimit(`register-ip:${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: "Too many registration attempts. Please try again later.",
          retryAfterSeconds: rateCheck.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
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

    return NextResponse.json(
      {
        message: "Registration successful",
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
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating account" },
      { status: 500 }
    );
  }
}
