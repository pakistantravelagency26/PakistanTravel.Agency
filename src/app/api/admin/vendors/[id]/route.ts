import { NextResponse } from "next/server";
import { getVendorById, deleteVendorAccount } from "@/services/vendor.service";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const vendor = getVendorById(id);

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    // Security check: Vendor can only be deleted if they are disabled first
    if (vendor.status !== "DISABLED") {
      return NextResponse.json(
        { 
          success: false, 
          error: "Vendor must be disabled before they can be deleted. Please disable the partner account first." 
        },
        { status: 400 }
      );
    }

    const companyName = vendor.companyName;
    const deleted = deleteVendorAccount(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Failed to delete partner account" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Partner account "${companyName}" and all associated listings have been deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
