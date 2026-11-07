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

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Staff member not found." }, { status: 404 });
    }

    if (user.email === "emraanirshad88@gmail.com") {
      return NextResponse.json(
        { success: false, error: "The primary Super Admin account cannot be deleted." },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Staff account "${user.name}" (${user.email}) has been removed.`,
    });
  } catch (error: any) {
    console.error("Delete staff member error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
