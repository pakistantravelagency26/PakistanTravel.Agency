import { NextResponse } from "next/server";
import { moderateListing, getListingBySlugOrId } from "@/services/listing.service";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const action = body.action as "APPROVE" | "REJECT";
    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json(
        { success: false, error: "Action must be either APPROVE or REJECT" },
        { status: 400 }
      );
    }

    const updated = moderateListing(
      id,
      action === "APPROVE" ? "APPROVED" : "REJECTED",
      body.notes
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        action === "APPROVE"
          ? `Listing "${updated.title}" has been approved and is now live on PakistanTravel.Agency marketplace!`
          : `Listing "${updated.title}" was marked as revision required/rejected.`,
      listing: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
