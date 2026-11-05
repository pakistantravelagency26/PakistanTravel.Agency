import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { moderateListing } from "@/services/listing.service";

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

    // 1. Update permanently in Neon PostgreSQL Database
    let updatedDbListing = null;
    try {
      const dbStatus = action === "APPROVE" ? "PUBLISHED" : "ARCHIVED";
      updatedDbListing = await prisma.listing.update({
        where: { id },
        data: { status: dbStatus },
        include: { vendor: true },
      });
    } catch (dbErr) {
      console.warn("DB listing moderate error:", dbErr);
    }

    // 2. Also update in-memory
    const updated = moderateListing(
      id,
      action === "APPROVE" ? "APPROVED" : "REJECTED",
      body.notes
    );

    if (!updated && !updatedDbListing) {
      return NextResponse.json(
        { success: false, error: "Listing not found" },
        { status: 404 }
      );
    }

    const title = updatedDbListing?.title || updated?.title;

    return NextResponse.json({
      success: true,
      message:
        action === "APPROVE"
          ? `Listing "${title}" has been approved and is now live on PakistanTravel.Agency marketplace!`
          : `Listing "${title}" was marked as revision required/rejected.`,
      listing: updated || {
        id,
        title,
        moderationStatus: action === "APPROVE" ? "APPROVED" : "REJECTED",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
