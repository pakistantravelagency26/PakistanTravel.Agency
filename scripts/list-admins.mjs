import { PrismaClient } from "@prisma/client";
import fs from "fs";

let activeUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
if (!activeUrl && fs.existsSync(".env")) {
  const envContent = fs.readFileSync(".env", "utf8");
  const testMatch = envContent.match(/TEST_DATABASE_URL="([^"]+)"/);
  const prodMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
  activeUrl = testMatch ? testMatch[1] : (prodMatch ? prodMatch[1] : undefined);
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: activeUrl },
  },
});

async function main() {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      staffRole: true,
      permissions: true,
      twoFactorEnabled: true,
      createdAt: true,
    },
  });

  console.log("=== CURRENT ADMIN ACCOUNTS IN DATABASE ===");
  console.log(`Database Endpoint: ${activeUrl ? activeUrl.split("@")[1].split("/")[0] : "unknown"}`);
  console.log(`Total ADMIN accounts: ${admins.length}`);
  console.log(JSON.stringify(admins, null, 2));
}

main()
  .catch((e) => console.error(e.message))
  .finally(() => prisma.$disconnect());
