import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword, validatePasswordStrength } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized || !session?.user?.id) {
      return NextResponse.json({ success: false, error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        staffRole: true,
        permissions: true,
        twoFactorEnabled: true,
        twoFactorEnrolledAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User profile not found." }, { status: 404 });
    }

    const isPrimary = user.email === "emraanirshad88@gmail.com";
    const isSuperAdmin = isPrimary || user.staffRole === "SUPER_ADMIN";
    const effectivePermissions = isSuperAdmin ? "ALL" : (user.permissions || "NONE");

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        name: user.name,
        username: user.username || "",
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        staffRole: isSuperAdmin ? "SUPER_ADMIN" : (user.staffRole || "STAFF"),
        permissions: effectivePermissions,
        twoFactorEnabled: Boolean(user.twoFactorEnabled),
        twoFactorEnrolledAt: user.twoFactorEnrolledAt ? user.twoFactorEnrolledAt.toISOString() : null,
        createdAt: user.createdAt.toISOString(),
        isPrimary,
      },
    });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized || !session?.user?.id) {
      return NextResponse.json({ success: false, error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { name, username, email, phone, currentPassword, newPassword } = body;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json({ success: false, error: "User profile not found." }, { status: 404 });
    }

    const updateData: any = {};

    // 1. Update Name
    if (name && typeof name === "string") {
      const cleanName = name.trim();
      if (cleanName.length < 2) {
        return NextResponse.json({ success: false, error: "Name must be at least 2 characters." }, { status: 400 });
      }
      updateData.name = cleanName;
    }

    // 2. Update Username
    if (username !== undefined) {
      if (username && typeof username === "string" && username.trim().length > 0) {
        const cleanUsername = username.trim().toLowerCase();
        if (!/^[a-z0-9_.-]{3,30}$/.test(cleanUsername)) {
          return NextResponse.json({
            success: false,
            error: "Username must be 3-30 characters long and can contain letters, numbers, underscores, and dots.",
          }, { status: 400 });
        }
        const existingUsername = await prisma.user.findFirst({
          where: { username: cleanUsername, NOT: { id: userId } },
        });
        if (existingUsername) {
          return NextResponse.json({
            success: false,
            error: "This username is already taken by another account.",
          }, { status: 400 });
        }
        updateData.username = cleanUsername;
      } else {
        updateData.username = null;
      }
    }

    // 3. Update Email
    if (email && typeof email === "string" && email.trim().length > 0) {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail.includes("@")) {
        return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
      }
      const existingEmail = await prisma.user.findFirst({
        where: { email: cleanEmail, NOT: { id: userId } },
      });
      if (existingEmail) {
        return NextResponse.json({
          success: false,
          error: "This email address is already registered to another account.",
        }, { status: 400 });
      }
      updateData.email = cleanEmail;
    }

    // 4. Update Phone
    if (phone !== undefined) {
      if (phone && typeof phone === "string" && phone.trim().length > 0) {
        const cleanPhone = phone.trim();
        const existingPhone = await prisma.user.findFirst({
          where: { phone: cleanPhone, NOT: { id: userId } },
        });
        if (existingPhone) {
          return NextResponse.json({
            success: false,
            error: "This mobile phone number is already registered to another account.",
          }, { status: 400 });
        }
        updateData.phone = cleanPhone;
      } else {
        updateData.phone = null;
      }
    }

    // 5. Update Password
    if (newPassword && typeof newPassword === "string" && newPassword.trim().length > 0) {
      // If current password exists in DB, require correct currentPassword
      if (currentUser.passwordHash) {
        if (!currentPassword) {
          return NextResponse.json({
            success: false,
            error: "Current password is required to set a new password.",
          }, { status: 400 });
        }
        const isCurrentValid = await verifyPassword(currentPassword.trim(), currentUser.passwordHash);
        if (!isCurrentValid) {
          return NextResponse.json({
            success: false,
            error: "The current password you entered is incorrect.",
          }, { status: 400 });
        }
      }

      const strength = validatePasswordStrength(newPassword.trim());
      if (!strength.valid) {
        return NextResponse.json({
          success: false,
          error: strength.error || "New password does not meet security requirements (min 12 characters, uppercase, lowercase, numbers, symbols).",
        }, { status: 400 });
      }

      updateData.passwordHash = await hashPassword(newPassword.trim());
      // Increment tokenVersion and sessionVersion to secure account across all sessions
      updateData.tokenVersion = (currentUser.tokenVersion || 1) + 1;
      updateData.sessionVersion = (currentUser.sessionVersion || 1) + 1;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: "No changes provided to update." }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        staffRole: true,
        permissions: true,
        twoFactorEnabled: true,
        updatedAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "STAFF_PROFILE_UPDATED",
        actorId: userId,
        actorEmail: updated.email,
        resourceType: "USER",
        resourceId: userId,
        details: `Profile details updated for ${updated.name} (${updated.email}). Fields changed: ${Object.keys(updateData).join(", ")}.`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your profile details have been successfully updated.",
      profile: {
        id: updated.id,
        name: updated.name,
        username: updated.username || "",
        email: updated.email,
        phone: updated.phone || "",
        role: updated.role,
        staffRole: updated.staffRole,
        permissions: updated.permissions,
        twoFactorEnabled: Boolean(updated.twoFactorEnabled),
      },
    });
  } catch (error: any) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
