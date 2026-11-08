import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validatePasswordStrength } from "../src/lib/passwordPolicy.ts";
import {
  hashCode,
  constantTimeCompare,
  requestPasswordReset,
  verifyResetCode,
  completePasswordReset,
} from "../src/services/passwordReset.service.ts";
import { prisma } from "../src/lib/prisma.ts";
import { hashPassword, verifyPassword } from "../src/lib/password.ts";

describe("Phase 4: Secure Password Reset Test Suite", () => {
  describe("Password Policy & Complexity Validation", () => {
    it("accepts a strong, compliant password", () => {
      const res = validatePasswordStrength("K2-Climber#2026!");
      assert.equal(res.valid, true);
      assert.equal(res.errors.length, 0);
    });

    it("rejects passwords shorter than 8 characters", () => {
      const res = validatePasswordStrength("Short1!");
      assert.equal(res.valid, false);
      assert.ok(res.errors.some((e) => e.includes("at least 8 characters")));
    });

    it("rejects passwords without uppercase letters", () => {
      const res = validatePasswordStrength("all-lowercase-123#");
      assert.equal(res.valid, false);
      assert.ok(res.errors.some((e) => e.includes("uppercase")));
    });

    it("rejects passwords without numbers", () => {
      const res = validatePasswordStrength("NoNumbersHere!#");
      assert.equal(res.valid, false);
      assert.ok(res.errors.some((e) => e.includes("numeric digit")));
    });

    it("rejects passwords without special symbols", () => {
      const res = validatePasswordStrength("NoSymbolsHere123");
      assert.equal(res.valid, false);
      assert.ok(res.errors.some((e) => e.includes("special character")));
    });

    it("rejects easily guessable and common compromised passwords", () => {
      const res1 = validatePasswordStrength("password123");
      assert.equal(res1.valid, false);

      const res2 = validatePasswordStrength("pakistan123");
      assert.equal(res2.valid, false);

      const res3 = validatePasswordStrength("admin123");
      assert.equal(res3.valid, false);
    });
  });

  describe("Cryptographic Code Generation & Hashing", () => {
    it("generates deterministic SHA-256 hashes", () => {
      const h1 = hashCode("123456");
      const h2 = hashCode("123456");
      const h3 = hashCode("654321");
      assert.equal(h1, h2);
      assert.notEqual(h1, h3);
      assert.equal(h1.length, 64);
    });

    it("verifies constant-time comparison correctly", () => {
      const a = hashCode("987654");
      const b = hashCode("987654");
      const c = hashCode("000000");
      assert.equal(constantTimeCompare(a, b), true);
      assert.equal(constantTimeCompare(a, c), false);
    });
  });

  describe("End-to-End Password Reset Flow", () => {
    const testEmail = `reset-user-${Date.now()}@test.pk`;
    const testIp = "203.0.113.88";
    let testUserId = "";

    it("creates test user in database", async () => {
      const initialHash = await hashPassword("OldPassword#2025!");
      const user = await prisma.user.create({
        data: {
          email: testEmail,
          name: "Reset Test Traveler",
          role: "CUSTOMER",
          passwordHash: initialHash,
          tokenVersion: 1,
        },
      });
      testUserId = user.id;
      assert.ok(testUserId);
      assert.equal(user.tokenVersion, 1);
    });

    it("returns generic success even for non-existent emails to prevent enumeration", async () => {
      const nonExistent = `ghost-${Date.now()}@pta.pk`;
      const res = await requestPasswordReset(nonExistent, testIp);
      assert.equal(res.success, true);
      assert.ok(res.message.includes("If an account exists"));
    });

    it("generates a 6-digit code expiring in 10 minutes for valid user", async () => {
      const res = await requestPasswordReset(testEmail, testIp);
      assert.equal(res.success, true);
      assert.ok(res.debugCode, "Debug code should be provided in non-production");
      assert.match(res.debugCode, /^\d{6}$/);

      const tokenInDb = await prisma.passwordResetToken.findFirst({
        where: { email: testEmail, usedAt: null, invalidated: false },
        orderBy: { createdAt: "desc" },
      });

      assert.ok(tokenInDb);
      assert.equal(tokenInDb.attemptsLeft, 5);
      const diffMs = tokenInDb.expiresAt.getTime() - Date.now();
      assert.ok(diffMs > 9 * 60 * 1000 && diffMs <= 10 * 60 * 1000, "Expiry must be 10 minutes");
    });

    it("decrements attemptsLeft on incorrect code submission", async () => {
      const checkWrong = await verifyResetCode(testEmail, "000000", testIp);
      assert.equal(checkWrong.valid, false);
      assert.ok(checkWrong.error.includes("attempt"));

      const token = await prisma.passwordResetToken.findFirst({
        where: { email: testEmail, usedAt: null },
        orderBy: { createdAt: "desc" },
      });
      assert.equal(token.attemptsLeft, 4);
    });

    it("invalidates the code after 5 failed attempts", async () => {
      // 3 more failed attempts (4 -> 3 -> 2 -> 1)
      await verifyResetCode(testEmail, "111111", testIp);
      await verifyResetCode(testEmail, "222222", testIp);
      await verifyResetCode(testEmail, "333333", testIp);
      // 5th failed attempt triggers invalidation
      const fifthAttempt = await verifyResetCode(testEmail, "444444", testIp);
      assert.equal(fifthAttempt.valid, false);
      assert.ok(fifthAttempt.error.includes("invalidated"));

      const token = await prisma.passwordResetToken.findFirst({
        where: { email: testEmail },
        orderBy: { createdAt: "desc" },
      });
      assert.equal(token.invalidated, true);
      assert.equal(token.attemptsLeft, 0);
    });

    it("completes password reset with new valid code and invalidates sessions", async () => {
      // Request fresh code
      const freshReq = await requestPasswordReset(testEmail, testIp);
      const validCode = freshReq.debugCode;
      const newPassword = "BrandNew#SecurePass2026!";

      const resetRes = await completePasswordReset(testEmail, validCode, newPassword, testIp);
      assert.equal(resetRes.success, true);
      assert.ok(resetRes.message.includes("successfully reset"));

      // Verify user's passwordHash was updated in database
      const updatedUser = await prisma.user.findUnique({
        where: { id: testUserId },
      });
      assert.equal(updatedUser.tokenVersion, 2, "tokenVersion must increment to invalidate prior sessions");
      const passwordMatches = await verifyPassword(newPassword, updatedUser.passwordHash);
      assert.equal(passwordMatches, true);

      // Verify code was marked used and invalidated
      const consumedToken = await prisma.passwordResetToken.findFirst({
        where: { email: testEmail, usedAt: { not: null } },
        orderBy: { createdAt: "desc" },
      });
      assert.ok(consumedToken);
      assert.equal(consumedToken.invalidated, true);

      // Verify token cannot be reused (single-use guarantee)
      const reuseAttempt = await completePasswordReset(testEmail, validCode, "AnotherPass#2026!", testIp);
      assert.equal(reuseAttempt.success, false);
      assert.ok(reuseAttempt.error.includes("invalid") || reuseAttempt.error.includes("expired"));
    });
  });
});
