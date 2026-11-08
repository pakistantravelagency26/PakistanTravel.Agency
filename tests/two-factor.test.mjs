import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  base32Encode,
  base32Decode,
  generateTotpSecret,
  getOtpAuthUrl,
  generateTotpCode,
  verifyTotpCode,
  generateRecoveryCodes,
  verifyRecoveryCode,
} from "../src/lib/totp.ts";
import { encryptTotpSecret, decryptTotpSecret } from "../src/lib/totpCrypto.ts";
import { prisma } from "../src/lib/prisma.ts";
import { hashPassword, verifyPassword } from "../src/lib/password.ts";

describe("Phase 5: Mandatory 2FA & TOTP Security Test Suite", () => {
  describe("Base32 RFC 4648 Encoding & Decoding", () => {
    it("encodes and decodes buffers symmetrically", () => {
      const original = Buffer.from("PakistanTravel2026-Secret");
      const encoded = base32Encode(original);
      const decoded = base32Decode(encoded);
      assert.equal(decoded.toString(), original.toString());
    });

    it("handles standard Base32 test vectors", () => {
      assert.equal(base32Encode(Buffer.from("foo")), "MZXW6");
      assert.equal(base32Encode(Buffer.from("foobar")), "MZXW6YTBOI");
    });
  });

  describe("RFC 6238 TOTP Code Generation & Verification", () => {
    const secret = generateTotpSecret();

    it("generates a valid 20-byte base32 secret", () => {
      assert.ok(secret.length >= 32);
      const decoded = base32Decode(secret);
      assert.equal(decoded.length, 20);
    });

    it("generates standardized otpauth URL for Google Authenticator", () => {
      const url = getOtpAuthUrl("admin@pakistantravel.agency", secret);
      assert.ok(url.startsWith("otpauth://totp/PakistanTravel.Agency:admin@pakistantravel.agency"));
      assert.ok(url.includes(`secret=${secret}`));
      assert.ok(url.includes("digits=6"));
    });

    it("generates 6-digit dynamic codes", () => {
      const code = generateTotpCode(secret);
      assert.match(code, /^\d{6}$/);
    });

    it("verifies current code successfully", () => {
      const code = generateTotpCode(secret);
      assert.equal(verifyTotpCode(code, secret, 1), true);
    });

    it("accepts codes within 1 time step drift window (offset +/- 1)", () => {
      const previousCode = generateTotpCode(secret, -1);
      const nextCode = generateTotpCode(secret, 1);
      assert.equal(verifyTotpCode(previousCode, secret, 1), true);
      assert.equal(verifyTotpCode(nextCode, secret, 1), true);
    });

    it("rejects codes outside time step drift window (offset +/- 3)", () => {
      const tooOldCode = generateTotpCode(secret, -3);
      assert.equal(verifyTotpCode(tooOldCode, secret, 1), false);
    });

    it("rejects invalid or malformed codes", () => {
      assert.equal(verifyTotpCode("12345", secret), false);
      assert.equal(verifyTotpCode("abcdef", secret), false);
      assert.equal(verifyTotpCode("", secret), false);
    });
  });

  describe("AES-256-GCM Secret Encryption & Decryption", () => {
    it("encrypts and decrypts TOTP secret without data corruption", () => {
      const rawSecret = "JBSWY3DPEHPK3PXP";
      const encrypted = encryptTotpSecret(rawSecret);
      assert.ok(encrypted.includes(":"));
      const parts = encrypted.split(":");
      assert.equal(parts.length, 3, "Encrypted payload must contain iv, tag, and ciphertext");

      const decrypted = decryptTotpSecret(encrypted);
      assert.equal(decrypted, rawSecret);
    });

    it("fails decryption if ciphertext or auth tag is tampered with", () => {
      const rawSecret = "JBSWY3DPEHPK3PXP";
      const encrypted = encryptTotpSecret(rawSecret);
      const [iv, tag, cipher] = encrypted.split(":");
      const tamperedTag = (tag.startsWith("0") ? "1" : "0") + tag.slice(1);
      assert.throws(() => decryptTotpSecret(`${iv}:${tamperedTag}:${cipher}`));
    });
  });

  describe("Emergency Recovery Codes", () => {
    it("generates exactly 10 single-use recovery codes in XXXX-XXXX format", () => {
      const { plaintext, hashed } = generateRecoveryCodes(10);
      assert.equal(plaintext.length, 10);
      assert.equal(hashed.length, 10);
      for (const code of plaintext) {
        assert.match(code, /^[0-9A-F]{4}-[0-9A-F]{4}$/);
      }
    });

    it("verifies a valid recovery code and burns it from remaining list", () => {
      const { plaintext, hashed } = generateRecoveryCodes(10);
      const usedCode = plaintext[2];

      const check = verifyRecoveryCode(usedCode, hashed);
      assert.equal(check.valid, true);
      assert.equal(check.remainingHashedCodes.length, 9, "Consumed recovery code must be removed");

      // Verify that the consumed code cannot be used again
      const secondCheck = verifyRecoveryCode(usedCode, check.remainingHashedCodes);
      assert.equal(secondCheck.valid, false, "Burned code must not be reusable");
    });
  });

  describe("End-to-End 2FA Database & Verification Flow", () => {
    const testEmail = `admin-2fa-${Date.now()}@test.pk`;
    const testPassword = "AdminSecure#2026!";
    const testSecret = generateTotpSecret();
    const encryptedSecret = encryptTotpSecret(testSecret);
    const { plaintext: recoveryPlain, hashed: recoveryHashed } = generateRecoveryCodes(10);
    let createdUserId = "";

    it("creates an Admin account with 2FA enabled", async () => {
      const pHash = await hashPassword(testPassword);
      const user = await prisma.user.create({
        data: {
          email: testEmail,
          name: "2FA Admin User",
          role: "ADMIN",
          passwordHash: pHash,
          twoFactorEnabled: true,
          twoFactorSecret: encryptedSecret,
          twoFactorRecoveryCodes: JSON.stringify(recoveryHashed),
        },
      });
      createdUserId = user.id;
      assert.ok(createdUserId);
      assert.equal(user.twoFactorEnabled, true);
    });

    it("decrypts stored TOTP secret and validates live dynamic code", async () => {
      const user = await prisma.user.findUnique({
        where: { id: createdUserId },
      });
      assert.ok(user?.twoFactorSecret);

      const decrypted = decryptTotpSecret(user.twoFactorSecret);
      assert.equal(decrypted, testSecret);

      const dynamicCode = generateTotpCode(decrypted);
      const isValid = verifyTotpCode(dynamicCode, decrypted, 1);
      assert.equal(isValid, true);
    });

    it("consumes emergency recovery code and burns it in database", async () => {
      const user = await prisma.user.findUnique({
        where: { id: createdUserId },
      });
      assert.ok(user?.twoFactorRecoveryCodes);

      const storedHashedCodes = JSON.parse(user.twoFactorRecoveryCodes);
      const codeToUse = recoveryPlain[0];

      const verification = verifyRecoveryCode(codeToUse, storedHashedCodes);
      assert.equal(verification.valid, true);
      assert.equal(verification.remainingHashedCodes.length, 9);

      // Update in DB
      await prisma.user.update({
        where: { id: createdUserId },
        data: {
          twoFactorRecoveryCodes: JSON.stringify(verification.remainingHashedCodes),
        },
      });

      // Verify that code is burned and no longer valid
      const updatedUser = await prisma.user.findUnique({
        where: { id: createdUserId },
      });
      const remainingCodes = JSON.parse(updatedUser.twoFactorRecoveryCodes);
      assert.equal(remainingCodes.length, 9);
      const reattempt = verifyRecoveryCode(codeToUse, remainingCodes);
      assert.equal(reattempt.valid, false);
    });
  });
});
