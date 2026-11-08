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

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
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
