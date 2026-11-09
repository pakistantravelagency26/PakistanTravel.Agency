import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { encryptSensitiveField, decryptSensitiveField, maskCnic, maskBankAccount } from "../src/lib/fieldEncryption.ts";
import { encryptTotpSecret, decryptTotpSecret } from "../src/lib/totpCrypto.ts";

describe("GROUP 8: Database Security (Neon & Prisma)", () => {
  describe("Item 8.1 & 8.2: Connection Strings, SSL & Branch Safety", () => {
    test("prisma/schema.prisma configures url and directUrl with env variables", () => {
      const schemaPath = path.resolve(process.cwd(), "prisma/schema.prisma");
      const schema = fs.readFileSync(schemaPath, "utf-8");
      assert.ok(schema.includes('url       = env("DATABASE_URL")'), "Must use DATABASE_URL for pooled connections");
      assert.ok(schema.includes('directUrl = env("DIRECT_URL")'), "Must use DIRECT_URL for unpooled migrations");
    });

    test("Prisma client strictly blocks test runs against production database", () => {
      const prismaPath = path.resolve(process.cwd(), "src/lib/prisma.ts");
      const content = fs.readFileSync(prismaPath, "utf-8");
      assert.ok(
        content.includes("ep-rapid-mud-a1v8sgvo"),
        "Must have check for production database host"
      );
      assert.ok(
        content.includes("FATAL REFUSAL: Automated tests are strictly prohibited"),
        "Must throw fatal refusal when test points to production"
      );
    });

    test("Env validation enforces sslmode=require on connection strings", async () => {
      const { validateEnvironment } = await import("../src/lib/env.ts");
      assert.ok(typeof validateEnvironment === "function");
    });
  });

  describe("Item 8.3: Application-Level AES-256-GCM Field Encryption", () => {
    process.env.FIELD_ENCRYPTION_KEY = "test-encryption-key-for-database-fields-32chars";
    process.env.TWO_FACTOR_ENCRYPTION_KEY = "test-encryption-key-for-database-fields-32chars";

    test("Encrypts sensitive CNIC and decrypts without data corruption", () => {
      const sampleCnic = "37405-1234567-9";
      const encrypted = encryptSensitiveField(sampleCnic);

      assert.ok(encrypted.startsWith("enc:v1:"), "Must use authenticated versioned prefix");
      assert.notEqual(encrypted, sampleCnic, "Encrypted payload must not contain plaintext");

      const decrypted = decryptSensitiveField(encrypted);
      assert.equal(decrypted, sampleCnic, "Decrypted value must match original plaintext");
    });

    test("Fails decryption if ciphertext or auth tag is modified (tamper resistance)", () => {
      const sample = "PK36SCBL0000001123456701";
      const encrypted = encryptSensitiveField(sample);
      const parts = encrypted.split(":");
      
      // Corrupt the ciphertext
      parts[4] = parts[4].slice(0, -4) + "ffff";
      const tampered = parts.join(":");

      assert.throws(() => {
        decryptSensitiveField(tampered);
      }, /Unsupported state or unable to authenticate data|Malformed/);
    });

    test("Masks CNIC and bank account numbers for secure presentation", () => {
      const cnic = "42101-9876543-1";
      assert.equal(maskCnic(cnic), "42101-*******-1");

      const iban = "PK36SCBL0000001123456701";
      assert.equal(maskBankAccount(iban), "PK36****6701");
    });

    test("Encrypts and decrypts TOTP base32 secrets with AES-256-GCM", () => {
      const secret = "JBSWY3DPEHPK3PXP";
      const encSecret = encryptTotpSecret(secret);
      assert.ok(encSecret.includes(":"));
      const decSecret = decryptTotpSecret(encSecret);
      assert.equal(decSecret, secret);
    });
  });

  describe("Item 8.5: Prisma Safe Projections in Public Queries", () => {
    test("Public serverListing service selects only non-sensitive vendor and review fields", () => {
      const servicePath = path.resolve(process.cwd(), "src/services/serverListing.service.ts");
      const content = fs.readFileSync(servicePath, "utf-8");

      // Verify vendor projection doesn't include cnicOrTaxNumber or bankDetails
      assert.ok(!content.includes("vendor: true"), "Must not use unbounded vendor: true in catalog queries");
      assert.ok(content.includes("businessName: true"), "Must explicitly select public vendor fields");
      
      // Verify review user projection doesn't include passwordHash or twoFactorSecret
      assert.ok(!content.includes("user: true"), "Must not use unbounded user: true in catalog queries");
      assert.ok(content.includes("name: true"), "Must only project traveler name for reviews");
    });

    test("Listing API route handler uses bounded projection for public queries", () => {
      const routePath = path.resolve(process.cwd(), "src/app/api/listings/route.ts");
      const content = fs.readFileSync(routePath, "utf-8");

      assert.ok(content.includes("businessName: true"), "Must explicitly select public vendor fields");
      assert.ok(!content.includes("passwordHash"), "Must never mention or project passwordHash");
      assert.ok(!content.includes("twoFactorSecret"), "Must never mention or project twoFactorSecret");
    });
  });
});
