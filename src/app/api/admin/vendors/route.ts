import { NextResponse } from "next/server";
import { getAllVendors, createVendorAccount } from "@/services/vendor.service";
import { getAllListingsForAdmin } from "@/services/listing.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const vendors = getAllVendors();
    const allListings = getAllListingsForAdmin();

    // compute dynamic listings count for each vendor in real-time
    const vendorsWithCounts = vendors.map((v) => {
      const count = allListings.filter((l) => l.vendor?.id === v.id).length;
      return {
        ...v,
        listingsCount: count,
      };
    });

    return NextResponse.json({
      success: true,
      vendors: vendorsWithCounts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.companyName || !body.city || !body.email || !body.loginId || !body.passwordPlain) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Company Name, City, Email, Login ID and Password are required." 
        },
        { status: 400 }
      );
    }

    const newVendor = await createVendorAccount({
      companyName: body.companyName,
      city: body.city,
      tourismLicense: body.tourismLicense || "DTS-PENDING",
      phone1: body.phone1 || "03000000000",
      phone2: body.phone2 || "",
      phone3: body.phone3 || "",
      email: body.email,
      loginId: body.loginId,
      passwordPlain: body.passwordPlain,
    });

    return NextResponse.json({
      success: true,
      vendor: {
        ...newVendor,
        listingsCount: 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
