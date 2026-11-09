/**
 * PakistanTravel.Agency - Login Protection & Brute Force Throttling Engine
 * 
 * Enforces:
 * - 3 consecutive wrong passwords for (IP + email) pair -> 30-minute block.
 * - Progressive backoff delay (1s, 2s, 3s... up to 60s) before returning failure.
 * - Global IP ceiling: 30 failures/hr across all accounts -> 30-minute block for the entire IP.
 * - Audit logging of all lockouts and manual unblocks.
 * - In-memory fallback if database has a momentary blip.
 */

import { prisma } from "./prisma.ts";
import { LOGIN_SECURITY_CONFIG, ADMIN_NOTIFICATION_EMAILS } from "../config/site.ts";

// Fast in-memory backup cache to ensure zero-latency defense even during cold starts/DB transitions
interface MemLock {
  expiresAt: number;
  reason: string;
}
const memoryLocks = new Map<string, MemLock>();

export function clearMemoryLocks(key?: string): void {
  if (key) {
    memoryLocks.delete(key);
  } else {
    memoryLocks.clear();
  }
}

export interface LoginStatusCheck {
  allowed: boolean;
  reason?: "GLOBAL_IP_BLOCKED" | "PAIR_BLOCKED";
  message?: string;
  retryAfterSeconds?: number;
  delayMs?: number;
  failCount?: number;
}

/**
 * Normalizes login identifiers (emails or phones) to lowercase trimmed format
 */
export function normalizeIdentifier(identifier: string): string {
  return identifier.toLowerCase().trim();
}

/**
 * Generates the unique pair key for an IP and identifier
 */
export function getPairKey(ip: string, identifier: string): string {
  return `pair:${ip.trim()}:${normalizeIdentifier(identifier)}`;
}

/**
 * Generates the unique key for a global IP block
 */
export function getIpKey(ip: string): string {
  return `ip:${ip.trim()}`;
}

/**
 * Check if the given IP or (IP + identifier) pair is currently locked out.
 */
export async function checkLoginStatus(identifier: string, ip: string): Promise<LoginStatusCheck> {
  const normId = normalizeIdentifier(identifier);
  const cleanIp = ip.trim();
  const pairKey = getPairKey(cleanIp, normId);
  const ipKey = getIpKey(cleanIp);
  const now = new Date();
  const nowMs = now.getTime();

  // 1. Fast in-memory check
  const memIpLock = memoryLocks.get(ipKey);
  if (memIpLock && memIpLock.expiresAt > nowMs) {
    const retryAfter = Math.ceil((memIpLock.expiresAt - nowMs) / 1000);
    return {
      allowed: false,
      reason: "GLOBAL_IP_BLOCKED",
      retryAfterSeconds: retryAfter,
      message: `Access from your IP address is temporarily locked due to excessive failed attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
    };
  }

  const memPairLock = memoryLocks.get(pairKey);
  if (memPairLock && memPairLock.expiresAt > nowMs) {
    const retryAfter = Math.ceil((memPairLock.expiresAt - nowMs) / 1000);
    return {
      allowed: false,
      reason: "PAIR_BLOCKED",
      retryAfterSeconds: retryAfter,
      message: `Account is temporarily locked for security after 3 failed login attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
    };
  }

  // 2. Persistent Database check
  try {
    // Check global IP lockout
    const activeIpBlock = await prisma.blockedLogin.findFirst({
      where: {
        key: ipKey,
        unblockedAt: null,
        expiresAt: { gt: now },
      },
    });

    if (activeIpBlock) {
      const retryAfter = Math.ceil((activeIpBlock.expiresAt.getTime() - nowMs) / 1000);
      memoryLocks.set(ipKey, { expiresAt: activeIpBlock.expiresAt.getTime(), reason: activeIpBlock.reason });
      return {
        allowed: false,
        reason: "GLOBAL_IP_BLOCKED",
        retryAfterSeconds: retryAfter,
        message: `Access from your IP address is temporarily locked due to excessive failed attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
      };
    }

    // Check Pair lockout
    const activePairBlock = await prisma.blockedLogin.findFirst({
      where: {
        key: pairKey,
        unblockedAt: null,
        expiresAt: { gt: now },
      },
    });

    if (activePairBlock) {
      const retryAfter = Math.ceil((activePairBlock.expiresAt.getTime() - nowMs) / 1000);
      memoryLocks.set(pairKey, { expiresAt: activePairBlock.expiresAt.getTime(), reason: activePairBlock.reason });
      return {
        allowed: false,
        reason: "PAIR_BLOCKED",
        retryAfterSeconds: retryAfter,
        message: `Account is temporarily locked for security after 3 failed login attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
      };
    }

    // 3. Compute progressive delay based on recent consecutive failures within 30 min
    const thirtyMinAgo = new Date(nowMs - 30 * 60 * 1000);
    const recentAttempts = await prisma.loginAttempt.findMany({
      where: {
        pairKey,
        attemptAt: { gte: thirtyMinAgo },
      },
      orderBy: { attemptAt: "desc" },
      take: 5,
    });

    // Count consecutive failures from most recent attempt
    let consecutiveFails = 0;
    for (const att of recentAttempts) {
      if (!att.success) {
        consecutiveFails++;
      } else {
        break; // stop at last success
      }
    }

    const delayMs = Math.min(
      consecutiveFails * LOGIN_SECURITY_CONFIG.progressiveDelayStepMs,
      LOGIN_SECURITY_CONFIG.maxProgressiveDelayMs
    );

    return {
      allowed: true,
      delayMs,
      failCount: consecutiveFails,
    };
  } catch (err) {
    console.warn("DB checkLoginStatus error, falling back to memory:", err);
    return { allowed: true, delayMs: 0, failCount: 0 };
  }
}

/**
 * Record a failed login attempt and apply lockouts if thresholds are reached.
 */
export async function recordFailedLogin(identifier: string, ip: string, role?: string): Promise<{ locked: boolean; reason?: string }> {
  const normId = normalizeIdentifier(identifier);
  const cleanIp = ip.trim();
  const pairKey = getPairKey(cleanIp, normId);
  const ipKey = getIpKey(cleanIp);
  const now = new Date();
  const nowMs = now.getTime();

  try {
    // 1. Record failure in database
    await prisma.loginAttempt.create({
      data: {
        identifier: normId,
        ip: cleanIp,
        pairKey,
        success: false,
      },
    });

    // 2. Check pair failures in the last 30 minutes
    const thirtyMinAgo = new Date(nowMs - 30 * 60 * 1000);
    const pairFails = await prisma.loginAttempt.count({
      where: {
        pairKey,
        success: false,
        attemptAt: { gte: thirtyMinAgo },
      },
    });

    let locked = false;
    let lockReason = "";

    if (pairFails >= LOGIN_SECURITY_CONFIG.maxFailedAttemptsPerPair) {
      const expiresAt = new Date(nowMs + LOGIN_SECURITY_CONFIG.pairLockoutDurationMinutes * 60 * 1000);
      lockReason = `Account locked for 30 minutes after ${pairFails} failed attempts`;

      await prisma.blockedLogin.upsert({
        where: { key: pairKey },
        create: {
          key: pairKey,
          type: "PAIR",
          target: normId,
          ip: cleanIp,
          reason: lockReason,
          expiresAt,
          unblockedAt: null,
        },
        update: {
          expiresAt,
          unblockedAt: null,
          reason: lockReason,
        },
      });

      // Update in-memory cache
      memoryLocks.set(pairKey, { expiresAt: expiresAt.getTime(), reason: lockReason });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          action: "ACCOUNT_LOCKED_3_FAILS",
          actorEmail: normId,
          ip: cleanIp,
          resourceType: "LOGIN_BLOCK",
          resourceId: pairKey,
          details: `Role: ${role || "UNKNOWN"}. Failed attempts count: ${pairFails}. Block duration: 30 minutes.`,
        },
      });

      // Security Alert: Email admin when an admin account has 3 failed logins
      if (role === "ADMIN" || normId.includes("admin")) {
        for (const adminEmail of ADMIN_NOTIFICATION_EMAILS) {
          try {
            await prisma.emailOutbox.create({
              data: {
                to: adminEmail,
                recipientRole: "ADMIN",
                subject: `[SECURITY ALERT] Admin Account Login Blocked: ${normId}`,
                textBody: `Security Alert: Admin account "${normId}" has experienced 3 consecutive failed login attempts from IP ${cleanIp}. The account has been locked for 30 minutes.\n\nReview or unblock in Admin Security: https://www.pakistantravel.agency/secure-admin/security`,
                htmlBody: `<div style="font-family:sans-serif;padding:20px;border:1px solid #ef4444;border-radius:8px;"><h3 style="color:#b91c1c;">Security Alert: Admin Account Locked</h3><p>Admin account <strong>${normId}</strong> has been locked after 3 consecutive failed login attempts.</p><p><strong>Client IP:</strong> ${cleanIp}</p><p><strong>Lock Duration:</strong> 30 minutes</p><p><a href="https://www.pakistantravel.agency/secure-admin/security" style="color:#0284c7;font-weight:bold;">Review Block in Admin Portal</a></p></div>`,
                eventType: "SECURITY_ALERT",
                status: "PENDING",
              },
            });
          } catch {
            // non-fatal email queue error
          }
        }
      }

      locked = true;
    }

    // 3. Check global IP failures across all accounts in the last 1 hour
    const oneHourAgo = new Date(nowMs - 60 * 60 * 1000);
    const globalIpFails = await prisma.loginAttempt.count({
      where: {
        ip: cleanIp,
        success: false,
        attemptAt: { gte: oneHourAgo },
      },
    });

    if (globalIpFails >= LOGIN_SECURITY_CONFIG.globalIpMaxFailuresPerHour) {
      const ipExpiresAt = new Date(nowMs + LOGIN_SECURITY_CONFIG.globalIpLockoutDurationMinutes * 60 * 1000);
      const ipLockReason = `Global IP locked for 30 minutes after ${globalIpFails} failed attempts in 1 hour`;

      await prisma.blockedLogin.upsert({
        where: { key: ipKey },
        create: {
          key: ipKey,
          type: "GLOBAL_IP",
          target: cleanIp,
          ip: cleanIp,
          reason: ipLockReason,
          expiresAt: ipExpiresAt,
          unblockedAt: null,
        },
        update: {
          expiresAt: ipExpiresAt,
          unblockedAt: null,
          reason: ipLockReason,
        },
      });

      memoryLocks.set(ipKey, { expiresAt: ipExpiresAt.getTime(), reason: ipLockReason });

      await prisma.auditLog.create({
        data: {
          action: "IP_BLOCKED_EXCESSIVE_FAILURES",
          actorEmail: null,
          ip: cleanIp,
          resourceType: "IP",
          resourceId: cleanIp,
          details: `Global IP threshold triggered. ${globalIpFails} failed attempts across accounts.`,
        },
      });

      // Security Alert: Email admin when an IP is blocked more than twice in an hour
      const recentIpBlocks = await prisma.blockedLogin.count({
        where: {
          ip: cleanIp,
          blockedAt: { gte: oneHourAgo },
        },
      });

      if (recentIpBlocks >= 2) {
        for (const adminEmail of ADMIN_NOTIFICATION_EMAILS) {
          try {
            await prisma.emailOutbox.create({
              data: {
                to: adminEmail,
                recipientRole: "ADMIN",
                subject: `[SECURITY ALERT] IP Address Repeatedly Blocked: ${cleanIp}`,
                textBody: `Security Alert: IP address ${cleanIp} has triggered lockouts ${recentIpBlocks} times in the last hour due to excessive failed attempts.\n\nManage blocked IPs: https://www.pakistantravel.agency/secure-admin/security`,
                htmlBody: `<div style="font-family:sans-serif;padding:20px;border:1px solid #ef4444;border-radius:8px;"><h3 style="color:#b91c1c;">Security Alert: Repeated IP Lockout</h3><p>IP address <strong>${cleanIp}</strong> has triggered lockout ${recentIpBlocks} times in the last hour.</p><p><a href="https://www.pakistantravel.agency/secure-admin/security" style="color:#0284c7;font-weight:bold;">Review in Admin Security Portal</a></p></div>`,
                eventType: "SECURITY_ALERT",
                status: "PENDING",
              },
            });
          } catch {
            // non-fatal
          }
        }
      }

      locked = true;
      lockReason = ipLockReason;
    }

    return { locked, reason: lockReason };
  } catch (err) {
    console.error("Error in recordFailedLogin:", err);
    return { locked: false };
  }
}

/**
 * Record a successful login attempt and reset pair lock state.
 */
export async function recordSuccessfulLogin(identifier: string, ip: string): Promise<void> {
  const normId = normalizeIdentifier(identifier);
  const cleanIp = ip.trim();
  const pairKey = getPairKey(cleanIp, normId);
  const ipKey = getIpKey(cleanIp);

  // Clear in-memory pair and IP locks
  memoryLocks.delete(pairKey);
  memoryLocks.delete(ipKey);

  try {
    await prisma.loginAttempt.create({
      data: {
        identifier: normId,
        ip: cleanIp,
        pairKey,
        success: true,
      },
    });

    // Auto-unblock any lingering DB locks on successful authentication
    await prisma.blockedLogin.updateMany({
      where: {
        OR: [
          { key: pairKey },
          { target: normId },
          { ip: cleanIp },
        ],
        unblockedAt: null,
      },
      data: {
        unblockedAt: new Date(),
        unblockedBy: "SYSTEM_AUTH_SUCCESS",
      },
    });
  } catch (err) {
    console.warn("Error in recordSuccessfulLogin:", err);
  }
}

/**
 * Admin manual unblock action.
 */
export async function unblockLogin(blockId: string, adminEmail: string): Promise<boolean> {
  try {
    const block = await prisma.blockedLogin.update({
      where: { id: blockId },
      data: {
        unblockedAt: new Date(),
        unblockedBy: adminEmail,
      },
    });

    if (block) {
      memoryLocks.delete(block.key);

      await prisma.auditLog.create({
        data: {
          action: "MANUAL_LOGIN_UNBLOCK",
          actorEmail: adminEmail,
          resourceType: "LOGIN_BLOCK",
          resourceId: blockId,
          details: `Manually unlocked by Admin ${adminEmail}. Target: ${block.target}, Type: ${block.type}`,
        },
      });
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error unblocking login:", err);
    return false;
  }
}
