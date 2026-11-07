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
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      team: members.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone || "N/A",
        staffRole: m.staffRole || (m.email === "emraanirshad88@gmail.com" ? "SUPER_ADMIN" : "STAFF"),
        createdAt: m.createdAt.toISOString(),
        isProtected: m.email === "emraanirshad88@gmail.com",
      })),
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

    const body = await req.json();
    const { name, email, password, phone, staffRole } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required." },
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
    const validRole = staffRole || "BOOKINGS_MANAGER";

    const newStaff = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : null,
        passwordHash,
        role: "ADMIN",
        staffRole: validRole,
      },
    });

    return NextResponse.json({
      success: true,
      member: {
        id: newStaff.id,
        name: newStaff.name,
        email: newStaff.email,
        staffRole: newStaff.staffRole,
        createdAt: newStaff.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Create staff member error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
