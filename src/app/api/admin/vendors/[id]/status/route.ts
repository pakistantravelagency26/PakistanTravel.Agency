import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toggleVendorStatus } from "@/services/vendor.service";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 1. Update in Neon PostgreSQL Database permanently
    let updatedDbVendor = null;
    try {
      const current = await prisma.vendor.findUnique({ where: { id } });
      if (current) {
        const nextStatus = current.status === "VERIFIED" ? "SUSPENDED" : "VERIFIED";
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
