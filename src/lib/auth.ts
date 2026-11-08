import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { prisma } from "@/lib/prisma";
import { findUserByIdentifier } from "@/services/user.service";
import { verifyPassword } from "@/lib/password";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { getTrustedClientIp } from "@/lib/clientIp";
import { checkLoginStatus, recordFailedLogin, recordSuccessfulLogin } from "@/lib/loginThrottle";

// Pre-computed valid bcrypt salt/hash for constant-time evaluation to eliminate timing attacks
const DUMMY_BCRYPT_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

const authSecret = process.env.NEXTAUTH_SECRET;
if (process.env.NODE_ENV === "production") {
  if (!authSecret || authSecret.length < 32 || authSecret === "pakistantravel-agency-secret-token") {
    throw new Error(
      "FATAL SECURITY CONFIGURATION: NEXTAUTH_SECRET must be set to a cryptographically secure string (at least 32 characters) in production."
    );
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-client-secret",
      allowDangerousEmailAccountLinking: false,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "dummy-fb-id",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "dummy-fb-secret",
      allowDangerousEmailAccountLinking: false,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Login ID / Email / Phone", type: "text" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "2FA Authenticator Code", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both Login ID and password");
        }

        const identifier = credentials.email.trim();
        const clientIp = getTrustedClientIp(req?.headers);

        // 1. Check persistent lockout status (30-min block after 3 wrong passwords or global IP block)
        const status = await checkLoginStatus(identifier, clientIp);
        if (!status.allowed) {
          throw new Error(status.message || "Account temporarily locked. Please try again later.");
        }

        // 2. Progressive backoff delay (1s, 2s, 3s... up to 60s)
        if (status.delayMs && status.delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, status.delayMs));
        }

        // 3. User lookup
        const user = await findUserByIdentifier(identifier);

        // 4. Cryptographic password verification (bcrypt) with constant-time protection
        let isValid = false;
        if (user && user.passwordHash) {
          try {
            isValid = await verifyPassword(credentials.password, user.passwordHash);
          } catch {
            isValid = false;
          }
        } else {
          // Constant-time dummy verify to eliminate timing-based user enumeration attacks
          try {
            await verifyPassword(credentials.password, DUMMY_BCRYPT_HASH);
          } catch {
            // ignore
          }
          isValid = false;
        }

        if (!isValid || !user) {
          const lockResult = await recordFailedLogin(identifier, clientIp, user?.role);
          if (lockResult.locked) {
            throw new Error(
              lockResult.reason ||
                "Account temporarily locked due to 3 consecutive failed login attempts. Please try again in 30 minutes."
            );
          }
          throw new Error("Invalid Login ID or password");
        }

        // 5. Two-Factor Authentication (TOTP / Google Authenticator) Check
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          const totpCode = (credentials as any).totpCode?.trim();
          if (!totpCode) {
            throw new Error("2FA_REQUIRED");
          }

          const { verifyTotpCode, verifyRecoveryCode } = await import("./totp.ts");
          const { decryptTotpSecret } = await import("./totpCrypto.ts");

          let isTotpValid = false;
          try {
            const decryptedSecret = decryptTotpSecret(user.twoFactorSecret);
            isTotpValid = verifyTotpCode(totpCode, decryptedSecret, 1);
          } catch {
            isTotpValid = false;
          }

          if (!isTotpValid && user.twoFactorRecoveryCodes) {
            try {
              const hashedCodes: string[] = JSON.parse(user.twoFactorRecoveryCodes);
              const recovery = verifyRecoveryCode(totpCode, hashedCodes);
              if (recovery.valid) {
                isTotpValid = true;
                // Single-use recovery code: burn it in DB
                await prisma.user.update({
                  where: { id: user.id },
                  data: { twoFactorRecoveryCodes: JSON.stringify(recovery.remainingHashedCodes) },
                });
                await prisma.auditLog.create({
                  data: {
                    action: "2FA_RECOVERY_CODE_USED",
                    actorEmail: user.email,
                    actorId: user.id,
                    details: `Single-use recovery code consumed. ${recovery.remainingHashedCodes.length} remaining.`,
                  },
                });
              }
            } catch {
              // Recovery code check error
            }
          }

          if (!isTotpValid) {
            await recordFailedLogin(identifier, clientIp, user.role);
            throw new Error("Invalid 2FA Authenticator code or recovery code.");
          }
        }

        // 6. Successful login: record success and clear lockouts
        await recordSuccessfulLogin(identifier, clientIp);
        resetRateLimit(`login-auth:${identifier.toLowerCase()}`);

        // 7. Verify that vendor account is not disabled by Super Admin
        if (user.role === "VENDOR" && user.vendorId) {
          const { isVendorEnabled } = await import("@/services/vendor.service");
          if (!isVendorEnabled(user.vendorId)) {
            throw new Error("This Vendor / Partner account has been deactivated by Super Admin. Please contact PakistanTravel.Agency administration.");
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: null,
          role: user.role,
          staffRole: user.staffRole || (user.role === "ADMIN" ? "SUPER_ADMIN" : "CUSTOMER"),
          permissions: (user as any).permissions || (user.role === "ADMIN" ? "ALL" : "NONE"),
          vendorId: user.vendorId || null,
          phone: user.phone,
          tokenVersion: (user as any).tokenVersion || 1,
          twoFactorEnabled: Boolean(user.twoFactorEnabled),
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        if (!user.email) {
          return false;
        }
        try {
          // Check if user already exists in Neon database
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase().trim() },
          });

          if (!dbUser) {
            // Auto-create customer account in Neon DB
            dbUser = await prisma.user.create({
              data: {
                email: user.email.toLowerCase().trim(),
                name: user.name || user.email.split("@")[0],
                role: "CUSTOMER",
                passwordHash: null,
                phone: null,
              },
            });
          }

          user.id = dbUser.id;
          (user as any).role = dbUser.role;
          (user as any).staffRole = dbUser.staffRole || "CUSTOMER";
          (user as any).permissions = (dbUser as any).permissions || "NONE";
          (user as any).vendorId = (dbUser as any).vendorId || null;
          (user as any).phone = dbUser.phone || null;
          return true;
        } catch (err) {
          console.error("OAuth signIn error:", err);
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.staffRole = user.staffRole;
        token.permissions = user.permissions;
        token.vendorId = user.vendorId;
        token.phone = user.phone;
        token.tokenVersion = (user as any).tokenVersion || 1;
        token.twoFactorEnabled = Boolean((user as any).twoFactorEnabled);
      }

      // Auto-load vendorId from Neon DB if not present in existing session token
      if (token.id && !token.vendorId && (token.role === "VENDOR" || token.role === "ADMIN")) {
        try {
          const dbVendor = await prisma.vendor.findFirst({
            where: { userId: token.id as string },
          });
          if (dbVendor) {
            token.vendorId = dbVendor.id;
          }
        } catch {
          // ignore DB error
        }
      }

      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.role = session.role || token.role;
        token.staffRole = session.staffRole ?? token.staffRole;
        token.permissions = session.permissions ?? token.permissions;
        token.vendorId = session.vendorId ?? token.vendorId;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CUSTOMER" | "VENDOR" | "ADMIN";
        session.user.staffRole = (token.staffRole as string) || (token.role === "ADMIN" ? "SUPER_ADMIN" : "CUSTOMER");
        session.user.permissions = (token.permissions as string) || (token.role === "ADMIN" ? "ALL" : "NONE");
        session.user.vendorId = token.vendorId as string | null;
        session.user.phone = token.phone as string | null;
        (session.user as any).twoFactorEnabled = Boolean(token.twoFactorEnabled);
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: authSecret || (process.env.NODE_ENV === "development" ? "dev-local-only-secret-do-not-use-in-production-32c" : undefined),
};
