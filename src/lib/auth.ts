import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { prisma } from "./prisma.ts";
import { findUserByIdentifier } from "../services/user.service.ts";
import { verifyPassword, hashPassword, needsRehash } from "./password.ts";
import { checkRateLimit, resetRateLimit } from "./rate-limit.ts";
import { checkServerlessRateLimit } from "./serverlessRateLimiter.ts";
import { getTrustedClientIp } from "./clientIp.ts";
import { checkLoginStatus, recordFailedLogin, recordSuccessfulLogin, isIpWhitelisted } from "./loginThrottle.ts";

// Pre-computed valid bcrypt salt/hash (cost 12) for constant-time evaluation to eliminate timing attacks
const DUMMY_BCRYPT_HASH = "$2a$12$/AOsayhHFTkic9qQNjdMJONH7S7V/rZK5iQK2XuduAumIzsRi0lfu";

// Fallback secret ensures NextAuth never crashes with NO_SECRET even if Vercel env var is momentarily absent
const DEFAULT_AUTH_SECRET = "5de993c28db9ed08866510437fbfec2a5e9f331f113c994f8b341af47948f3e2";
const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || DEFAULT_AUTH_SECRET;

const Google = (GoogleProvider as any)?.default || GoogleProvider;
const Facebook = (FacebookProvider as any)?.default || FacebookProvider;
const Credentials = (CredentialsProvider as any)?.default || CredentialsProvider;

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
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          Facebook({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : []),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Login ID / Email / Phone", type: "text" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "2FA Authenticator Code", type: "text" },
        portal: { label: "Portal", type: "text" },
      },
      async authorize(credentials: Record<string, string> | undefined, req: any) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both Login ID and password");
        }

        const identifier = credentials.email.trim();
        const clientIp = getTrustedClientIp(req?.headers);

        // 0. Serverless Rate Limit on IP (max 15 login attempts per 10 minutes) - whitelisted IPs bypass
        if (!isIpWhitelisted(clientIp)) {
          const ipRate = await checkServerlessRateLimit(`login:ip:${clientIp}`, 15, 600);
          if (!ipRate.success) {
            throw new Error("Too many login attempts from this network. Please try again in 10 minutes.");
          }
        }

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

        // 4a. Strict Portal Role Separation
        const reqPortal = String((credentials as any)?.portal || "").toUpperCase().trim();
        const referer = String(req?.headers?.referer || req?.headers?.get?.("referer") || "").toLowerCase();

        let targetPortal: "ADMIN" | "VENDOR" | "CUSTOMER" = "CUSTOMER";
        if (reqPortal === "ADMIN" || referer.includes("/secure-admin")) {
          targetPortal = "ADMIN";
        } else if (reqPortal === "VENDOR" || referer.includes("/partner-hub")) {
          targetPortal = "VENDOR";
        } else {
          targetPortal = "CUSTOMER";
        }

        if (targetPortal === "ADMIN" && user.role !== "ADMIN") {
          throw new Error("Access restricted. This portal is for platform administrators only. Vendor partners must sign in at /partner-hub/login.");
        }

        if (targetPortal === "VENDOR" && user.role !== "VENDOR") {
          if (user.role === "ADMIN") {
            throw new Error("Administrative accounts cannot log in to the Partner Portal. Please sign in at /secure-admin/login.");
          }
          throw new Error("Access restricted. This portal is for registered vendor partners only. Please sign in at /partner-hub/login.");
        }

        if (targetPortal === "CUSTOMER") {
          if (user.role === "ADMIN") {
            throw new Error("Administrative accounts cannot log in as customers. Please sign in at /secure-admin/login.");
          }
          if (user.role === "VENDOR") {
            throw new Error("Vendor accounts must sign in at the Partner Extranet Portal (/partner-hub/login).");
          }
        }

        // 4b. Transparent Migration: Upgrade legacy password hashes (< cost 12) on successful login
        if (user && user.passwordHash && needsRehash(user.passwordHash)) {
          try {
            const upgradedHash = await hashPassword(credentials.password);
            await prisma.user.update({
              where: { id: user.id },
              data: { passwordHash: upgradedHash },
            });
            console.log(`[SECURITY AUTH] Upgraded password hash to bcrypt cost 12 for user: ${user.email}`);
          } catch (err) {
            console.warn("[SECURITY AUTH] Failed to upgrade legacy password hash:", err);
          }
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

        // 7. Verify staff account is not suspended
        if (user.role === "ADMIN" && user.staffRole === "SUSPENDED") {
          throw new Error("This staff account has been blocked / suspended by Super Administrator. Access denied.");
        }

        // 8. Verify that vendor account is not disabled by Super Admin
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
          username: (user as any).username || null,
          tokenVersion: (user as any).sessionVersion ?? (user as any).tokenVersion ?? 1,
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
          const email = user.email.toLowerCase().trim();
          let dbUser = await prisma.user.findUnique({
            where: { email },
          });

          // SECURITY: Block OAuth login for ADMIN and VENDOR roles.
          // They must use email + password + 2FA TOTP only.
          if (dbUser && (dbUser.role === "ADMIN" || dbUser.role === "VENDOR")) {
            console.warn(`[SECURITY AUTH] Blocked OAuth login attempt for ${dbUser.role} account: ${email}`);
            return "/login?error=OAuthRoleRestricted";
          }

          if (!dbUser) {
            // Auto-create customer account in Neon DB
            dbUser = await prisma.user.create({
              data: {
                email,
                name: user.name || email.split("@")[0],
                role: "CUSTOMER",
                passwordHash: null,
                phone: null,
                tokenVersion: 1,
                sessionVersion: 1,
              },
            });
          }

          user.id = dbUser.id;
          (user as any).role = dbUser.role;
          (user as any).staffRole = dbUser.staffRole || "CUSTOMER";
          (user as any).permissions = (dbUser as any).permissions || "NONE";
          (user as any).vendorId = (dbUser as any).vendorId || null;
          (user as any).phone = dbUser.phone || null;
          (user as any).tokenVersion = dbUser.sessionVersion ?? dbUser.tokenVersion ?? 1;
          return true;
        } catch (err) {
          console.error("OAuth signIn error:", err);
          return false;
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
        token.username = (user as any).username || null;
        token.tokenVersion = (user as any).tokenVersion || (user as any).sessionVersion || 1;
        token.twoFactorEnabled = Boolean((user as any).twoFactorEnabled);
      }

      // Active Database Session / Token Version Verification on Every Request
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              id: true,
              username: true,
              tokenVersion: true,
              sessionVersion: true,
              role: true,
              staffRole: true,
              permissions: true,
              twoFactorEnabled: true,
              vendorProfile: { select: { id: true } },
            },
          });

          // Session Revocation: If user was deleted or tokenVersion was incremented or staff suspended
          const currentVersion = dbUser?.sessionVersion ?? dbUser?.tokenVersion;
          if (!dbUser || (token.tokenVersion && currentVersion && (token.tokenVersion as number) < currentVersion) || (dbUser.role === "ADMIN" && dbUser.staffRole === "SUSPENDED")) {
            return {} as any; // Safely clears user session without NextAuth 500 error
          }
          if (currentVersion && (!token.tokenVersion || (token.tokenVersion as number) < currentVersion)) {
            token.tokenVersion = currentVersion;
          }

          token.role = dbUser.role;
          token.username = dbUser.username || null;
          token.staffRole = dbUser.staffRole;
          token.permissions = dbUser.permissions;
          token.twoFactorEnabled = Boolean(dbUser.twoFactorEnabled);
          if (dbUser.vendorProfile) {
            token.vendorId = dbUser.vendorProfile.id;
          }
        } catch {
          // If DB is temporarily offline, retain existing claims
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
      if (!token || !token.id || !session.user) {
        return null as any;
      }
      session.user.id = token.id as string;
      session.user.role = token.role as "CUSTOMER" | "VENDOR" | "ADMIN";
      session.user.staffRole = (token.staffRole as string) || (token.role === "ADMIN" ? "SUPER_ADMIN" : "CUSTOMER");
      session.user.permissions = (token.permissions as string) || (token.role === "ADMIN" ? "ALL" : "NONE");
      session.user.vendorId = token.vendorId as string | null;
      session.user.phone = token.phone as string | null;
      (session.user as any).username = (token.username as string | null) || null;
      (session.user as any).tokenVersion = token.tokenVersion as number;
      (session.user as any).twoFactorEnabled = Boolean(token.twoFactorEnabled);
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 1. Internal relative URL validation
      if (url.startsWith("/")) {
        // Prevent protocol-relative bypasses (//evil.com) and backslash bypasses (/\evil.com)
        if (url.startsWith("//") || url.startsWith("/\\") || url.includes("://")) {
          return baseUrl;
        }
        return `${baseUrl}${url}`;
      }
      // 2. Absolute same-origin URL validation
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) {
          return url;
        }
      } catch {
        // Malformed URL
      }
      return baseUrl;
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
    callbackUrl: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.callback-url" : "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === "production" ? "__Host-next-auth.csrf-token" : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: authSecret,
};
