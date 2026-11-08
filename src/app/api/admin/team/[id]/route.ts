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

    const userPerms = (session.user as any)?.permissions || "";
    const isSuperAdmin =
      session.user.staffRole === "SUPER_ADMIN" ||
      userPerms.includes("ALL") ||
      userPerms.includes("TEAM");

    if (!isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only Super Administrators can modify staff accounts." },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const { name, phone, permissions, staffRole, password, action } = body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Staff member not found." }, { status: 404 });
    }

    const adminEmail = session.user.email || "admin@pakistantravel.agency";

    // Handle BLOCK / SUSPEND action
    if (action === "BLOCK" || action === "SUSPEND") {
      if (user.email === "emraanirshad88@gmail.com") {
        return NextResponse.json(
          { success: false, error: "Cannot suspend or block the primary Super Administrator account." },
          { status: 403 }
        );
      }
      if (session.user.id === user.id) {
        return NextResponse.json(
          { success: false, error: "Administrators cannot suspend their own account." },
          { status: 400 }
        );
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { id },
          data: {
            staffRole: "SUSPENDED",
            sessionVersion: { increment: 1 },
            tokenVersion: { increment: 1 },
          },
        }),
        prisma.auditLog.create({
          data: {
            action: "STAFF_SUSPENDED",
            actorId: session.user.id,
            actorEmail: adminEmail,
            resourceType: "USER",
            resourceId: id,
            details: `Super Admin ${adminEmail} suspended staff access for ${user.name} (${user.email}). All active sessions immediately revoked.`,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: `Staff member "${user.name}" (${user.email}) has been blocked and suspended.`,
      });
    }

    // Handle UNBLOCK / ACTIVATE action
    if (action === "UNBLOCK" || action === "ACTIVATE") {
      const restoredRole = (user.permissions || "").includes("ALL") ? "SUPER_ADMIN" : "CUSTOM_STAFF";

      await prisma.$transaction([
        prisma.user.update({
          where: { id },
          data: {
            staffRole: restoredRole,
            sessionVersion: { increment: 1 },
            tokenVersion: { increment: 1 },
          },
        }),
        prisma.auditLog.create({
          data: {
            action: "STAFF_UNBLOCKED",
            actorId: session.user.id,
            actorEmail: adminEmail,
            resourceType: "USER",
            resourceId: id,
            details: `Super Admin ${adminEmail} unblocked staff access for ${user.name} (${user.email}).`,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: `Staff member "${user.name}" (${user.email}) has been unblocked and access restored.`,
      });
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (password && password.trim().length > 0) {
      if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        return NextResponse.json(
          { success: false, error: "Password must be at least 8 characters long and contain both letters and numbers." },
          { status: 400 }
        );
      }
      updateData.passwordHash = await bcrypt.hash(password.trim(), 10);
      updateData.sessionVersion = { increment: 1 };
      updateData.tokenVersion = { increment: 1 };
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
        if (user.staffRole !== "SUSPENDED") {
          updateData.staffRole = staffRole || (formattedPermissions.includes("ALL") ? "SUPER_ADMIN" : "CUSTOM_STAFF");
        }
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

    const userPerms = (session.user as any)?.permissions || "";
    const isSuperAdmin =
      session.user.staffRole === "SUPER_ADMIN" ||
      userPerms.includes("ALL") ||
      userPerms.includes("TEAM");

    if (!isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only Super Administrators can delete staff accounts." },
        { status: 403 }
      );
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

    if (session.user.id === user.id) {
      return NextResponse.json(
        { success: false, error: "Administrators cannot delete their own active account." },
        { status: 400 }
      );
    }

    const adminEmail = session.user.email || "admin@pakistantravel.agency";

    await prisma.$transaction([
      prisma.user.delete({
        where: { id },
      }),
      prisma.auditLog.create({
        data: {
          action: "STAFF_DELETED",
          actorId: session.user.id,
          actorEmail: adminEmail,
          resourceType: "USER",
          resourceId: id,
          details: `Super Admin ${adminEmail} deleted staff account "${user.name}" (${user.email}).`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Staff account "${user.name}" (${user.email}) has been permanently deleted.`,
    });
  } catch (error: any) {
    console.error("Delete staff member error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
