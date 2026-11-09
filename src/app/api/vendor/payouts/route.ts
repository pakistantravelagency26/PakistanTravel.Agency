import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole, requireVendorOwnership } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Vendor Payouts API
 * Enforces strict multi-tenant vendor isolation.
 * Vendor A cannot view or request payouts for Vendor B.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["VENDOR", "ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    let vendorId = session?.user?.vendorId;
    if (!vendorId && session?.user?.id) {
      const vendor = await prisma.vendor.findFirst({ where: { userId: session.user.id } });
      if (vendor) vendorId = vendor.id;
    }

    if (!vendorId && session?.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "No vendor profile linked to this account." }, { status: 403 });
    }

    const payouts = await prisma.payout.findMany({
      where: session?.user?.role === "ADMIN" ? {} : { vendorId: vendorId! },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      payouts: payouts.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        status: p.status,
        referenceCode: p.referenceCode,
        notes: p.notes,
        processedAt: p.processedAt?.toISOString() || null,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("[VendorPayoutsAPI] GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["VENDOR", "ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    let vendorId = session?.user?.vendorId;
    if (!vendorId && session?.user?.id) {
      const vendor = await prisma.vendor.findFirst({ where: { userId: session.user.id } });
      if (vendor) vendorId = vendor.id;
    }

    if (!vendorId) {
      return NextResponse.json({ success: false, error: "No vendor profile linked to this account." }, { status: 403 });
    }

    const body = await req.json();
    const amount = Number(body.amount);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: "Valid positive payout amount is required." }, { status: 400 });
    }

    // Create payout strictly linked to authenticated vendor's ID (preventing IDOR)
    const newPayout = await prisma.payout.create({
      data: {
        vendorId,
        amount,
        status: "PENDING",
        notes: body.notes ? String(body.notes).slice(0, 500) : "Vendor initiated bank withdrawal request.",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Withdrawal request for PKR ${amount.toLocaleString()} submitted successfully.`,
      payout: {
        id: newPayout.id,
        amount: Number(newPayout.amount),
        status: newPayout.status,
        createdAt: newPayout.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error("[VendorPayoutsAPI] POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
