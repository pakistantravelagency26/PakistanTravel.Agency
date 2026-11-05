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
export const VENDORS_STORE: VendorAccount[] = [
  {
    id: "v-karakoram-expeditions",
    companyName: "Karakoram Expeditions & Northern Tours",
    city: "Skardu",
    tourismLicense: "DTS-GB-2024-0129",
    phone1: "03001118687",
    phone2: "03451122334",
    phone3: "03129988776",
    email: "vendor@pakistantravel.agency",
    loginId: "vendor",
    passwordPlain: "vendor123",
    status: "ENABLED",
    commissionRate: 12.0,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "v-hunza-adventures",
    companyName: "Hunza Valley Adventures & Treks",
    city: "Karimabad, Hunza",
    tourismLicense: "DTS-HUN-2023-402",
    phone1: "03551234567",
    phone2: "03005556677",
    phone3: "03468899001",
    email: "hunza@pakistantravel.agency",
    loginId: "hunza_adventures",
    passwordPlain: "hunza123",
    status: "ENABLED",
    commissionRate: 12.0,
    createdAt: "2024-02-10T14:30:00Z",
  },
  {
    id: "v-swat-alpine",
    companyName: "Swat & Kalam Alpine Travels",
    city: "Kalam, Swat",
    tourismLicense: "DTS-KPK-2024-881",
    phone1: "03017778899",
    phone2: "03459988112",
    phone3: "03335544332",
    email: "swat@pakistantravel.agency",
    loginId: "swat_alpine",
    passwordPlain: "swat123",
    status: "ENABLED",
    commissionRate: 10.0,
    createdAt: "2024-03-01T09:15:00Z",
  },
  {
    id: "v-serena-hotels",
    companyName: "Serena Hotels & Heritage Lodges",
    city: "Hunza / Gilgit",
    tourismLicense: "DTS-FED-55910",
    phone1: "03008899112",
    phone2: "03157788990",
    phone3: "03214455667",
    email: "serena@pakistantravel.agency",
    loginId: "serena_lodges",
    passwordPlain: "serena123",
    status: "ENABLED",
    commissionRate: 10.0,
    createdAt: "2024-01-20T11:45:00Z",
  },
];

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
