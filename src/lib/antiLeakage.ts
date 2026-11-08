/**
 * Anti-Leakage & Contact Masking Library for PakistanTravel.Agency
 * 
 * Prevents marketplace bypass by detecting and masking phone numbers, WhatsApp links,
 * and email addresses in public contexts (reviews, public inquiries, unconfirmed views).
 */

export const CONTACT_MASK_NOTICE =
  "[contact hidden to protect both parties; contact details are shared after booking]";

// Non-global regexes for reliable state-free boolean test() evaluation
const PK_PHONE_TEST = /(?:\+?92[\s.-]?|0)3\d{2}[\s.-]?\d{7}/i;
const OBFUSCATED_PHONE_TEST = /(?:0|\+?9\s*2)\s*3[\s.-]*(?:\d[\s.-]*){8,9}/i;
const GENERIC_PHONE_TEST = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const EMAIL_TEST = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i;
const OBFUSCATED_EMAIL_TEST = /\b[A-Za-z0-9._%+-]+\s*(?:\[\s*at\s*\]|\(at\)|\bat\b)\s*[A-Za-z0-9.-]+\s*(?:\[\s*dot\s*\]|\(dot\)|\bdot\b)\s*[A-Za-z]{2,}\b/i;
const BYPASS_KEYWORD_TEST = /(?:whatsapp|wa\.me|call\s+me|contact\s+me\s+(?:at|on|directly|offline|privately)|reach\s+me\s+on)/i;

// Global regexes for masking replacements
const PK_PHONE_REPLACE = /(?:\+?92[\s.-]?|0)3\d{2}[\s.-]?\d{7}/gi;
const OBFUSCATED_PHONE_REPLACE = /(?:0|\+?9\s*2)\s*3[\s.-]*(?:\d[\s.-]*){8,9}/gi;
const GENERIC_PHONE_REPLACE = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
const EMAIL_REPLACE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gi;
const OBFUSCATED_EMAIL_REPLACE = /\b[A-Za-z0-9._%+-]+\s*(?:\[\s*at\s*\]|\(at\)|\bat\b)\s*[A-Za-z0-9.-]+\s*(?:\[\s*dot\s*\]|\(dot\)|\bdot\b)\s*[A-Za-z]{2,}\b/gi;
const BYPASS_KEYWORD_REPLACE = /(?:whatsapp|wa\.me|call\s+me|contact\s+me\s+at|reach\s+me\s+on)\s*(?:at|on|:|\/)?\s*[\d\s+.-]{6,}|(?:contact\s+me\s+(?:directly|offline|privately))/gi;

/**
 * Checks whether text contains contact leakage (phone, email, WhatsApp, or bypass phrases).
 */
export function hasContactLeakage(text: string): boolean {
  if (!text || typeof text !== "string") return false;

  return (
    PK_PHONE_TEST.test(text) ||
    OBFUSCATED_PHONE_TEST.test(text) ||
    GENERIC_PHONE_TEST.test(text) ||
    EMAIL_TEST.test(text) ||
    OBFUSCATED_EMAIL_TEST.test(text) ||
    BYPASS_KEYWORD_TEST.test(text)
  );
}

export const containsContactLeakage = hasContactLeakage;

/**
 * Replaces detected contact details in the text with the standard safety notice.
 */
export function maskContactLeakage(text: string): string {
  if (!text || typeof text !== "string") return "";

  let masked = text;

  // Mask explicit bypass phrases first
  masked = masked.replace(BYPASS_KEYWORD_REPLACE, CONTACT_MASK_NOTICE);

  // Mask emails (standard and obfuscated)
  masked = masked.replace(EMAIL_REPLACE, CONTACT_MASK_NOTICE);
  masked = masked.replace(OBFUSCATED_EMAIL_REPLACE, CONTACT_MASK_NOTICE);

  // Mask phone numbers (Pakistani, obfuscated, generic)
  masked = masked.replace(PK_PHONE_REPLACE, CONTACT_MASK_NOTICE);
  masked = masked.replace(OBFUSCATED_PHONE_REPLACE, CONTACT_MASK_NOTICE);
  masked = masked.replace(GENERIC_PHONE_REPLACE, CONTACT_MASK_NOTICE);

  // Collapse consecutive mask notices if any
  const escapedNotice = CONTACT_MASK_NOTICE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const duplicateNoticeRegex = new RegExp(`(?:${escapedNotice}\\s*)+`, "g");
  masked = masked.replace(duplicateNoticeRegex, `${CONTACT_MASK_NOTICE} `).trim();

  return masked;
}

/**
 * Cleans phone number for wa.me link generation (keeps only digits, adds 92 country code if needed).
 */
export function formatWhatsAppUrl(rawPhone: string | null | undefined): string | null {
  if (!rawPhone) return null;
  const digits = rawPhone.replace(/\D/g, "");
  if (!digits) return null;

  // If local Pakistani 03001234567, convert to 923001234567
  let formatted = digits;
  if (digits.startsWith("03") && digits.length === 11) {
    formatted = "92" + digits.slice(1);
  } else if (digits.startsWith("3") && digits.length === 10) {
    formatted = "92" + digits;
  }

  return `https://wa.me/${formatted}`;
}

export interface PublicVendorProfile {
  id: string;
  businessName: string;
  city?: string;
  verified: boolean;
  joinedYear: number;
  rating: number;
  licenseNumber?: string;
  registrationNumber?: string;
}

/**
 * Sanitizes vendor data for public listings, stripping all direct phone, WhatsApp,
 * and email fields to prevent platform bypass.
 */
export function sanitizePublicVendor(rawVendor: any): PublicVendorProfile {
  return {
    id: rawVendor?.id || rawVendor?.vendorId || "",
    businessName: rawVendor?.businessName || "Local Travel Partner",
    city: rawVendor?.city,
    verified: rawVendor?.status === "VERIFIED",
    joinedYear: 2024,
    rating: 4.95,
    licenseNumber: rawVendor?.cnicOrTaxNumber || undefined,
    registrationNumber: undefined,
  };
}

/**
 * Resolves vendor contact for a booking, releasing phone and WhatsApp ONLY if the booking
 * is confirmed or paid.
 */
export function resolveBookingVendorContact(rawVendor: any, isConfirmed: boolean) {
  if (!rawVendor) return undefined;
  return {
    id: rawVendor.id,
    businessName: rawVendor.businessName || "Local Partner Operator",
    city: rawVendor.city,
    phone: isConfirmed ? rawVendor.phone : undefined,
    whatsapp: isConfirmed ? rawVendor.whatsapp || rawVendor.phone : undefined,
  };
}

