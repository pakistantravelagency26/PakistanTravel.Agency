import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();

    const users = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { username: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        bookings: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const customers = users.map((u) => {
      const confirmedBookings = u.bookings.filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED");
      const totalSpent = confirmedBookings.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        username: u.username || "—",
        phone: u.phone || "—",
        bookingsCount: u.bookings.length,
        totalSpent,
        createdAt: u.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      customers,
    });
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
