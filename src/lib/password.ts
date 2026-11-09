import bcrypt from "bcryptjs";

export const BCRYPT_COST = 12;

/**
 * Common breached, weak, and predictable passwords list (normalized lowercase).
 * Passwords matching these or simple variants are rejected by policy.
 */
const COMMON_BREACHED_PASSWORDS = new Set([
  "password1234",
  "password1234!",
  "password12345",
  "password12345!",
  "admin123456!",
  "administrator123",
  "pakistan1234",
  "pakistan1234!",
  "pakistan2026!",
  "pakistantravel",
  "pakistantravel123",
  "pakistantravel2026",
  "pakistantravel2026!",
  "welcome12345!",
  "welcome123456",
  "letmein12345!",
  "qwertyuiop12",
  "qwerty123456",
  "123456789012",
  "1234567890123",
  "iloveyou1234",
  "changeme1234!",
  "hunter2hunter2",
  "dragon123456",
  "monkey123456",
  "princess1234",
  "sunshine1234",
  "football1234",
  "karakoram123!",
  "baltistan123!",
  "islamabad123!",
]);

/**
 * Check if a candidate password matches known breach datasets or predictable keyboard walks.
 */
export function isBreachedPassword(password: string): boolean {
  if (!password) return true;
  const lower = password.toLowerCase().trim();

  // 1. Direct match in common breach dictionary
  if (COMMON_BREACHED_PASSWORDS.has(lower)) {
    return true;
  }

  // 2. Check stripped punctuation match (e.g. "Password1234!!" -> "password1234")
  const stripped = lower.replace(/[^a-z0-9]/g, "");
  if (COMMON_BREACHED_PASSWORDS.has(stripped)) {
    return true;
  }

  // 3. Repeated character sequences (e.g., "aaaaaa", "111111")
  if (/(.)\1{4,}/.test(password)) {
    return true;
  }

  // 4. Common sequential numeric or keyboard patterns
  const sequences = [
    "123456789",
    "987654321",
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
  ];
  for (const seq of sequences) {
    if (lower.includes(seq)) {
      return true;
    }
  }

  return false;
}

/**
 * Strict enterprise password policy validation:
 * - Minimum 12 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one numeric digit (0-9)
 * - At least one special symbol (!@#$%^&*...)
 * - Not present in common breach lists
 */
export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required." };
  }

  if (password.length < 12) {
    return { valid: false, error: "Password must be at least 12 characters long." };
  }

  if (password.length > 128) {
    return { valid: false, error: "Password must not exceed 128 characters." };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter (A-Z)." };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter (a-z)." };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number (0-9)." };
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character (!@#$%^&*...)." };
  }

  if (isBreachedPassword(password)) {
    return {
      valid: false,
      error: "This password appears in known security breach datasets or is too predictable. Please choose a unique passphrase.",
    };
  }

  return { valid: true };
}

/**
 * Hash password with bcrypt cost 12.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(BCRYPT_COST);
  return bcrypt.hash(password, salt);
}

/**
 * Verify plaintext password against hashed password.
 */
export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  if (!password || !hashed) return false;
  return bcrypt.compare(password, hashed);
}

/**
 * Check if an existing bcrypt hash was generated with cost < 12 and should be rehashed.
 */
export function needsRehash(hashedPassword: string): boolean {
  if (!hashedPassword || !hashedPassword.startsWith("$2")) {
    return true;
  }
  const parts = hashedPassword.split("$");
  if (parts.length >= 4) {
    const cost = parseInt(parts[2], 10);
    if (!isNaN(cost) && cost < BCRYPT_COST) {
      return true;
    }
  }
  return false;
}
