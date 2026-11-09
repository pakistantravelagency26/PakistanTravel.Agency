/**
 * PakistanTravel.Agency - 2FA TOTP Secret Encryption (AES-256-GCM)
 * 
 * Protects TOTP base32 secrets at rest in Neon PostgreSQL using
 * authenticated AES-256-GCM encryption.
 */

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SALT = "pakistantravel-agency-2fa-totp-salt-2026";

function getMasterKey(): Buffer {
  const secret =
    process.env.TWO_FACTOR_ENCRYPTION_KEY ||
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "CONFIGURATION ERROR: TWO_FACTOR_ENCRYPTION_KEY or NEXTAUTH_SECRET must be configured for 2FA encryption"
    );
  }
  return crypto.scryptSync(secret, SALT, 32);
}

/**
 * Encrypt a plaintext TOTP secret into format: iv:tag:ciphertext (all in hex)
 */
export function encryptTotpSecret(plainText: string): string {
  const key = getMasterKey();
  const iv = crypto.randomBytes(12); // Standard 12 bytes for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: 16 });

  let ciphertext = cipher.update(plainText, "utf8", "hex");
  ciphertext += cipher.final("hex");

  const tag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${tag}:${ciphertext}`;
}

/**
 * Decrypt an AES-256-GCM encrypted TOTP secret
 */
export function decryptTotpSecret(payload: string): string {
  if (!payload || !payload.includes(":")) {
    throw new Error("Invalid encrypted TOTP secret payload format.");
  }

  const [ivHex, tagHex, ciphertextHex] = payload.split(":");
  if (!ivHex || !tagHex || !ciphertextHex) {
    throw new Error("Malformed encrypted TOTP payload.");
  }

  const key = getMasterKey();
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: 16 });
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(ciphertextHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
