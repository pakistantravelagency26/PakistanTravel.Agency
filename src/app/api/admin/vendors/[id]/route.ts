import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { getVendorById, deleteVendorAccount, VENDORS_STORE } from "@/services/vendor.service";
import { USERS_STORE } from "@/services/user.service";
import { deleteListingsByVendorId } from "@/services/listing.service";

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

    const {
      companyName,
      city,
      email,
      loginId,
      phone1,
      phone2,
      phone3,
      tourismLicense,
      commissionRate,
      status,
      password,
    } = body;

    // 1. Find Vendor in Database
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: { user: true, listings: true },
    });

    if (!vendor) {
      return NextResponse.json({ success: false, error: "Partner account not found." }, { status: 404 });
    }

    // 2. Prepare User Updates
    let passwordHash: string | undefined = undefined;
    if (password && String(password).trim().length > 0) {
      if (String(password).trim().length < 8) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 8 characters long." },
          { status: 400 }
        );
      }
      passwordHash = await hashPassword(String(password).trim());
    }

    const normEmail = email ? String(email).toLowerCase().trim() : undefined;
    const normLoginId = loginId ? String(loginId).toLowerCase().trim() : undefined;

    if (normEmail && normEmail !== vendor.user?.email) {
      const emailExists = await prisma.user.findFirst({
        where: { email: normEmail, id: { not: vendor.userId } },
      });
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: `Email "${normEmail}" is already in use by another account.` },
          { status: 400 }
        );
      }
    }

    if (normLoginId && normLoginId !== vendor.user?.username) {
      const usernameExists = await prisma.user.findFirst({
        where: { username: normLoginId, id: { not: vendor.userId } },
      });
      if (usernameExists) {
        return NextResponse.json(
          { success: false, error: `Login ID / Username "${normLoginId}" is already taken.` },
          { status: 400 }
        );
      }
    }

    // Update User
    if (vendor.userId) {
      await prisma.user.update({
        where: { id: vendor.userId },
        data: {
          ...(companyName ? { name: String(companyName).trim() } : {}),
          ...(normEmail ? { email: normEmail } : {}),
          ...(normLoginId ? { username: normLoginId } : {}),
          ...(phone1 ? { phone: String(phone1).trim() } : {}),
          ...(passwordHash
            ? {
                passwordHash,
                tokenVersion: { increment: 1 },
                sessionVersion: { increment: 1 },
              }
            : {}),
        },
      });
    }

    // Update Vendor
    const existingBankDetails = (vendor.bankDetails as any) || {};
    const updatedBankDetails = {
      ...existingBankDetails,
      phone1: phone1 !== undefined ? String(phone1).trim() : existingBankDetails.phone1,
      phone2: phone2 !== undefined ? String(phone2).trim() : existingBankDetails.phone2,
      phone3: phone3 !== undefined ? String(phone3).trim() : existingBankDetails.phone3,
      email: normEmail || existingBankDetails.email,
      loginId: normLoginId || existingBankDetails.loginId,
    };

    let newStatus: any = vendor.status;
    if (status === "ENABLED") newStatus = "VERIFIED";
    if (status === "DISABLED") newStatus = "SUSPENDED";

    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: {
        ...(companyName ? { businessName: String(companyName).trim() } : {}),
        ...(city ? { city: String(city).trim() } : {}),
        ...(phone1 ? { phone: String(phone1).trim() } : {}),
        ...(phone2 ? { whatsapp: String(phone2).trim() } : {}),
        ...(tourismLicense ? { cnicOrTaxNumber: String(tourismLicense).trim() } : {}),
        ...(commissionRate !== undefined ? { commissionRate: Number(commissionRate) } : {}),
        status: newStatus,
        bankDetails: updatedBankDetails,
      },
      include: {
        user: true,
        listings: true,
      },
    });

    // 3. Sync with in-memory fallback stores
    const inMemVendor = VENDORS_STORE.find((v) => v.id === id);
    if (inMemVendor) {
      if (companyName) inMemVendor.companyName = String(companyName).trim();
      if (city) inMemVendor.city = String(city).trim();
      if (phone1) inMemVendor.phone1 = String(phone1).trim();
      if (phone2) inMemVendor.phone2 = String(phone2).trim();
      if (phone3) inMemVendor.phone3 = String(phone3).trim();
      if (normEmail) inMemVendor.email = normEmail;
      if (normLoginId) inMemVendor.loginId = normLoginId;
      if (tourismLicense) inMemVendor.tourismLicense = String(tourismLicense).trim();
      if (commissionRate !== undefined) inMemVendor.commissionRate = Number(commissionRate);
      if (status) inMemVendor.status = status;
    }

    const inMemUser = USERS_STORE.find(
      (u) => u.vendorId === id || (vendor.user?.email && u.email.toLowerCase() === vendor.user.email.toLowerCase())
    );
    if (inMemUser) {
      if (companyName) inMemUser.name = String(companyName).trim();
      if (normEmail) inMemUser.email = normEmail;
      if (normLoginId) inMemUser.username = normLoginId;
      if (phone1) inMemUser.phone = String(phone1).trim();
      if (passwordHash) inMemUser.passwordHash = passwordHash;
    }

    // 4. Audit Log
    await prisma.auditLog.create({
      data: {
        action: "VENDOR_ACCOUNT_UPDATED_BY_SUPER_ADMIN",
        actorEmail: session!.user!.email!,
        actorId: (session!.user as any)?.id,
        resourceType: "VENDOR",
        resourceId: id,
        details: `Super Admin ${session!.user!.email!} updated profile & credentials for partner "${updatedVendor.businessName}". Changes: ${
          passwordHash ? "Password reset, " : ""
        }Details updated.`,
      },
    });

    return NextResponse.json({
      success: true,
      vendor: {
        id: updatedVendor.id,
        companyName: updatedVendor.businessName,
        city: updatedVendor.city,
        tourismLicense: updatedVendor.cnicOrTaxNumber || "REG-PENDING",
        phone1: updatedBankDetails.phone1 || updatedVendor.phone,
        phone2: updatedBankDetails.phone2 || updatedVendor.whatsapp || "",
        phone3: updatedBankDetails.phone3 || "",
        email: updatedVendor.user?.email || updatedBankDetails.email || "N/A",
        loginId: updatedBankDetails.loginId || updatedVendor.user?.username || updatedVendor.id.replace("v-", ""),
        status: updatedVendor.status === "VERIFIED" ? "ENABLED" : "DISABLED",
        commissionRate: updatedVendor.commissionRate,
        listingsCount: updatedVendor.listings.length,
        createdAt: updatedVendor.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error updating vendor:", error);
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

    let companyName = "";

    // 1. Delete permanently from Neon PostgreSQL Database
    try {
      const vendor = await prisma.vendor.findUnique({
        where: { id },
        include: { user: true, listings: true },
      });

      if (vendor) {
        companyName = vendor.businessName;

        // A. Delete all child records of this vendor's listings first (Units, Reviews, Bookings, Wishlists)
        const vendorListings = await prisma.listing.findMany({ where: { vendorId: id } });
        for (const l of vendorListings) {
          await prisma.listingUnit.deleteMany({ where: { listingId: l.id } }).catch(() => {});
          await prisma.review.deleteMany({ where: { listingId: l.id } }).catch(() => {});
          await prisma.booking.deleteMany({ where: { listingId: l.id } }).catch(() => {});
          await prisma.wishlist.deleteMany({ where: { listingId: l.id } }).catch(() => {});
          await prisma.listing.delete({ where: { id: l.id } }).catch(() => {});
        }

        // B. Delete all payouts
        await prisma.payout.deleteMany({ where: { vendorId: id } }).catch(() => {});

        // C. Delete the vendor record
        await prisma.vendor.delete({ where: { id } }).catch(() => {});

        // D. Delete the corresponding user
        if (vendor.userId) {
          await prisma.user.delete({ where: { id: vendor.userId } }).catch(() => {});
        }
      }
    } catch (dbErr) {
      console.warn("Prisma vendor cascade delete error:", dbErr);
    }

    // 2. Also delete from in-memory fallback stores
    const localVendor = getVendorById(id);
    if (localVendor && !companyName) {
      companyName = localVendor.companyName;
    }
    deleteVendorAccount(id);
    deleteListingsByVendorId(id);

    return NextResponse.json({
      success: true,
      message: `Partner account "${companyName || id}" and ALL associated tour packages have been permanently deleted from the database.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
