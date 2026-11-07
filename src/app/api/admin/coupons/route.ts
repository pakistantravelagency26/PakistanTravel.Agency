import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { validUntil: "desc" },
    });

    return NextResponse.json({
      success: true,
      coupons: coupons.map((c) => ({
        id: c.id,
        code: c.code,
        discountPercent: c.discountPercent,
        flatDiscount: c.flatDiscount ? Number(c.flatDiscount) : null,
        minSpend: c.minSpend ? Number(c.minSpend) : null,
        validUntil: c.validUntil.toISOString(),
        usedCount: c.usedCount,
        maxUses: c.maxUses,
        isActive: c.isActive,
      })),
    });
  } catch (error: any) {
    console.error("Fetch coupons error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { code, discountPercent, flatDiscount, minSpend, validUntil, maxUses } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: "Coupon code is required" }, { status: 400 });
    }

    const normalizedCode = code.toUpperCase().trim();

    const existing = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Coupon code '${normalizedCode}' already exists.` },
        { status: 400 }
      );
    }

    const expiryDate = validUntil ? new Date(validUntil) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    const coupon = await prisma.coupon.create({
      data: {
        code: normalizedCode,
        discountPercent: discountPercent ? parseInt(discountPercent, 10) : null,
        flatDiscount: flatDiscount ? parseFloat(flatDiscount) : null,
        minSpend: minSpend ? parseFloat(minSpend) : null,
        validFrom: new Date(),
        validUntil: expiryDate,
        maxUses: maxUses ? parseInt(maxUses, 10) : 100,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    console.error("Create coupon error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
