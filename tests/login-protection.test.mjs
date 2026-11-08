import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getTrustedClientIp } from "../src/lib/clientIp.ts";
import {
  normalizeIdentifier,
  getPairKey,
  getIpKey,
  checkLoginStatus,
  recordFailedLogin,
  recordSuccessfulLogin,
  unblockLogin,
} from "../src/lib/loginThrottle.ts";
import { prisma } from "../src/lib/prisma.ts";

describe("Phase 3: Login Protection & Brute Force Defense Test Suite", () => {
  describe("Trusted Client IP Resolution & Spoofing Defense", () => {
    it("prioritizes cf-connecting-ip over spoofed x-forwarded-for", () => {
      const headers = new Headers({
        "cf-connecting-ip": "203.0.113.195",
        "x-forwarded-for": "198.51.100.1, 10.0.0.1",
        "x-real-ip": "198.51.100.1",
      });
      const ip = getTrustedClientIp(headers);
      assert.equal(ip, "203.0.113.195");
    });

    it("prioritizes x-vercel-forwarded-for if cf-connecting-ip is absent", () => {
      const headers = new Headers({
        "x-vercel-forwarded-for": "198.51.100.42, 10.0.0.2",
        "x-forwarded-for": "1.2.3.4",
      });
      const ip = getTrustedClientIp(headers);
      assert.equal(ip, "198.51.100.42");
    });

    it("falls back to x-real-ip if edge headers are absent", () => {
      const headers = new Headers({
        "x-real-ip": "198.51.100.88",
      });
      const ip = getTrustedClientIp(headers);
      assert.equal(ip, "198.51.100.88");
    });

    it("extracts first valid IP from standard x-forwarded-for chain if no trusted edge header exists", () => {
      const headers = new Headers({
        "x-forwarded-for": "203.0.113.50, 10.0.0.5",
      });
      const ip = getTrustedClientIp(headers);
      assert.equal(ip, "203.0.113.50");
    });

    it("falls back to 127.0.0.1 on invalid or absent headers", () => {
      assert.equal(getTrustedClientIp(null), "127.0.0.1");
      assert.equal(getTrustedClientIp(new Headers()), "127.0.0.1");
      const badHeaders = new Headers({ "x-forwarded-for": "not-an-ip" });
      assert.equal(getTrustedClientIp(badHeaders), "127.0.0.1");
    });
  });

  describe("Identifier Normalization & Key Generation", () => {
    it("trims and lowercases emails", () => {
      assert.equal(normalizeIdentifier("  Admin@PakistanTravel.Agency  "), "admin@pakistantravel.agency");
      assert.equal(normalizeIdentifier("+923221234567"), "+923221234567");
    });

    it("generates deterministic pair and IP keys", () => {
      const pair = getPairKey("203.0.113.10", "User@Example.COM");
      assert.equal(pair, "pair:203.0.113.10:user@example.com");

      const ipKey = getIpKey("203.0.113.10");
      assert.equal(ipKey, "ip:203.0.113.10");
    });
  });

  describe("3-Strike Lockout & Progressive Delay Logic", () => {
    const testIp = `192.0.2.${Math.floor(Math.random() * 200) + 10}`;
    const targetEmail = `victim-${Date.now()}@test.pk`;

    it("allows first login attempt with 0 delay", async () => {
      const status = await checkLoginStatus(targetEmail, testIp);
      assert.equal(status.allowed, true);
      assert.equal(status.delayMs, 0);
    });

    it("records first failed attempt without locking the account", async () => {
      const result = await recordFailedLogin(targetEmail, testIp, "VENDOR");
      assert.equal(result.locked, false);

      const status = await checkLoginStatus(targetEmail, testIp);
      assert.equal(status.allowed, true);
      assert.ok(status.delayMs >= 1000, `Expected progressive delay >= 1000ms, got ${status.delayMs}`);
    });

    it("records second failed attempt and increments progressive delay", async () => {
      const result = await recordFailedLogin(targetEmail, testIp, "VENDOR");
      assert.equal(result.locked, false);

      const status = await checkLoginStatus(targetEmail, testIp);
      assert.equal(status.allowed, true);
      assert.ok(status.delayMs >= 2000, `Expected progressive delay >= 2000ms, got ${status.delayMs}`);
    });

    it("triggers 30-minute block on the 3rd consecutive failed attempt", async () => {
      const result = await recordFailedLogin(targetEmail, testIp, "VENDOR");
      assert.equal(result.locked, true);
      assert.ok(result.reason.includes("30 minutes") || result.reason.includes("locked"));

      // Verification: subsequent check must be blocked
      const status = await checkLoginStatus(targetEmail, testIp);
      assert.equal(status.allowed, false);
      assert.equal(status.reason, "PAIR_BLOCKED");
      assert.ok(status.retryAfterSeconds > 0);
      assert.ok(status.message.includes("locked"));
    });

    it("ensures other users on the same IP are NOT blocked by pair lockout", async () => {
      const otherEmail = `innocent-${Date.now()}@test.pk`;
      const status = await checkLoginStatus(otherEmail, testIp);
      assert.equal(status.allowed, true, "Other users on the same IP must remain unaffected by single-account lockout");
    });

    it("allows admin to manually unblock locked account", async () => {
      const pairKey = getPairKey(testIp, targetEmail);
      const activeBlock = await prisma.blockedLogin.findFirst({
        where: { key: pairKey, unblockedAt: null },
      });

      assert.ok(activeBlock, "Active block record must exist in DB");

      const unblocked = await unblockLogin(activeBlock.id, "superadmin@pakistantravel.agency");
      assert.equal(unblocked, true);

      // Verify that after unblock, the account can log in again
      const status = await checkLoginStatus(targetEmail, testIp);
      assert.equal(status.allowed, true);
    });

    it("resets state on successful login", async () => {
      await recordSuccessfulLogin(targetEmail, testIp);
      const status = await checkLoginStatus(targetEmail, testIp);
      assert.equal(status.allowed, true);
      assert.equal(status.delayMs, 0);
    });
  });

  describe("Global IP Threshold Enforcement (30 fails/hr)", () => {
    it("locks the entire IP when 30 failures occur across accounts", async () => {
      const attackerIp = `198.51.100.${Math.floor(Math.random() * 200) + 10}`;

      // Insert 29 previous failed attempts in batch to test threshold cleanly
      const dummyBatch = [];
      for (let i = 1; i <= 29; i++) {
        dummyBatch.push({
          identifier: `bruteforce-${i}-${Date.now()}@attack.com`,
          ip: attackerIp,
          pairKey: `pair:${attackerIp}:bruteforce-${i}@attack.com`,
          success: false,
          attemptAt: new Date(),
        });
      }
      await prisma.loginAttempt.createMany({ data: dummyBatch });

      // 30th failure triggers global IP lockout threshold
      await recordFailedLogin(`victim-${Date.now()}@attack.com`, attackerIp, "CUSTOMER");

      // Any user attempting from attackerIp must now be globally blocked
      const randomUser = `anyone-${Date.now()}@anywhere.pk`;
      const status = await checkLoginStatus(randomUser, attackerIp);
      assert.equal(status.allowed, false);
      assert.equal(status.reason, "GLOBAL_IP_BLOCKED");
      assert.ok(status.retryAfterSeconds > 0);
    });
  });
});
