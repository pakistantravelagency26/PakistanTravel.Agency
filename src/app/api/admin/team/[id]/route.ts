import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

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
    const { name, phone, permissions, staffRole, password } = body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Staff member not found." }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (password && password.trim().length > 0) {
      updateData.passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    // Format permissions
    if (permissions !== undefined) {
      if (user.email === "emraanirshad88@gmail.com") {
        updateData.permissions = "ALL";
        updateData.staffRole = "SUPER_ADMIN";
      } else {
        let formattedPermissions = "BOOKINGS";
        if (Array.isArray(permissions)) {
          formattedPermissions = permissions.join(",");
        } else if (typeof permissions === "string" && permissions.trim().length > 0) {
          formattedPermissions = permissions.trim();
        }
        updateData.permissions = formattedPermissions;
        updateData.staffRole = staffRole || (formattedPermissions.includes("ALL") ? "SUPER_ADMIN" : "CUSTOM_STAFF");
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      member: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        staffRole: updated.staffRole,
        permissions: updated.permissions,
      },
    });
  } catch (error: any) {
    console.error("Update staff member error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

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
