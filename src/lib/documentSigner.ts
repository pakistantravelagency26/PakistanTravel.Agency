import crypto from "crypto";

/**
 * Generates an HMAC signed URL for temporary authorized private document access.
 */
export function generateSignedDocumentUrl(filename: string, expiresInSeconds: number = 3600): string {
  const secret = process.env.NEXTAUTH_SECRET || "signed-url-secret-minimum-32-chars-long";
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${filename}:${expiresAt}`)
    .digest("hex");
  return `/api/documents/${filename}?exp=${expiresAt}&sig=${signature}`;
}

/**
 * Validates a signed URL token for private document retrieval.
 */
export function verifySignedDocumentToken(filename: string, expStr: string | null, sigStr: string | null): boolean {
  if (!expStr || !sigStr) return false;
  const exp = parseInt(expStr, 10);
  if (isNaN(exp) || exp < Math.floor(Date.now() / 1000)) {
    return false; // Expired
  }

  const secret = process.env.NEXTAUTH_SECRET || "signed-url-secret-minimum-32-chars-long";
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${filename}:${exp}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(sigStr, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    return false;
  }
}
