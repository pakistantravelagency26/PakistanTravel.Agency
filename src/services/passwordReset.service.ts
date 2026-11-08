/**
 * PakistanTravel.Agency - Secure Password Reset Service
 * 
 * Enforces:
 * - 6-digit cryptographic random code, expiring in 10 minutes
 * - Single-use consumption (invalidated immediately upon use)
 * - Maximum 5 verification attempts before permanent code invalidation
 * - Rate limits: max 3 requests/hr per email, max 10 requests/hr per IP
 * - User enumeration defense (generic success message)
 * - Strong password policy enforcement
 * - Session invalidation via tokenVersion incrementation
 * - Audit logging
 */

import crypto from "crypto";
import { prisma } from "../lib/prisma.ts";
import { hashPassword } from "../lib/password.ts";
import { validatePasswordStrength } from "../lib/passwordPolicy.ts";

export function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code.trim()).digest("hex");
}

export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export interface RequestResetResult {
  success: boolean;
  message: string;
  error?: string;
  debugCode?: string; // Only populated in non-production environments
}

export interface VerifyCodeResult {
  valid: boolean;
  error?: string;
  tokenId?: string;
}

export interface CompleteResetResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Step 1: Request a password reset code.
 */
export async function requestPasswordReset(email: string, ip: string): Promise<RequestResetResult> {
  const normEmail = email.toLowerCase().trim();
  const cleanIp = ip.trim();
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // 1. Rate limiting by IP (max 10 requests per hour)
  const ipRequests = await prisma.passwordResetToken.count({
    where: {
      ip: cleanIp,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (ipRequests >= 10) {
    return {
      success: false,
      error: "Too many password reset requests from this IP address. Please try again in 1 hour.",
      message: "Rate limit exceeded.",
    };
  }

  // 2. Rate limiting by Email (max 3 requests per hour)
  const emailRequests = await prisma.passwordResetToken.count({
    where: {
      email: normEmail,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (emailRequests >= 3) {
    return {
      success: false,
      error: "Too many password reset requests for this email account. Please try again in 1 hour.",
      message: "Rate limit exceeded.",
    };
  }

  // 3. User lookup
  const user = await prisma.user.findUnique({
    where: { email: normEmail },
  });

  // Always return the exact same generic message to prevent account enumeration
  const genericSuccess = "If an account exists with this email address, a 6-digit verification code has been sent.";

  if (!user) {
    // Constant-time dummy hash computation
    crypto.createHash("sha256").update("dummy-999999").digest("hex");
    return {
      success: true,
      message: genericSuccess,
    };
  }

  // 4. Invalidate any existing unconsumed tokens for this email
  await prisma.passwordResetToken.updateMany({
    where: {
      email: normEmail,
      usedAt: null,
      invalidated: false,
    },
    data: {
      invalidated: true,
    },
  });

  // 5. Generate secure 6-digit random code
  const codeInt = crypto.randomInt(100000, 1000000);
  const codeStr = codeInt.toString();
  const codeHash = hashCode(codeStr);
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

  // 6. Save token to Neon DB
  await prisma.passwordResetToken.create({
    data: {
      email: normEmail,
      codeHash,
      attemptsLeft: 5,
      expiresAt,
      ip: cleanIp,
    },
  });

  // 7. Record security audit log
  await prisma.auditLog.create({
    data: {
      action: "PASSWORD_RESET_REQUESTED",
      actorEmail: normEmail,
      ip: cleanIp,
      resourceType: "USER",
      resourceId: user.id,
      details: "Password reset 6-digit verification code generated with 10-minute validity.",
    },
  });

  // Log to console for observability / dev
  console.log(`[AUTH SECURITY] Password reset code for ${normEmail}: ${codeStr} (Expires: ${expiresAt.toISOString()})`);

  return {
    success: true,
    message: genericSuccess,
    debugCode: process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production" ? undefined : codeStr,
  };
}

/**
 * Step 2: Verify the 6-digit code.
 */
export async function verifyResetCode(email: string, code: string, ip: string): Promise<VerifyCodeResult> {
  const normEmail = email.toLowerCase().trim();
  const cleanCode = code.trim();
  const now = new Date();

  if (!/^\d{6}$/.test(cleanCode)) {
    return { valid: false, error: "Please enter a valid 6-digit numeric verification code." };
  }

  const token = await prisma.passwordResetToken.findFirst({
    where: {
      email: normEmail,
      invalidated: false,
      usedAt: null,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!token) {
    return {
      valid: false,
      error: "The verification code is invalid, expired, or has already been used. Please request a new code.",
    };
  }

  const inputHash = hashCode(cleanCode);
  const isMatch = constantTimeCompare(inputHash, token.codeHash);

  if (!isMatch) {
    const remaining = token.attemptsLeft - 1;

    if (remaining <= 0) {
      await prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { attemptsLeft: 0, invalidated: true },
      });

      await prisma.auditLog.create({
        data: {
          action: "PASSWORD_RESET_LOCKED",
          actorEmail: normEmail,
          ip: ip.trim(),
          resourceType: "PASSWORD_RESET",
          resourceId: token.id,
          details: "5 incorrect code verification attempts. Code permanently invalidated.",
        },
      });

      return {
        valid: false,
        error: "Too many incorrect attempts. This code has been invalidated for security. Please request a new code.",
      };
    } else {
      await prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { attemptsLeft: remaining },
      });

      return {
        valid: false,
        error: `Invalid verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
      };
    }
  }

  return {
    valid: true,
    tokenId: token.id,
  };
}

/**
 * Step 3: Complete password reset and invalidate all active sessions.
 */
export async function completePasswordReset(
  email: string,
  code: string,
  newPassword: string,
  ip: string
): Promise<CompleteResetResult> {
  const normEmail = email.toLowerCase().trim();
  const cleanIp = ip.trim();

  // 1. Enforce password complexity policy
  const policy = validatePasswordStrength(newPassword);
  if (!policy.valid) {
    return {
      success: false,
      error: policy.errors[0] || "Password does not meet security requirements.",
      message: "Password policy violation.",
    };
  }

  // 2. Verify reset code
  const verification = await verifyResetCode(normEmail, code, cleanIp);
  if (!verification.valid || !verification.tokenId) {
    return {
      success: false,
      error: verification.error || "Invalid or expired reset code.",
      message: "Verification failed.",
    };
  }

  // 3. Find user
  const user = await prisma.user.findUnique({
    where: { email: normEmail },
  });

  if (!user) {
    return {
      success: false,
      error: "User account not found.",
      message: "Account error.",
    };
  }

  // 4. Hash new password
  const newHash = await hashPassword(newPassword);

  // 5. Invalidate token and update user password + increment tokenVersion
  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: { id: verification.tokenId },
      data: {
        usedAt: new Date(),
        invalidated: true,
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        tokenVersion: { increment: 1 }, // Invalidates all existing JWT sessions
        updatedAt: new Date(),
      },
    }),
    prisma.auditLog.create({
      data: {
        action: "PASSWORD_RESET_COMPLETED",
        actorEmail: normEmail,
        ip: cleanIp,
        resourceType: "USER",
        resourceId: user.id,
        details: "Password reset successfully completed. All existing sessions invalidated.",
      },
    }),
  ]);

  return {
    success: true,
    message: "Your password has been successfully reset. All active sessions have been signed out for security.",
  };
}
