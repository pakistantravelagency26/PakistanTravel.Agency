import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { toggleVendorStatus } from "@/services/vendor.service";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = params;
    const body = await req.json().catch(() => ({}));

    // 1. Update in Neon PostgreSQL Database permanently
    let updatedDbVendor = null;
    try {
      const current = await prisma.vendor.findUnique({ where: { id }, include: { user: true } });
      if (current) {
        let nextStatus: "VERIFIED" | "SUSPENDED" | "REJECTED";
        if (body?.action === "APPROVE" || body?.status === "ENABLED") {
          nextStatus = "VERIFIED";
        } else if (body?.action === "REJECT") {
          nextStatus = "REJECTED";
        } else {
          nextStatus = current.status === "VERIFIED" ? "SUSPENDED" : "VERIFIED";
        }

        updatedDbVendor = await prisma.vendor.update({
          where: { id },
          data: { status: nextStatus },
        });
      }
    } catch (dbErr) {
      console.warn("DB status toggle error:", dbErr);
    }

    // 2. Also update in-memory
    const updated = toggleVendorStatus(id);

    if (!updated && !updatedDbVendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    const currentStatus = updatedDbVendor
      ? (updatedDbVendor.status === "VERIFIED" ? "ENABLED" : "DISABLED")
      : updated?.status;

    return NextResponse.json({
      success: true,
      vendor: {
        id,
        status: currentStatus,
        companyName: updatedDbVendor?.businessName || updated?.companyName,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
