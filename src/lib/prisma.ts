import { PrismaClient } from "@prisma/client";

// Neon PostgreSQL Cloud Database (ep-rapid-mud-a1v8sgvo)
export const NEON_DATABASE_URL =
  "postgresql://neondb_owner:npg_k7EXbIsmn9hM@ep-rapid-mud-a1v8sgvo-pooler.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

// Fall back to live Neon Postgres if DATABASE_URL is unset or pointing to empty db.prisma.io placeholder
const activeUrl =
  process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("db.prisma.io")
    ? process.env.DATABASE_URL
    : NEON_DATABASE_URL;

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
