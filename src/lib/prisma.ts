if (typeof window !== "undefined") {
  throw new Error("SECURITY REFUSAL: PrismaClient cannot be loaded on the client side.");
}
import { PrismaClient } from "@prisma/client";

// Ensure environment is loaded in standalone scripts / tests
if (!process.env.DATABASE_URL && !process.env.TEST_DATABASE_URL) {
  try {
    if (typeof (process as any).loadEnvFile === "function") {
      (process as any).loadEnvFile();
    }
  } catch {
    // Ignore if running where env files do not exist (e.g. CI or production with injected env)
  }
}

const isTestEnv =
  process.env.NODE_ENV === "test" ||
  process.argv.some((arg) => arg.includes("test"));

let activeUrl: string;

if (isTestEnv) {
  const testUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  if (!testUrl) {
    throw new Error(
      "CONFIGURATION ERROR: TEST_DATABASE_URL or DATABASE_URL must be configured to run tests."
    );
  }

  // STRICT SAFETY GUARD: Refuse to run automated tests against the production database!
  if (testUrl.includes("ep-rapid-mud-a1v8sgvo")) {
    throw new Error(
      "FATAL REFUSAL: Automated tests are strictly prohibited from connecting to the Neon production database (ep-rapid-mud-a1v8sgvo)! Set TEST_DATABASE_URL to a separate Neon test branch."
    );
  }

  activeUrl = testUrl;
} else {
  const prodUrl =
    (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("db.prisma.io"))
      ? (process.env.NEON_DATABASE_URL || process.env.DATABASE_URL)
      : (process.env.DATABASE_URL || process.env.NEON_DATABASE_URL);

  if (!prodUrl || prodUrl.includes("db.prisma.io")) {
    // Safe fallback for Next.js build-time page and route collection when DATABASE_URL is not provided during build
    activeUrl =
      "postgresql://build_placeholder:build_placeholder@127.0.0.1:5432/build_placeholder?sslmode=require";
  } else {
    activeUrl = prodUrl;
  }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: activeUrl,
      },
    },
    log: ["error"],
  });

// Always preserve client in global across warm serverless lambdas in production
globalForPrisma.prisma = prisma;

export default prisma;
