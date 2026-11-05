import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Neon PostgreSQL Cloud Database (ep-rapid-mud-a1v8sgvo)
export const NEON_DATABASE_URL =
  "postgresql://neondb_owner:npg_k7EXbIsmn9hM@ep-rapid-mud-a1v8sgvo-pooler.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

// Fall back to live Neon Postgres if DATABASE_URL is unset or pointing to empty db.prisma.io placeholder
const activeUrl =
  process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("db.prisma.io")
    ? process.env.DATABASE_URL
    : NEON_DATABASE_URL;

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: activeUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
