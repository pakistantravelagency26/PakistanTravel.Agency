import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
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

    // Publish the listing and approved prices together, or leave it unchanged.
    const updatedDbListing = await prisma.$transaction(async (tx) => {
      const dbStatus = action === "APPROVE" ? "PUBLISHED" : "ARCHIVED";
      const updateData: any = { status: dbStatus };
      if (body.commissionRate !== undefined && body.commissionRate !== null) {
        updateData.commissionRate = Number(body.commissionRate);
      }
      if (body.vendorPrice !== undefined && body.vendorPrice !== null) {
        updateData.vendorPrice = Number(body.vendorPrice);
      }
      if (body.totalPrice !== undefined && body.totalPrice !== null) {
        const approvedBasePrice = Number(body.totalPrice);
        updateData.basePrice = approvedBasePrice;
        const existingUnits = await tx.listingUnit.findMany({
          where: { listingId: id },
        });

        const primaryUnit = existingUnits.find((u) => u.id.includes("perperson")) || existingUnits[0];
        const vendorBasePrice = Number(body.vendorPrice || primaryUnit?.basePrice || updateData.vendorPrice || approvedBasePrice);
        const markupMultiplier = vendorBasePrice > 0 ? (approvedBasePrice / vendorBasePrice) : 1;

        for (const unit of existingUnits) {
          if (unit.id.includes("perperson") || existingUnits.length === 1) {
            await tx.listingUnit.update({
              where: { id: unit.id },
              data: { basePrice: approvedBasePrice },
            });
          } else {
            const currentPrice = Number(unit.basePrice);
            const newPrice = Math.round(currentPrice * markupMultiplier);
            await tx.listingUnit.update({
              where: { id: unit.id },
              data: { basePrice: newPrice },
            });
          }
        }
      }
      return tx.listing.update({
        where: { id },
        data: updateData,
        include: {
          vendor: true,
          destination: true,
          units: true,
          departures: { orderBy: { startDate: "asc" } },
          reviews: {
            include: { user: true },
          },
        },
      });
    });

    const title = updatedDbListing.title;
    const finalListing = formatDbListing(updatedDbListing);

    // On-demand ISR revalidation across marketplace catalog
    try {
      revalidatePath("/");
      revalidatePath("/tours");
      revalidatePath("/destinations");
      revalidatePath("/destinations/[slug]", "page");
      revalidatePath("/tours/[intent]", "page");
      revalidatePath("/sitemap.xml");
      if (finalListing?.slug) {
        revalidatePath(`/listing/${finalListing.slug}`);
      }
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({
      success: true,
      message:
        action === "APPROVE"
          ? `Listing "${title}" has been approved and is now live on PakistanTravel.Agency marketplace!`
          : `Listing "${title}" was marked as revision required/rejected.`,
      listing: finalListing,
    });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
    }
    console.error("Listing moderation failed:", error);
    return NextResponse.json(
      { success: false, error: "The moderation change could not be saved. Please retry." },
      { status: 500 }
    );
  }
}
