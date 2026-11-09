import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Super Admin Payout Management API
 * Server-side RBAC: ADMIN role only.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const payouts = await prisma.payout.findMany({
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            phone: true,
            bankDetails: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      payouts: payouts.map((p) => ({
        id: p.id,
        vendorId: p.vendorId,
        businessName: p.vendor.businessName,
        amount: Number(p.amount),
        status: p.status,
        referenceCode: p.referenceCode,
        notes: p.notes,
        bankDetails: p.vendor.bankDetails,
        processedAt: p.processedAt?.toISOString() || null,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("[AdminPayoutsAPI] GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { payoutId, status, referenceCode, notes } = body;

    if (!payoutId) {
      return NextResponse.json({ success: false, error: "Payout ID is required." }, { status: 400 });
    }

    const validStatuses = ["PENDING", "PROCESSING", "COMPLETED", "REJECTED"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid payout status." }, { status: 400 });
    }

    const updated = await prisma.payout.update({
      where: { id: payoutId },
      data: {
        ...(status ? { status: status as any } : {}),
        ...(referenceCode ? { referenceCode: String(referenceCode).trim() } : {}),
        ...(notes !== undefined ? { notes: String(notes).trim() } : {}),
        ...(status === "COMPLETED" ? { processedAt: new Date() } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Payout ${updated.id} status updated to ${updated.status}.`,
      payout: updated,
    });
  } catch (error: any) {
    console.error("[AdminPayoutsAPI] PATCH Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
