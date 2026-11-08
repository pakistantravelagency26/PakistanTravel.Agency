/**
 * PakistanTravel.Agency - RFC 6238 Standard TOTP Implementation
 * 
 * Fully compatible with:
 * - Google Authenticator
 * - Microsoft Authenticator
 * - Apple Passwords / iOS 15+ built-in authenticator
 * - Authy / 1Password / Bitwarden
 */

import crypto from "crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Encodes a buffer to standard RFC 4648 Base32 string (without padding)
 */
export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Decodes a Base32 string into a Buffer
 */
export function base32Decode(base32: string): Buffer {
  const clean = base32.toUpperCase().replace(/=+$/, "").replace(/\s+/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(clean[i]);
    if (idx === -1) {
      continue; // Skip invalid characters
    }

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Generates a cryptographically secure 20-byte (160-bit) Base32 secret
 */
export function generateTotpSecret(): string {
  const randomBytes = crypto.randomBytes(20);
  return base32Encode(randomBytes);
}

/**
 * Generates the standardized otpauth:// URI for QR code generation
 */
export function getOtpAuthUrl(email: string, secret: string): string {
  const issuer = "PakistanTravel.Agency";
  const account = email.trim();
  return `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Generates a 6-digit TOTP code for a secret at a given counter time step
 */
export function generateTotpCode(secret: string, timeStepOffset = 0): string {
  const key = base32Decode(secret);
  const epoch = Math.floor(Date.now() / 1000);
  const timeStep = Math.floor(epoch / 30) + timeStepOffset;

  const counterBuf = Buffer.alloc(8);
  counterBuf.writeBigUInt64BE(BigInt(timeStep), 0);

  const hmac = crypto.createHmac("sha1", key).update(counterBuf).digest();

  // Dynamic Truncation (RFC 4226)
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, "0");
}

/**
 * Verifies a 6-digit TOTP code against a secret with window drift tolerance
 */
export function verifyTotpCode(code: string, secret: string, window = 1): boolean {
  if (!code || !/^\d{6}$/.test(code.trim())) return false;
  const cleanCode = code.trim();

  for (let offset = -window; offset <= window; offset++) {
    const generated = generateTotpCode(secret, offset);
    if (crypto.timingSafeEqual(Buffer.from(cleanCode), Buffer.from(generated))) {
      return true;
    }
  }

  return false;
}

/**
 * Generates 10 single-use recovery backup codes formatted as XXXX-XXXX
 */
export function generateRecoveryCodes(count = 10): { plaintext: string[]; hashed: string[] } {
  const plaintext: string[] = [];
  const hashed: string[] = [];

  for (let i = 0; i < count; i++) {
    const raw = crypto.randomBytes(4).toString("hex").toUpperCase();
    const formatted = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
    plaintext.push(formatted);

    const hash = crypto.createHash("sha256").update(formatted).digest("hex");
    hashed.push(hash);
  }

  return { plaintext, hashed };
}

/**
 * Verifies a single-use recovery code and returns remaining valid hashed codes
 */
export function verifyRecoveryCode(
  inputCode: string,
  hashedCodes: string[]
): { valid: boolean; remainingHashedCodes: string[] } {
  const clean = inputCode.trim().toUpperCase().replace(/\s+/g, "");
  // Re-format if user omitted hyphen
  const formatted =
    clean.length === 8 && !clean.includes("-")
      ? `${clean.slice(0, 4)}-${clean.slice(4, 8)}`
      : clean;

  const targetHash = crypto.createHash("sha256").update(formatted).digest("hex");

  let matchIndex = -1;
  for (let i = 0; i < hashedCodes.length; i++) {
    if (crypto.timingSafeEqual(Buffer.from(targetHash), Buffer.from(hashedCodes[i]))) {
      matchIndex = i;
      break;
    }
  }

  if (matchIndex === -1) {
    return { valid: false, remainingHashedCodes: hashedCodes };
  }

  // Code is single use: remove it from remaining codes
  const remaining = [...hashedCodes];
  remaining.splice(matchIndex, 1);

  return {
    valid: true,
    remainingHashedCodes: remaining,
  };
}
