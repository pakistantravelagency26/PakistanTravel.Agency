/**
 * PakistanTravel.Agency - Sensitive Column Application-Level Encryption (AES-256-GCM)
 * 
 * Encrypts sensitive PII and financial records at rest (CNIC, NTN, Bank IBAN, Raast ID)
 * using authenticated AES-256-GCM encryption before storing in Neon PostgreSQL.
 */

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SALT = "pakistantravel-agency-field-encryption-salt-2026";

function getMasterKey(): Buffer {
  const secret =
    process.env.FIELD_ENCRYPTION_KEY ||
    process.env.TWO_FACTOR_ENCRYPTION_KEY ||
    process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error(
      "CONFIGURATION ERROR: FIELD_ENCRYPTION_KEY or NEXTAUTH_SECRET must be configured for sensitive data encryption."
    );
  }
  return crypto.scryptSync(secret, SALT, 32);
}

/**
 * Encrypts a sensitive string value into format `enc:v1:ivHex:tagHex:cipherHex`
 */
export function encryptSensitiveField(plaintext: string): string {
  if (!plaintext || typeof plaintext !== "string") return plaintext;
  if (plaintext.startsWith("enc:v1:")) return plaintext; // Already encrypted

  const key = getMasterKey();
  const iv = crypto.randomBytes(12); // Standard 96-bit IV for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: 16 });

  let ciphertext = cipher.update(plaintext, "utf8", "hex");
  ciphertext += cipher.final("hex");

  const tag = cipher.getAuthTag().toString("hex");
  return `enc:v1:${iv.toString("hex")}:${tag}:${ciphertext}`;
}

/**
 * Decrypts an authenticated AES-256-GCM payload.
 * If the value is not encrypted, returns it safely.
 */
export function decryptSensitiveField(payload: string): string {
  if (!payload || typeof payload !== "string") return payload;
  if (!payload.startsWith("enc:v1:")) return payload;

  const parts = payload.split(":");
  if (parts.length !== 5) {
    throw new Error("Malformed encrypted field payload format.");
  }

  const [, , ivHex, tagHex, ciphertextHex] = parts;
  const key = getMasterKey();
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: 16 });
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(ciphertextHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Masks a Pakistani CNIC (e.g., 42101-1234567-1 -> 42101-*******-1)
 */
export function maskCnic(cnic: string): string {
  if (!cnic || typeof cnic !== "string") return "";
  const clean = cnic.trim();
  if (clean.length < 8) return "********";
  return clean.slice(0, 5) + "-*******-" + clean.slice(-1);
}

/**
 * Masks a Bank Account or IBAN (e.g., PK36SCBL0000001123456701 -> PK36****6701)
 */
export function maskBankAccount(account: string): string {
  if (!account || typeof account !== "string") return "";
  const clean = account.trim();
  if (clean.length < 8) return "********";
  return clean.slice(0, 4) + "****" + clean.slice(-4);
}
