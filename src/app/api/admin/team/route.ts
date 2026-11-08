import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const members = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        staffRole: true,
        permissions: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      team: members.map((m) => {
        const isPrimary = m.email === "emraanirshad88@gmail.com";
        const isSuspended = m.staffRole === "SUSPENDED";
        const isSuperAdmin = isPrimary || (m.staffRole === "SUPER_ADMIN" && !isSuspended);
        const permissionsStr = isPrimary || (m.permissions && m.permissions.includes("ALL")) 
          ? "ALL" 
          : (m.permissions || m.staffRole || "BOOKINGS");
        return {
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone || "N/A",
          staffRole: isSuspended ? "SUSPENDED" : (isSuperAdmin ? "SUPER_ADMIN" : (m.staffRole || "CUSTOM_STAFF")),
          permissions: permissionsStr,
          createdAt: m.createdAt.toISOString(),
          isProtected: isPrimary,
          isSuspended,
        };
      }),
    });
  } catch (error: any) {
    console.error("Team fetch error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
        { success: false, error: "Forbidden: Only Super Administrators can invite or create staff accounts." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, phone, permissions, staffRole } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long and contain both letters and numbers." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password.trim(), 10);

    // Format permissions: either array or string
    let formattedPermissions = "BOOKINGS";
    if (Array.isArray(permissions)) {
      formattedPermissions = permissions.join(",");
    } else if (typeof permissions === "string" && permissions.trim().length > 0) {
      formattedPermissions = permissions.trim();
    }

    const assignedStaffRole = staffRole || (formattedPermissions.includes("ALL") ? "SUPER_ADMIN" : "CUSTOM_STAFF");

    const newStaff = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : null,
        passwordHash,
        role: "ADMIN",
        staffRole: assignedStaffRole,
        permissions: formattedPermissions,
      },
    });

    return NextResponse.json({
      success: true,
      member: {
        id: newStaff.id,
        name: newStaff.name,
        email: newStaff.email,
        staffRole: newStaff.staffRole,
        permissions: newStaff.permissions,
        createdAt: newStaff.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Create staff member error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
