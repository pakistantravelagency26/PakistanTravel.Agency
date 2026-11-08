/**
 * PakistanTravel.Agency - Password Complexity & Common Password Defense
 * 
 * Enforces strong password standards for customers, vendors, and admins:
 * - Minimum 8 characters
 * - Uppercase, lowercase, numeric, and special character required
 * - Rejection of common compromised passwords
 */

const COMMON_PASSWORDS = new Set([
  "password",
  "password123",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty123",
  "admin123",
  "pakistan",
  "pakistan123",
  "pakistantravel",
  "welcome123",
  "letmein123",
  "iloveyou",
  "testing123",
  "skardu123",
  "hunza123",
  "gilgit123",
  "lahore123",
  "karachi123",
  "islamabad123",
]);

import crypto from "crypto";

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password || password.length < 12) {
    errors.push("Password must be at least 12 characters long.");
  }

  if (password && password.length > 128) {
    errors.push("Password must not exceed 128 characters.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z).");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z).");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one numeric digit (0-9).");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*...).");
  }

  const normalized = password.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (COMMON_PASSWORDS.has(normalized) || COMMON_PASSWORDS.has(password.toLowerCase())) {
    errors.push("This password is too common and easily guessed. Please choose a more unique password.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if a password has appeared in known public data breaches using
 * HaveIBeenPwned (HIBP) k-anonymity model.
 * 
 * Only the first 5 characters of the SHA-1 hash are sent to the HIBP API.
 * The full password or full hash is NEVER transmitted across the network.
 */
export async function checkHaveIBeenPwned(password: string): Promise<{ breached: boolean; count?: number }> {
  try {
    const sha1Hash = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1Hash.slice(0, 5);
    const suffix = sha1Hash.slice(5);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return { breached: false };
    }

    const text = await response.text();
    const lines = text.split("\r\n");

    for (const line of lines) {
      const [hashSuffix, countStr] = line.split(":");
      if (hashSuffix && hashSuffix.trim() === suffix) {
        const count = parseInt(countStr || "1", 10);
        return { breached: true, count };
      }
    }

    return { breached: false };
  } catch {
    // If HIBP API is unreachable or times out, fail open safely
    return { breached: false };
  }
}
