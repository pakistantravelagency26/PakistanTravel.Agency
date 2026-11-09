import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePasswordStrength } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized || !session?.user) {
      return NextResponse.json({ success: false, error: auth.error || "Unauthorized" }, { status: auth.status });
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
    const { name, username, email, phone, permissions, staffRole, password, action } = body;

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

    if (username !== undefined) {
      if (username && username.trim().length > 0) {
        const cleanUser = username.trim().toLowerCase();
        if (!/^[a-z0-9_.-]{3,30}$/.test(cleanUser)) {
          return NextResponse.json(
            { success: false, error: "Username must be 3-30 characters long and can contain letters, numbers, underscores, and dots." },
            { status: 400 }
          );
        }
        const existingUsername = await prisma.user.findFirst({
          where: { username: cleanUser, NOT: { id } },
        });
        if (existingUsername) {
          return NextResponse.json(
            { success: false, error: "This username is already taken by another account." },
            { status: 400 }
          );
        }
        updateData.username = cleanUser;
      } else {
        updateData.username = null;
      }
    }

    if (email && email.trim().length > 0) {
      const cleanEmail = email.trim().toLowerCase();
      const existingEmail = await prisma.user.findFirst({
        where: { email: cleanEmail, NOT: { id } },
      });
      if (existingEmail) {
        return NextResponse.json(
          { success: false, error: "This email address is already used by another account." },
          { status: 400 }
        );
      }
      updateData.email = cleanEmail;
    }

    if (phone !== undefined) {
      if (phone && phone.trim().length > 0) {
        const cleanPhone = phone.trim();
        const existingPhone = await prisma.user.findFirst({
          where: { phone: cleanPhone, NOT: { id } },
        });
        if (existingPhone) {
          return NextResponse.json(
            { success: false, error: "This phone number is already registered to another account." },
            { status: 400 }
          );
        }
        updateData.phone = cleanPhone;
      } else {
        updateData.phone = null;
      }
    }

    if (password && password.trim().length > 0) {
      const strength = validatePasswordStrength(password.trim());
      if (!strength.valid) {
        return NextResponse.json(
          { success: false, error: strength.error || "Password does not meet enterprise security requirements (min 12 chars, upper/lower/numbers/symbols)." },
          { status: 400 }
        );
      }
      updateData.passwordHash = await hashPassword(password.trim());
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
        username: updated.username,
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
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized || !session?.user) {
      return NextResponse.json({ success: false, error: auth.error || "Unauthorized" }, { status: auth.status });
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
