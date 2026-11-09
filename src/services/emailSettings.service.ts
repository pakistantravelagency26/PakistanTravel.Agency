import { prisma } from "../lib/prisma.ts";
import { encryptSensitiveField, decryptSensitiveField } from "../lib/fieldEncryption.ts";
import { ADMIN_NOTIFICATION_EMAILS, siteConfig } from "../config/site.ts";

export const EMAIL_SETTINGS_KEY = "booking_email_settings";

export interface BookingEmailSettings {
  enabled: boolean;
  senderName: string;
  senderEmail: string;
  smtpUser: string;
  smtpPass?: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  adminEmail: string;
  replyTo?: string | null;
}

export interface MaskedBookingEmailSettings {
  enabled: boolean;
  senderName: string;
  senderEmail: string;
  smtpUser: string;
  isPasswordConfigured: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  adminEmail: string;
  replyTo?: string | null;
}

export function getDefaultEmailSettings(): BookingEmailSettings {
  const envHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const envPort = Number(process.env.SMTP_PORT || 587);
  const envUser = process.env.SMTP_USER || "";
  const envPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || "";
  const envAdmin = (ADMIN_NOTIFICATION_EMAILS && ADMIN_NOTIFICATION_EMAILS[0]) || envUser || siteConfig.contact.supportEmail || "ops@pakistantravel.agency";

  return {
    enabled: true,
    senderName: "PakistanTravel.Agency",
    senderEmail: envUser,
    smtpUser: envUser,
    smtpPass: envPass,
    smtpHost: envHost,
    smtpPort: envPort,
    smtpSecure: envPort === 465,
    adminEmail: envAdmin,
    replyTo: siteConfig.contact.supportEmail || "",
  };
}

/**
 * Loads the active booking email configuration from the database (SiteSetting).
 * Decrypts the stored SMTP password if present.
 * Falls back to environment variables if no database configuration exists.
 */
export async function getBookingEmailSettings(): Promise<BookingEmailSettings> {
  const defaults = getDefaultEmailSettings();

  try {
    const record = await prisma.siteSetting.findUnique({
      where: { key: EMAIL_SETTINGS_KEY },
    });

    if (!record || !record.value || typeof record.value !== "object") {
      return defaults;
    }

    const val = record.value as Record<string, any>;
    let decryptedPass = "";

    if (val.smtpPassEncrypted && typeof val.smtpPassEncrypted === "string") {
      try {
        decryptedPass = decryptSensitiveField(val.smtpPassEncrypted);
      } catch (err) {
        console.error("[EmailSettings] Error decrypting stored SMTP password:", err);
      }
    } else if (val.smtpPass && typeof val.smtpPass === "string") {
      decryptedPass = val.smtpPass;
    }

    if (!decryptedPass && defaults.smtpPass) {
      decryptedPass = defaults.smtpPass;
    }

    const port = Number(val.smtpPort ?? defaults.smtpPort) || 587;
    const secure = typeof val.smtpSecure === "boolean" ? val.smtpSecure : port === 465;

    return {
      enabled: typeof val.enabled === "boolean" ? val.enabled : defaults.enabled,
      senderName: (val.senderName || defaults.senderName).trim(),
      senderEmail: (val.senderEmail || defaults.senderEmail).trim(),
      smtpUser: (val.smtpUser || val.senderEmail || defaults.smtpUser).trim(),
      smtpPass: decryptedPass,
      smtpHost: (val.smtpHost || defaults.smtpHost).trim(),
      smtpPort: port,
      smtpSecure: secure,
      adminEmail: (val.adminEmail || defaults.adminEmail).trim(),
      replyTo: val.replyTo !== undefined ? (val.replyTo?.trim() || null) : defaults.replyTo,
    };
  } catch (err) {
    console.error("[EmailSettings] Database fetch error, using environment defaults:", err);
    return defaults;
  }
}

/**
 * Returns safe, masked email settings for the Admin UI and client responses.
 * Plaintext passwords are NEVER returned over the network.
 */
export async function getMaskedBookingEmailSettings(): Promise<MaskedBookingEmailSettings> {
  const full = await getBookingEmailSettings();
  const isPasswordConfigured = Boolean(full.smtpPass && full.smtpPass.trim().length > 0);

  return {
    enabled: full.enabled,
    senderName: full.senderName,
    senderEmail: full.senderEmail,
    smtpUser: full.smtpUser,
    isPasswordConfigured,
    smtpHost: full.smtpHost,
    smtpPort: full.smtpPort,
    smtpSecure: full.smtpSecure,
    adminEmail: full.adminEmail,
    replyTo: full.replyTo || null,
  };
}

export interface SaveBookingEmailSettingsInput {
  enabled?: boolean;
  senderName?: string;
  senderEmail?: string;
  smtpUser?: string;
  smtpPass?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  adminEmail?: string;
  replyTo?: string | null;
  clearPassword?: boolean;
}

/**
 * Saves updated email settings to Neon Postgres in SiteSetting table.
 * Encrypts Gmail App Password with AES-256-GCM.
 * Preserves existing password if the submitted password field is empty or masked.
 */
export async function saveBookingEmailSettings(
  input: SaveBookingEmailSettingsInput
): Promise<MaskedBookingEmailSettings> {
  const defaults = getDefaultEmailSettings();

  const existingRecord = await prisma.siteSetting.findUnique({
    where: { key: EMAIL_SETTINGS_KEY },
  });
  const existingVal = (existingRecord?.value as Record<string, any>) || {};

  let finalEncryptedPass: string | null = null;

  if (input.clearPassword === true) {
    finalEncryptedPass = null;
  } else if (
    input.smtpPass &&
    typeof input.smtpPass === "string" &&
    input.smtpPass.trim() !== "" &&
    input.smtpPass !== "••••••••••••••••"
  ) {
    finalEncryptedPass = encryptSensitiveField(input.smtpPass.trim());
  } else if (existingVal.smtpPassEncrypted) {
    // Preserve previously saved encrypted password
    finalEncryptedPass = existingVal.smtpPassEncrypted;
  } else if (defaults.smtpPass) {
    // Preserve default from environment
    finalEncryptedPass = encryptSensitiveField(defaults.smtpPass);
  }

  const port = Number(input.smtpPort ?? existingVal.smtpPort ?? defaults.smtpPort) || 587;
  const secure =
    typeof input.smtpSecure === "boolean"
      ? input.smtpSecure
      : typeof existingVal.smtpSecure === "boolean"
      ? existingVal.smtpSecure
      : port === 465;

  const senderEmail = (input.senderEmail ?? existingVal.senderEmail ?? defaults.senderEmail ?? "").trim();
  const smtpUser = (input.smtpUser ?? existingVal.smtpUser ?? senderEmail ?? defaults.smtpUser ?? "").trim();

  const payloadToStore = {
    enabled: typeof input.enabled === "boolean" ? input.enabled : (existingVal.enabled ?? defaults.enabled),
    senderName: (input.senderName ?? existingVal.senderName ?? defaults.senderName).trim(),
    senderEmail,
    smtpUser,
    smtpPassEncrypted: finalEncryptedPass,
    smtpHost: (input.smtpHost ?? existingVal.smtpHost ?? defaults.smtpHost).trim(),
    smtpPort: port,
    smtpSecure: secure,
    adminEmail: (input.adminEmail ?? existingVal.adminEmail ?? defaults.adminEmail).trim(),
    replyTo: input.replyTo !== undefined ? (input.replyTo?.trim() || null) : (existingVal.replyTo ?? defaults.replyTo ?? null),
    updatedAt: new Date().toISOString(),
  };

  await prisma.siteSetting.upsert({
    where: { key: EMAIL_SETTINGS_KEY },
    update: { value: payloadToStore },
    create: { key: EMAIL_SETTINGS_KEY, value: payloadToStore },
  });

  return {
    enabled: payloadToStore.enabled,
    senderName: payloadToStore.senderName,
    senderEmail: payloadToStore.senderEmail,
    smtpUser: payloadToStore.smtpUser,
    isPasswordConfigured: Boolean(finalEncryptedPass),
    smtpHost: payloadToStore.smtpHost,
    smtpPort: payloadToStore.smtpPort,
    smtpSecure: payloadToStore.smtpSecure,
    adminEmail: payloadToStore.adminEmail,
    replyTo: payloadToStore.replyTo,
  };
}
