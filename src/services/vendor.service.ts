import { hashPassword } from "@/lib/password";
import { USERS_STORE, LocalUser } from "@/services/user.service";

export interface VendorAccount {
  id: string;
  companyName: string;
  city: string;
  tourismLicense: string;
  phone1: string; // Primary / WhatsApp
  phone2: string; // Secondary Office
  phone3: string; // Emergency / Tour Guide
  email: string;
  loginId: string; // Custom username/ID set by admin
  passwordPlain: string; // Password set by admin
  status: "ENABLED" | "DISABLED";
  commissionRate: number;
  createdAt: string;
}

// Global persistent store for vendor accounts across the platform
export const VENDORS_STORE: VendorAccount[] = [];

export function getAllVendors(): VendorAccount[] {
  return [...VENDORS_STORE];
}

export function getVendorById(id: string): VendorAccount | undefined {
  return VENDORS_STORE.find((v) => v.id === id);
}

export function isVendorEnabled(vendorId: string | null | undefined): boolean {
  if (!vendorId) return true; // generic listing
  const vendor = VENDORS_STORE.find((v) => v.id === vendorId);
  if (!vendor) return true; // not found in registry, default to active
  return vendor.status === "ENABLED";
}

export function toggleVendorStatus(vendorId: string): VendorAccount | null {
  const vendor = VENDORS_STORE.find((v) => v.id === vendorId);
  if (!vendor) return null;

  vendor.status = vendor.status === "ENABLED" ? "DISABLED" : "ENABLED";
  return { ...vendor };
}

export async function createVendorAccount(data: {
  companyName: string;
  city: string;
  tourismLicense: string;
  phone1: string;
  phone2: string;
  phone3: string;
  email: string;
  loginId: string;
  passwordPlain: string;
}): Promise<VendorAccount> {
  const cleanId = `v-${data.companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}-${Date.now().toString().slice(-4)}`;

  const newVendor: VendorAccount = {
    id: cleanId,
    companyName: data.companyName.trim(),
    city: data.city.trim(),
    tourismLicense: data.tourismLicense.trim(),
    phone1: data.phone1.trim(),
    phone2: data.phone2.trim(),
    phone3: data.phone3.trim(),
    email: data.email.toLowerCase().trim(),
    loginId: data.loginId.trim(),
    passwordPlain: data.passwordPlain.trim(),
    status: "ENABLED",
    commissionRate: 12.0,
    createdAt: new Date().toISOString(),
  };

  VENDORS_STORE.unshift(newVendor);

  // Sync with USERS_STORE so the vendor can immediately log in to /partner-hub/login
  const passwordHash = await hashPassword(newVendor.passwordPlain);
  const newUserRecord: LocalUser = {
    id: `usr-${cleanId}`,
    name: newVendor.companyName,
    email: newVendor.email,
    username: newVendor.loginId.toLowerCase(),
    phone: newVendor.phone1,
    passwordHash,
    role: "VENDOR",
    vendorId: newVendor.id,
    businessName: newVendor.companyName,
  };

  const existingUserIdx = USERS_STORE.findIndex(
    (u) =>
      u.email.toLowerCase() === newUserRecord.email ||
      (u.username && u.username.toLowerCase() === newUserRecord.username)
  );

  if (existingUserIdx >= 0) {
    USERS_STORE[existingUserIdx] = newUserRecord;
  } else {
    USERS_STORE.unshift(newUserRecord);
  }

  return newVendor;
}

export function deleteVendorAccount(vendorId: string): boolean {
  const vendorIdx = VENDORS_STORE.findIndex((v) => v.id === vendorId);
  if (vendorIdx === -1) return false;

  const vendor = VENDORS_STORE[vendorIdx];
  // 1. Remove from VENDORS_STORE
  VENDORS_STORE.splice(vendorIdx, 1);

  // 2. Remove corresponding user credentials from USERS_STORE
  const userIdx = USERS_STORE.findIndex(
    (u) =>
      u.vendorId === vendorId ||
      u.email.toLowerCase() === vendor.email.toLowerCase() ||
      (u.username && u.username.toLowerCase() === vendor.loginId.toLowerCase())
  );
  if (userIdx >= 0) {
    USERS_STORE.splice(userIdx, 1);
  }

  // 3. Remove all tours from this vendor
  try {
    const { deleteListingsByVendorId } = require("./listing.service");
    if (typeof deleteListingsByVendorId === "function") {
      deleteListingsByVendorId(vendorId);
    }
  } catch (err) {
    console.error("Failed to delete listings for vendor:", err);
  }

  return true;
}
