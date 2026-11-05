import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { getAllVendors, createVendorAccount, VENDORS_STORE } from "@/services/vendor.service";
import { getAllListingsForAdmin } from "@/services/listing.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Try querying Neon PostgreSQL Database first for 100% persistent data
    const dbVendors = await prisma.vendor.findMany({
      include: {
        listings: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbVendors && dbVendors.length > 0) {
      const formatted = dbVendors.map((v) => {
        const details = (v.bankDetails as any) || {};
        return {
          id: v.id,
          companyName: v.businessName,
          city: v.city,
          tourismLicense: v.cnicOrTaxNumber || "DTS-VERIFIED",
          phone1: details.phone1 || v.phone,
          phone2: details.phone2 || "",
          phone3: details.phone3 || "",
          email: details.email || `${v.id}@pakistantravel.agency`,
          loginId: details.loginId || v.id.replace("v-", ""),
          passwordPlain: details.passwordPlain || "vendor123",
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
    }

    // 2. Fallback to in-memory store
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
  } catch (error: any) {
    // Fallback if DB query fails
    const vendors = getAllVendors();
    const allListings = getAllListingsForAdmin();
    return NextResponse.json({
      success: true,
      vendors: vendors.map((v) => ({
        ...v,
        listingsCount: allListings.filter((l) => l.vendor?.id === v.id).length,
      })),
    });
  }
}

export async function POST(req: Request) {
  try {
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
          cnicOrTaxNumber: body.tourismLicense || "DTS-PENDING",
          phone: body.phone1 || "03000000000",
          status: "VERIFIED",
          commissionRate: 12.0,
          bankDetails: {
            phone1: body.phone1,
            phone2: body.phone2 || "",
            phone3: body.phone3 || "",
            email: body.email,
            loginId: body.loginId,
            passwordPlain: body.passwordPlain,
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
      tourismLicense: body.tourismLicense || "DTS-PENDING",
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
