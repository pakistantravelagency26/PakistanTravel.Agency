import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

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
    const { name, email, phone, username, password } = body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.role !== "CUSTOMER") {
      return NextResponse.json(
        { success: false, error: "Customer account not found." },
        { status: 404 }
      );
    }

    const normEmail = email ? String(email).toLowerCase().trim() : undefined;
    const normUsername = username ? String(username).toLowerCase().trim() : undefined;
    const normPhone = phone !== undefined ? String(phone).trim() : undefined;

    // Check unique email
    if (normEmail && normEmail !== user.email) {
      const emailCollision = await prisma.user.findFirst({
        where: { email: normEmail, id: { not: id } },
      });
      if (emailCollision) {
        return NextResponse.json(
          { success: false, error: `Email "${normEmail}" is already in use by another account.` },
          { status: 400 }
        );
      }
    }

    // Check unique username
    if (normUsername && normUsername !== user.username) {
      const usernameCollision = await prisma.user.findFirst({
        where: { username: normUsername, id: { not: id } },
      });
      if (usernameCollision) {
        return NextResponse.json(
          { success: false, error: `Username "${normUsername}" is already taken.` },
          { status: 400 }
        );
      }
    }

    // Check unique phone if provided
    if (normPhone && normPhone !== user.phone) {
      const phoneCollision = await prisma.user.findFirst({
        where: { phone: normPhone, id: { not: id } },
      });
      if (phoneCollision) {
        return NextResponse.json(
          { success: false, error: `Mobile number "${normPhone}" is already registered.` },
          { status: 400 }
        );
      }
    }

    let passwordHash: string | undefined = undefined;
    if (password && String(password).trim().length > 0) {
      if (String(password).trim().length < 8) {
        return NextResponse.json(
          { success: false, error: "Password must be at least 8 characters long." },
          { status: 400 }
        );
      }
      passwordHash = await hashPassword(String(password).trim());
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(name ? { name: String(name).trim() } : {}),
        ...(normEmail ? { email: normEmail } : {}),
        ...(normUsername !== undefined ? { username: normUsername || null } : {}),
        ...(normPhone !== undefined ? { phone: normPhone || null } : {}),
        ...(passwordHash
          ? {
              passwordHash,
              tokenVersion: { increment: 1 },
              sessionVersion: { increment: 1 },
            }
          : {}),
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: "CUSTOMER_PROFILE_UPDATED_BY_SUPER_ADMIN",
        actorEmail: session!.user!.email!,
        actorId: (session!.user as any)?.id,
        resourceType: "USER",
        resourceId: id,
        details: `Super Admin ${session!.user!.email!} updated traveler profile for "${updated.name}" (${updated.email}). Changes: ${
          passwordHash ? "Password reset, " : ""
        }Details updated.`,
      },
    });

    return NextResponse.json({
      success: true,
      customer: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        username: updated.username || "—",
        phone: updated.phone || "—",
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error updating customer:", error);
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
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.role !== "CUSTOMER") {
      return NextResponse.json(
        { success: false, error: "Customer account not found." },
        { status: 404 }
      );
    }

    // Delete related records
    await prisma.review.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.wishlist.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.notification.deleteMany({ where: { userId: id } }).catch(() => {});
    await prisma.user.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "CUSTOMER_ACCOUNT_DELETED_BY_SUPER_ADMIN",
        actorEmail: session!.user!.email!,
        actorId: (session!.user as any)?.id,
        resourceType: "USER",
        resourceId: id,
        details: `Super Admin deleted customer account "${user.name}" (${user.email}).`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Traveler account "${user.name}" (${user.email}) has been permanently deleted.`,
    });
  } catch (error: any) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
