import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { encryptSensitiveField, decryptSensitiveField, maskCnic } from "@/lib/fieldEncryption";
import { verifyPassword, hashPassword } from "@/lib/password";
import { USERS_STORE } from "@/services/user.service";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["VENDOR"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const user = await prisma.user.findUnique({
      where: { email: session!.user!.email! },
      include: { vendorProfile: true },
    });

    if (!user || !user.vendorProfile) {
      return NextResponse.json(
        { success: false, error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    const rawCnic = user.vendorProfile.cnicOrTaxNumber ? decryptSensitiveField(user.vendorProfile.cnicOrTaxNumber) : "";

    return NextResponse.json({
      success: true,
      profile: {
        id: user.vendorProfile.id,
        businessName: user.vendorProfile.businessName,
        phone: user.vendorProfile.phone,
        whatsapp: user.vendorProfile.whatsapp || user.vendorProfile.phone,
        city: user.vendorProfile.city,
        address: user.vendorProfile.address || "",
        cnicOrTaxNumber: rawCnic ? maskCnic(rawCnic) : "",
        status: user.vendorProfile.status,
        email: user.email,
        username: user.username || "",
        name: user.name,
      },
    });
  } catch (error: unknown) {
    console.error("[PartnerProfileAPI] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["VENDOR"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const user = await prisma.user.findUnique({
      where: { email: session!.user!.email! },
      include: { vendorProfile: true },
    });

    if (!user || !user.vendorProfile) {
      return NextResponse.json(
        { success: false, error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    // 1. Refuse profile field modifications: Profile details are managed strictly by Super Admin
    if (
      body.businessName !== undefined ||
      body.city !== undefined ||
      body.phone !== undefined ||
      body.whatsapp !== undefined ||
      body.address !== undefined ||
      body.cnicOrTaxNumber !== undefined ||
      body.email !== undefined ||
      body.username !== undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Company profile and contact details are verified and managed by PakistanTravel.Agency Super Administration. Vendors cannot modify business details directly. Please contact platform administration to request changes.",
        },
        { status: 403 }
      );
    }

    // 2. Handle Password Change (Vendors can only change their own password)
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Please provide both your current password and new password." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "New password and confirmation password do not match." },
        { status: 400 }
      );
    }

    // Verify current password
    if (!user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Account password not configured. Please contact administrator." },
        { status: 400 }
      );
    }

    const isCurrentValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: "Your current password was entered incorrectly." },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, error: "New password cannot be the same as your current password." },
        { status: 400 }
      );
    }

    // Hash new password using bcrypt cost 12
    const newHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        tokenVersion: { increment: 1 },
        sessionVersion: { increment: 1 },
      },
    });

    // Also update in-memory fallback user store if present
    const inMemUser = USERS_STORE.find(
      (u) => u.email.toLowerCase() === user.email.toLowerCase() || u.vendorId === user.vendorProfile?.id
    );
    if (inMemUser) {
      inMemUser.passwordHash = newHash;
    }

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: "VENDOR_PASSWORD_CHANGED",
        actorEmail: user.email,
        actorId: user.id,
        resourceType: "VENDOR",
        resourceId: user.vendorProfile.id,
        details: `Vendor partner "${user.vendorProfile.businessName}" (${user.email}) successfully changed their account password.`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been changed successfully. You can now use your new password for future sign-ins.",
    });
  } catch (error: unknown) {
    console.error("[PartnerProfileAPI] PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Error" },
      { status: 500 }
    );
  }
}
