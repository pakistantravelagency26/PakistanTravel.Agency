import { PrismaClient } from "@prisma/client";

// Neon PostgreSQL Cloud Database Production Endpoint (ep-rapid-mud-a1v8sgvo)
export const NEON_DATABASE_URL =
  "postgresql://neondb_owner:npg_k7EXbIsmn9hM@ep-rapid-mud-a1v8sgvo-pooler.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

// Dedicated Neon Isolated Test Branch (br-long-block-a1buzuo6 / ep-holy-hat-a1jvvm2m)
export const NEON_TEST_DATABASE_URL =
  "postgresql://neondb_owner:npg_k7EXbIsmn9hM@ep-holy-hat-a1jvvm2m-pooler.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

const isTestEnv =
  process.env.NODE_ENV === "test" ||
  process.argv.some((arg) => arg.includes("test"));

let activeUrl: string;

if (isTestEnv) {
  // Use explicit test URL or default to isolated test branch
  activeUrl = process.env.TEST_DATABASE_URL || NEON_TEST_DATABASE_URL;

  // STRICT SAFETY GUARD: Refuse to run automated tests against the production database!
  if (activeUrl.includes("ep-rapid-mud-a1v8sgvo")) {
    throw new Error(
      "FATAL REFUSAL: Automated tests are strictly prohibited from connecting to the Neon production database (ep-rapid-mud-a1v8sgvo)! Set TEST_DATABASE_URL to a separate Neon test branch."
    );
  }
} else {
  // Fall back to live Neon Postgres if DATABASE_URL is unset or pointing to empty db.prisma.io placeholder
  activeUrl =
    process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("db.prisma.io")
      ? process.env.DATABASE_URL
      : NEON_DATABASE_URL;
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

