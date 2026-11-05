import { NextResponse } from "next/server";
import { z } from "zod";
import { registerLocalUser, findUserByEmail } from "@/services/user.service";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "VENDOR"]).default("CUSTOMER"),
  businessName: z.string().optional(),
  city: z.string().optional(),
  cnicOrTaxNumber: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, password, role, businessName, city, cnicOrTaxNumber } = parsed.data;
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
