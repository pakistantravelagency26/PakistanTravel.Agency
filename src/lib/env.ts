import { z } from "zod";

const WEAK_SECRETS = new Set([
  "super-secret-random-key-change-in-production",
  "generate-a-strong-32-byte-hex-or-base64-secret",
  "generate-a-strong-32-byte-hex-or-base64-secret-min-32-chars",
  "voucher-token-fallback",
  "change-in-production",
  "secret",
  "password",
  "12345678",
  "pt-auth-secret-production-key-2026-v2",
]);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (val) => !val.includes("db.prisma.io"),
      "DATABASE_URL must not use placeholder db.prisma.io"
    )
    .refine(
      (val) => val.startsWith("postgresql://") || val.startsWith("postgres://"),
      "DATABASE_URL must be a valid PostgreSQL connection URI"
    )
    .refine(
      (val) => val.includes("sslmode=require"),
      "DATABASE_URL must enforce SSL (sslmode=require)"
    )
    .optional()
    .or(z.literal("")),
  DIRECT_URL: z
    .string()
    .refine(
      (val) => val.startsWith("postgresql://") || val.startsWith("postgres://"),
      "DIRECT_URL must be a valid PostgreSQL connection URI"
    )
    .refine(
      (val) => val.includes("sslmode=require"),
      "DIRECT_URL must enforce SSL (sslmode=require)"
    )
    .optional()
    .or(z.literal("")),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters long")
    .refine(
      (val) => !WEAK_SECRETS.has(val.trim()),
      "NEXTAUTH_SECRET must not use a known weak or placeholder secret"
    )
    .optional()
    .or(z.literal("")),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL").optional().or(z.literal("")),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL")
    .optional()
    .or(z.literal("")),
  NEXT_PUBLIC_COMMISSION_PERCENT: z.string().optional().or(z.literal("")),
  CRON_SECRET: z.string().optional().or(z.literal("")),
  PAYMENT_WEBHOOK_SECRET: z.string().optional().or(z.literal("")),
  CLOUDINARY_CLOUD_NAME: z.string().optional().or(z.literal("")),
  CLOUDINARY_API_KEY: z.string().optional().or(z.literal("")),
  CLOUDINARY_API_SECRET: z.string().optional().or(z.literal("")),
  TWO_FACTOR_ENCRYPTION_KEY: z
    .string()
    .min(32, "TWO_FACTOR_ENCRYPTION_KEY must be at least 32 characters if set")
    .optional()
    .or(z.literal("")),
});

export function validateEnvironment(): z.infer<typeof envSchema> {
  const isTest =
    process.env.NODE_ENV === "test" ||
    process.argv.some((arg) => arg.includes("test"));
  const isProd = process.env.NODE_ENV === "production";

  // 1. Audit all NEXT_PUBLIC_* variables to ensure no secrets are exposed to clients
  for (const [key, val] of Object.entries(process.env)) {
    if (key.startsWith("NEXT_PUBLIC_") && val) {
      const lower = key.toLowerCase();
      if (
        lower.includes("secret") ||
        lower.includes("password") ||
        lower.includes("private") ||
        lower.includes("token")
      ) {
        throw new Error(
          `SECURITY CRITICAL: Public client environment variable "${key}" contains sensitive keywords. Secrets must never be prefixed with NEXT_PUBLIC_!`
        );
      }
      if (
        val.startsWith("npg_") ||
        val.startsWith("sk_live_") ||
        val.startsWith("sk_test_") ||
        val.startsWith("ghp_") ||
        val.includes("BEGIN PRIVATE KEY")
      ) {
        throw new Error(
          `SECURITY CRITICAL: Public client environment variable "${key}" contains high-entropy secret patterns!`
        );
      }
    }
  }

  // 2. Validate environment schema
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const errorMsg = `Environment configuration validation failed:\n${JSON.stringify(
      errors,
      null,
      2
    )}`;

    if (isProd) {
      throw new Error(`FATAL: ${errorMsg}`);
    } else if (!isTest) {
      console.warn(`[WARN] ${errorMsg}`);
    }
    return (parsed as any).data || (process.env as any);
  }

  // 3. Strict production assertions
  if (isProd) {
    if (!process.env.DATABASE_URL) {
      throw new Error("FATAL: DATABASE_URL is strictly required in production!");
    }
    if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) {
      throw new Error(
        "FATAL: NEXTAUTH_SECRET is strictly required and must be at least 32 characters in production!"
      );
    }
    if (WEAK_SECRETS.has(process.env.NEXTAUTH_SECRET.trim())) {
      throw new Error(
        "FATAL: NEXTAUTH_SECRET is set to an insecure default/placeholder secret in production! Generate a strong random key."
      );
    }
  }

  return parsed.data;
}

export const env = validateEnvironment();
