import { prisma } from "../lib/prisma.ts";
import { hashPassword, verifyPassword } from "../lib/password.ts";
import { siteConfig } from "../config/site.ts";

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  username?: string;
  passwordHash: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  staffRole?: string | null;
  vendorId?: string | null;
  businessName?: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string | null;
  twoFactorRecoveryCodes?: string | null;
}

// In-memory fallback user repository (empty by default; all users authenticated via PostgreSQL)
export const USERS_STORE: LocalUser[] = [];

export async function findUserByIdentifier(identifier: string): Promise<LocalUser | null> {
  const query = identifier.toLowerCase().trim();
  if (!query) return null;

  // 1. Check Database first if online
  try {
    const isEmail = query.includes("@");
    const dbUser = isEmail
      ? await prisma.user.findUnique({
          where: { email: query },
          include: { vendorProfile: true },
        })
      : await prisma.user.findFirst({
          where: {
            OR: [
              { email: query },
              { phone: query },
              { phone: query.replace(/^\+92/, "0") },
              { phone: query.replace(/^92/, "0") },
              { phone: query.replace(/[\s\-()]/g, "") },
              { phone: query.replace(/[\s\-()]/g, "").replace(/^\+92/, "0") },
              { phone: query.replace(/[\s\-()]/g, "").replace(/^92/, "0") },
            ],
          },
          include: { vendorProfile: true },
        });

    if (dbUser) {
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone || "",
        passwordHash: dbUser.passwordHash || "",
        role: dbUser.role as any,
        staffRole: (dbUser as any).staffRole || "SUPER_ADMIN",
        vendorId: dbUser.vendorProfile?.id || null,
        businessName: dbUser.vendorProfile?.businessName || undefined,
        twoFactorEnabled: Boolean((dbUser as any).twoFactorEnabled),
        twoFactorSecret: (dbUser as any).twoFactorSecret || null,
        twoFactorRecoveryCodes: (dbUser as any).twoFactorRecoveryCodes || null,
      };
    }
  } catch (err) {
    // Database offline - fallback to local in-memory store
  }

  // 3. Check in-memory store by email, username, phone or id
  const local = USERS_STORE.find((u) => 
    u.email.toLowerCase() === query ||
    (u.username && u.username.toLowerCase() === query) ||
    u.phone.replace(/[^0-9]/g, "") === query.replace(/[^0-9]/g, "") ||
    u.id.toLowerCase() === query
  );

  return local || null;
}

export async function findUserByEmail(email: string): Promise<LocalUser | null> {
  return findUserByIdentifier(email);
}

export async function registerLocalUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "CUSTOMER" | "VENDOR";
  businessName?: string;
  city?: string;
  whatsapp?: string;
  cnicOrTaxNumber?: string;
}): Promise<LocalUser> {
  const normalized = data.email.toLowerCase().trim();
  const passwordHash = await hashPassword(data.password);

  try {
    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          name: data.name,
          email: normalized,
          phone: data.phone.trim(),
          passwordHash,
          role: data.role,
        },
      });

      let vendorId = null;
      if (data.role === "VENDOR") {
        const v = await tx.vendor.create({
          data: {
            userId: u.id,
            businessName: data.businessName || `${data.name}'s Travel Agency`,
            city: data.city || "Islamabad",
            phone: data.phone.trim(),
            whatsapp: data.whatsapp?.trim() || data.phone.trim(),
            cnicOrTaxNumber: data.cnicOrTaxNumber || null,
            status: "PENDING",
            commissionRate: siteConfig.marketplace.defaultCommissionRate || 10.0,
          },
        });
        vendorId = v.id;
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || "",
        passwordHash,
        role: u.role as any,
        vendorId,
        businessName: data.businessName,
      };
    });

    return user;
  } catch (err) {
    const newUser: LocalUser = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: normalized,
      phone: data.phone.trim(),
      passwordHash,
      role: data.role,
      vendorId: data.role === "VENDOR" ? `v-karakoram-expeditions` : null,
      businessName: data.businessName || "Karakoram Expeditions & Northern Tours",
    };

    const idx = USERS_STORE.findIndex((u) => u.email.toLowerCase() === normalized);
    if (idx >= 0) {
      USERS_STORE[idx] = newUser;
    } else {
      USERS_STORE.push(newUser);
    }

    return newUser;
  }
}
