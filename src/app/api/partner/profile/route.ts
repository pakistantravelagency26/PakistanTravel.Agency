import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { vendorProfile: true },
    });

    if (!user || !user.vendorProfile) {
      return NextResponse.json(
        { success: false, error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.vendorProfile.id,
        businessName: user.vendorProfile.businessName,
        phone: user.vendorProfile.phone,
        whatsapp: user.vendorProfile.whatsapp || user.vendorProfile.phone,
        city: user.vendorProfile.city,
        address: user.vendorProfile.address || "",
        cnicOrTaxNumber: user.vendorProfile.cnicOrTaxNumber || "",
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
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
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

    const updated = await prisma.vendor.update({
      where: { id: user.vendorProfile.id },
      data: {
        ...(businessName ? { businessName: String(businessName).trim() } : {}),
        ...(phone ? { phone: String(phone).trim() } : {}),
        ...(whatsapp !== undefined ? { whatsapp: String(whatsapp).trim() } : {}),
        ...(city ? { city: String(city).trim() } : {}),
        ...(address !== undefined ? { address: String(address).trim() } : {}),
        ...(cnicOrTaxNumber !== undefined ? { cnicOrTaxNumber: String(cnicOrTaxNumber).trim() } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      profile: updated,
    });
  } catch (error: unknown) {
    console.error("[PartnerProfileAPI] PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Error" },
      { status: 500 }
    );
  }
}
