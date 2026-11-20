import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { destinationsData } from "@/data/destinationData";
import { travelCostsKey, travelCostsSchema } from "@/config/travelCosts";

export const dynamic = "force-dynamic";

export async function DELETE(
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

    // Check if any listing is attached to this destination
    const listingCount = await prisma.listing.count({
      where: { destinationId: id },
    });

    if (listingCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete destination with ${listingCount} active listings. Please reassign or delete the listings first.`,
        },
        { status: 400 }
      );
    }

    await prisma.destination.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Destination deleted successfully." });
  } catch (error: any) {
    console.error("Delete destination error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

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

    if (body.travelCosts !== undefined) {
      const parsed = travelCostsSchema.safeParse(body.travelCosts);
      if (!parsed.success) {
        return NextResponse.json({ success: false, error: "Please complete all travel cost fields within the allowed lengths." }, { status: 400 });
      }
      const destination = await prisma.destination.findUnique({ where: { id } });
      if (!destination || !destinationsData[destination.slug]) {
        return NextResponse.json({ success: false, error: "Destination guide not found." }, { status: 404 });
      }
      const key = travelCostsKey(destination.slug);
      await prisma.siteSetting.upsert({
        where: { key },
        create: { key, value: parsed.data },
        update: { value: parsed.data },
      });
      revalidatePath(`/destinations/${destination.slug}`);
      return NextResponse.json({ success: true, travelCosts: parsed.data });
    }

    const updated = await prisma.destination.update({
      where: { id },
      data: {
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
      },
    });

    return NextResponse.json({ success: true, destination: updated });
  } catch (error: any) {
    console.error("Update destination error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
