import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { moderateListing } from "@/services/listing.service";
import { formatDbListing } from "@/services/serverListing.service";

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
        include: {
          vendor: true,
          destination: true,
          units: true,
          reviews: {
            include: { user: true },
          },
        },
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

    const title = updatedDbListing?.title || updated?.title || "Tour Package";
    const finalListing = updatedDbListing
      ? formatDbListing(updatedDbListing)
      : {
          ...(updated || {}),
          id,
          title,
          basePrice: body.totalPrice !== undefined ? Number(body.totalPrice) : 35000,
          vendorPrice: body.vendorPrice !== undefined ? Number(body.vendorPrice) : 30000,
          moderationStatus: action === "APPROVE" ? "APPROVED" : "REJECTED",
          commissionRate: body.commissionRate !== undefined ? Number(body.commissionRate) : 12.0,
          photos: [],
          amenities: [],
        };

    return NextResponse.json({
      success: true,
      message:
        action === "APPROVE"
          ? `Listing "${title}" has been approved and is now live on PakistanTravel.Agency marketplace!`
          : `Listing "${title}" was marked as revision required/rejected.`,
      listing: finalListing,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
