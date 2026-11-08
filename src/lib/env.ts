import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters in production")
      : z.string().min(16).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  PAYMENT_WEBHOOK_SECRET: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

export function validateEnvironment(): void {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.warn("ENVIRONMENT CONFIGURATION WARNING:", result.error.flatten().fieldErrors);
  }
}

// Run validation once at module initialization
validateEnvironment();
