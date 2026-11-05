import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVendorById, deleteVendorAccount } from "@/services/vendor.service";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 1. Delete permanently from Neon PostgreSQL Database
    let deletedFromDb = false;
    let companyName = "";
    try {
      const vendor = await prisma.vendor.findUnique({
        where: { id },
        include: { user: true },
      });

      if (vendor) {
        companyName = vendor.businessName;
        // Cascade delete vendor (automatically deletes their listings due to onDelete: Cascade)
        await prisma.vendor.delete({ where: { id } });
        if (vendor.userId) {
          await prisma.user.delete({ where: { id: vendor.userId } }).catch(() => {});
        }
        deletedFromDb = true;
      }
    } catch (dbErr) {
      console.warn("Prisma vendor delete error:", dbErr);
    }

    // 2. Also delete from in-memory store
    const localVendor = getVendorById(id);
    if (localVendor && !companyName) {
      companyName = localVendor.companyName;
    }
    const deletedLocally = deleteVendorAccount(id);

    if (!deletedFromDb && !deletedLocally) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Partner account "${companyName || id}" and all associated listings have been permanently deleted from the database.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
