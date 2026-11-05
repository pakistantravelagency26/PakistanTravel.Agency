import { NextResponse } from "next/server";
import { getAllListingsForAdmin } from "@/services/listing.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const listings = getAllListingsForAdmin();
    return NextResponse.json({
      success: true,
      listings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
