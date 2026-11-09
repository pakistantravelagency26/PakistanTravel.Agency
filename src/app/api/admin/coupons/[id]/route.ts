import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

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
    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Coupon deleted successfully." });
  } catch (error: any) {
    console.error("Delete coupon error:", error);
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

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
      },
    });

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error: any) {
    console.error("Update coupon error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
