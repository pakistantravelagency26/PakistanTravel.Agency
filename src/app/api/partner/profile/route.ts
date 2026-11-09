import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { encryptSensitiveField, decryptSensitiveField, maskCnic } from "@/lib/fieldEncryption";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["VENDOR", "ADMIN"]);
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
    const auth = requireRole(session, ["VENDOR", "ADMIN"]);
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
    const { businessName, phone, whatsapp, city, address, cnicOrTaxNumber } = body;

    if (whatsapp) {
      const cleanWa = String(whatsapp).replace(/[\s\-()]/g, "");
      const isPakistaniWa = /^(\+92|0|92)?3\d{9}$/.test(cleanWa);
      if (!isPakistaniWa) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid Pakistani WhatsApp number (e.g. 03001234567 or +92 300 1234567)." },
          { status: 400 }
        );
      }
    }

    const encryptedCnic = cnicOrTaxNumber !== undefined 
      ? (String(cnicOrTaxNumber).trim() ? encryptSensitiveField(String(cnicOrTaxNumber).trim()) : null)
      : undefined;

    const updated = await prisma.vendor.update({
      where: { id: user.vendorProfile.id },
      data: {
        ...(businessName ? { businessName: String(businessName).trim() } : {}),
        ...(phone ? { phone: String(phone).trim() } : {}),
        ...(whatsapp !== undefined ? { whatsapp: String(whatsapp).trim() } : {}),
        ...(city ? { city: String(city).trim() } : {}),
        ...(address !== undefined ? { address: String(address).trim() } : {}),
        ...(encryptedCnic !== undefined ? { cnicOrTaxNumber: encryptedCnic } : {}),
      },
    });

    const maskedUpdatedCnic = updated.cnicOrTaxNumber ? maskCnic(decryptSensitiveField(updated.cnicOrTaxNumber)) : "";

    return NextResponse.json({
      success: true,
      profile: {
        id: updated.id,
        businessName: updated.businessName,
        phone: updated.phone,
        whatsapp: updated.whatsapp,
        city: updated.city,
        address: updated.address,
        cnicOrTaxNumber: maskedUpdatedCnic,
        status: updated.status,
      },
    });
  } catch (error: unknown) {
    console.error("[PartnerProfileAPI] PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Error" },
      { status: 500 }
    );
  }
}
