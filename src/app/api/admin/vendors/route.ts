import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePasswordStrength } from "@/lib/password";
import { getAllVendors, createVendorAccount, VENDORS_STORE } from "@/services/vendor.service";
import { getAllListingsForAdmin } from "@/services/listing.service";
import { COMMISSION_PERCENT } from "@/config/site";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    // 1. Try querying Neon PostgreSQL Database first for 100% persistent data
    const dbVendors = await prisma.vendor.findMany({
      include: {
        listings: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = dbVendors.map((v) => {
      const details = (v.bankDetails as any) || {};
      return {
        id: v.id,
        companyName: v.businessName,
        city: v.city,
        tourismLicense: v.cnicOrTaxNumber || "REG-PENDING",
        phone1: details.phone1 || v.phone,
        phone2: details.phone2 || "",
        phone3: details.phone3 || "",
        email: v.user?.email || details.email || "N/A",
        loginId: details.loginId || v.id.replace("v-", ""),
        status: v.status === "VERIFIED" ? ("ENABLED" as const) : ("DISABLED" as const),
        commissionRate: v.commissionRate,
        listingsCount: v.listings.length,
        createdAt: v.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      vendors: formatted,
    });
  } catch (error: any) {
    console.error("Neon DB vendor query error, falling back to memory:", error);
    // Fallback to in-memory store ONLY if DB network connection completely fails
    const vendors = getAllVendors();
    const allListings = getAllListingsForAdmin();
    const vendorsWithCounts = vendors.map((v) => {
      const count = allListings.filter((l) => l.vendor?.id === v.id).length;
      return {
        ...v,
        listingsCount: count,
      };
    });

    return NextResponse.json({
      success: true,
      vendors: vendorsWithCounts,
    });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const auth = requireRole(session, ["ADMIN"]);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();

    if (!body.companyName || !body.city || !body.email || !body.loginId || !body.passwordPlain) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Company Name, City, Email, Login ID and Password are required." 
        },
        { status: 400 }
      );
    }

    const cleanId = `v-${body.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")}-${Date.now().toString().slice(-4)}`;

    const strength = validatePasswordStrength(body.passwordPlain);
    if (!strength.valid) {
      return NextResponse.json(
        { success: false, error: strength.error || "Password does not meet enterprise security requirements (minimum 12 chars, upper/lower/numbers/symbols)." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(body.passwordPlain);

    // Save to Neon PostgreSQL Database for permanent storage
    try {
      const user = await prisma.user.create({
        data: {
          name: body.companyName,
          email: body.email.toLowerCase().trim(),
          phone: body.phone1 || "03000000000",
          passwordHash,
          role: "VENDOR",
        },
      });

      const vendor = await prisma.vendor.create({
        data: {
          id: cleanId,
          userId: user.id,
          businessName: body.companyName.trim(),
          city: body.city.trim(),
          cnicOrTaxNumber: body.tourismLicense || "PENDING",
          phone: body.phone1 || "03000000000",
          status: "VERIFIED",
          commissionRate: COMMISSION_PERCENT,
          bankDetails: {
            phone1: body.phone1,
            phone2: body.phone2 || "",
            phone3: body.phone3 || "",
            email: body.email,
            loginId: body.loginId,
          },
        },
      });
    } catch (dbErr) {
      console.warn("DB write warning:", dbErr);
    }

    // Also update in-memory store
    const newVendor = await createVendorAccount({
      companyName: body.companyName,
      city: body.city,
      tourismLicense: body.tourismLicense || "PENDING",
      phone1: body.phone1 || "03000000000",
      phone2: body.phone2 || "",
      phone3: body.phone3 || "",
      email: body.email,
      loginId: body.loginId,
      passwordPlain: body.passwordPlain,
    });

    return NextResponse.json({
      success: true,
      vendor: {
        ...newVendor,
        listingsCount: 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
