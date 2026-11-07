import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  username?: string;
  passwordHash: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  vendorId?: string | null;
  businessName?: string;
}

// In-memory persistent user repository with pre-configured authentic bcrypt credentials
export const USERS_STORE: LocalUser[] = [
  // SUPER ADMIN (Controls entire website, vendors & payouts)
  {
    id: "user-admin-emraan",
    name: "Emraan Irshad",
    email: "emraanirshad88@gmail.com",
    username: "emraanirshad88",
    phone: "03000000001",
    passwordHash: "$2a$10$o4qbwcfotztX2tCS5qKhxu2Z1fX0DXgfM.80hqQtaGiRVfUAGKKDS", // Emra@91173259
    role: "ADMIN",
  },
  {
    id: "user-admin-1",
    name: "Super Admin Pakistan",
    email: "admin@pakistantravel.agency",
    username: "admin",
    phone: "03000000001",
    passwordHash: "$2a$10$o4qbwcfotztX2tCS5qKhxu2Z1fX0DXgfM.80hqQtaGiRVfUAGKKDS", // Emra@91173259
    role: "ADMIN",
  },
];

export async function findUserByIdentifier(identifier: string): Promise<LocalUser | null> {
  const query = identifier.toLowerCase().trim();
  if (!query) return null;

  // 1. Direct username shortcuts:
  if (query === "admin" || query === "administrator") {
    return USERS_STORE.find((u) => u.role === "ADMIN") || null;
  }

  // 2. Check Database first if online
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
        vendorId: dbUser.vendorProfile?.id || null,
        businessName: dbUser.vendorProfile?.businessName || undefined,
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
            cnicOrTaxNumber: data.cnicOrTaxNumber || null,
            status: "PENDING",
            commissionRate: 12.0,
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
