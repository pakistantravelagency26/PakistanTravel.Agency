/**
 * PakistanTravel.Agency - Initial Super Admin Provisioning Script
 * 
 * SERVER-SIDE ONLY CLI COMMAND
 * Cannot be called via web API or HTTP endpoints.
 * 
 * Usage:
 *   node scripts/create-admin.mjs --email="admin@pakistantravel.agency" --password="SuperSecurePassword2026!" --name="Super Admin" --phone="03001234567"
 * 
 * Or via environment variables:
 *   INITIAL_ADMIN_EMAIL="admin@pakistantravel.agency"
 *   INITIAL_ADMIN_PASSWORD="SuperSecurePassword2026!"
 *   node scripts/create-admin.mjs
 */

import { PrismaClient } from "@prisma/client";
import { hashPassword, validatePasswordStrength } from "../src/lib/password.ts";

const prisma = new PrismaClient();

function getArg(flag) {
  const match = process.argv.find((a) => a.startsWith(`${flag}=`));
  return match ? match.slice(flag.length + 1).trim() : null;
}

async function main() {
  const email = (
    getArg("--email") ||
    process.env.INITIAL_ADMIN_EMAIL ||
    ""
  ).toLowerCase().trim();

  const password = getArg("--password") || process.env.INITIAL_ADMIN_PASSWORD || "";
  const name = getArg("--name") || process.env.INITIAL_ADMIN_NAME || "Super Administrator";
  const phone = getArg("--phone") || process.env.INITIAL_ADMIN_PHONE || "03000000001";

  if (!email) {
    console.error("ERROR: Admin email is required. Provide --email=... or INITIAL_ADMIN_EMAIL env variable.");
    process.exit(1);
  }

  if (!password) {
    console.error("ERROR: Admin password is required. Provide --password=... or INITIAL_ADMIN_PASSWORD env variable.");
    process.exit(1);
  }

  // Enforce enterprise password policy (min 12 chars, upper/lower/numbers/symbols, breach check)
  const strength = validatePasswordStrength(password);
  if (!strength.valid) {
    console.error(`ERROR: Password rejected by enterprise policy:\n  ${strength.error}`);
    process.exit(1);
  }

  console.log(`[PROVISION] Hashing password with bcrypt cost 12...`);
  const passwordHash = await hashPassword(password);

  console.log(`[PROVISION] Connecting to database to provision Super Admin: ${email}...`);

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  let adminUser;
  if (existing) {
    adminUser = await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: "ADMIN",
        staffRole: "SUPER_ADMIN",
        permissions: "ALL",
        passwordHash,
        sessionVersion: { increment: 1 },
        tokenVersion: { increment: 1 },
      },
    });
    console.log(`[PROVISION] Updated existing account to Super Admin: ${email} (ID: ${adminUser.id})`);
  } else {
    adminUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: "ADMIN",
        staffRole: "SUPER_ADMIN",
        permissions: "ALL",
        passwordHash,
        sessionVersion: 1,
        tokenVersion: 1,
      },
    });
    console.log(`[PROVISION] Created new Super Admin account: ${email} (ID: ${adminUser.id})`);
  }

  // Audit log entry
  try {
    await prisma.auditLog.create({
      data: {
        action: "INITIAL_ADMIN_PROVISIONED",
        actorId: adminUser.id,
        actorEmail: email,
        resourceType: "USER",
        resourceId: adminUser.id,
        details: `Initial Super Admin provisioned via server-side CLI tool.`,
      },
    });
  } catch (err) {
    // Audit table may be optional in local test environments
  }

  console.log(`[PROVISION] Super Admin provisioning completed successfully.`);
}

main()
  .catch((e) => {
    console.error("FATAL PROVISIONING ERROR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
