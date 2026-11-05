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
      const updateData: any = { status: dbStatus };
      if (body.commissionRate !== undefined && body.commissionRate !== null) {
        updateData.commissionRate = Number(body.commissionRate);
      }
      if (body.vendorPrice !== undefined && body.vendorPrice !== null) {
        updateData.vendorPrice = Number(body.vendorPrice);
      }
      if (body.totalPrice !== undefined && body.totalPrice !== null) {
        updateData.basePrice = Number(body.totalPrice);
      }
      updatedDbListing = await prisma.listing.update({
        where: { id },
        data: updateData,
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
      listing: {
        ...(updated || {}),
        id,
        title,
        basePrice: body.totalPrice !== undefined ? Number(body.totalPrice) : Number(updatedDbListing?.basePrice),
        vendorPrice: body.vendorPrice !== undefined ? Number(body.vendorPrice) : (updatedDbListing?.vendorPrice || updatedDbListing?.basePrice),
        moderationStatus: action === "APPROVE" ? "APPROVED" : "REJECTED",
        commissionRate: body.commissionRate !== undefined ? Number(body.commissionRate) : (updatedDbListing?.commissionRate || 12.0),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
