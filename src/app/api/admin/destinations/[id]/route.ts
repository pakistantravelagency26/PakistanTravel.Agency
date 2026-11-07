import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
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
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

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
