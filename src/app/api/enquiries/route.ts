import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { maskContactLeakage } from "@/lib/antiLeakage";

const enquirySchema = z.object({
  destination: z.string().min(2, "Destination is required").max(100),
  travelDate: z.string().optional().nullable(),
  travelers: z.number().int().min(1).max(100).default(1),
  budgetRange: z.string().max(100).optional().nullable(),
  customerName: z.string().min(2, "Name must be at least 2 characters").max(100),
  customerPhone: z.string().min(8, "Phone number is required").max(30),
  customerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  specialRequests: z.string().max(1000).optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const {
      destination,
      travelDate,
      travelers,
      budgetRange,
      customerName,
      customerPhone,
      customerEmail,
      specialRequests,
    } = parsed.data;

    const enquiry = await prisma.enquiry.create({
      data: {
        destination,
        travelDate: travelDate || null,
        travelers: travelers || 1,
        budgetRange: budgetRange || null,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        specialRequests: specialRequests ? maskContactLeakage(specialRequests) : null,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      message: "Custom journey enquiry submitted successfully.",
    });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit custom trip enquiry" },
      { status: 500 }
    );
  }
}
