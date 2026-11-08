/**
 * PakistanTravel.Agency - Single Source of Truth Site Configuration
 * 
 * HARD RULES:
 * - Pure marketplace model: The platform owner is an intermediary, has NO license of their own,
 *   and has NO personal phone/WhatsApp number published.
 * - Independent tour operators publish and manage their own tour packages.
 * - Never invent legal numbers, license numbers, company names, or statistics.
 * - Every page, footer, metadata, voucher, and chatbot prompt must read from this config.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pakistantravel.agency";
export const COMMISSION_PERCENT = Number(process.env.NEXT_PUBLIC_COMMISSION_PERCENT || 10);
export const PAYOUT_TIMING = "within 48 hours of tour departure";

export const ADMIN_NOTIFICATION_EMAILS: string[] = [
  process.env.ADMIN_ALERT_EMAIL || "ops@pakistantravel.agency",
];

export interface LoginSecurityConfig {
  maxFailedAttemptsPerPair: number;
  pairLockoutDurationMinutes: number;
  globalIpMaxFailuresPerHour: number;
  globalIpLockoutDurationMinutes: number;
  progressiveDelayStepMs: number;
  maxProgressiveDelayMs: number;
}

export const LOGIN_SECURITY_CONFIG: LoginSecurityConfig = {
  maxFailedAttemptsPerPair: 3, // 3 wrong passwords for (IP + email) -> 30-minute block
  pairLockoutDurationMinutes: 30, // 30 minutes
  globalIpMaxFailuresPerHour: 30, // 30 failures/hr across all emails -> IP block
  globalIpLockoutDurationMinutes: 30, // 30 minutes
  progressiveDelayStepMs: 1000, // 1s per previous recent failure
  maxProgressiveDelayMs: 60000, // max 60s
};

export interface SiteConfig {
  name: string;
  legalBrand: string;
  domain: string;
  url: string;
  tagline: string;
  contact: {
    // Support email displayed on the platform (TODO: Confirm real support inbox)
    supportEmail: string;
    supportHours: {
      humanEmail: string;
      aiChatbot: string;
    };
    // Physical registered address (leave empty unless confirmed by user)
    address: string;
  };
  cancellationPolicy: {
    fullRefundDays: number;
    partialRefundDaysMin: number;
    partialRefundDaysMax: number;
    partialRefundPercent: number;
    noRefundHours: number;
    summary: string;
  };
  marketplace: {
    // Platform commission percentage (Single source of truth)
    commissionPercent: number;
    defaultCommissionRate: number;
    commissionModel: "deducted_from_vendor";
    commissionExplanation: string;
    gatewayFeesDeductedSeparately: boolean;
    gatewayFeesNote: string;
    payoutTiming: string;
    payoutMethods: string[];
    // Operator contact visibility: "after_booking" (default) or "always"
    contactVisibility: "after_booking" | "always";
  };
  paymentGateways: {
    jazzcash: boolean;
    easypaisa: boolean;
    bankTransfer: boolean;
    cashOnArrival: boolean;
    stripe: boolean;
  };
  features: {
    aiChatbot: boolean;
    customTripEnquiry: boolean;
  };
}

export const siteConfig: SiteConfig = {
  name: "PakistanTravel.Agency",
  legalBrand: "PakistanTravel.Agency",
  domain: "www.pakistantravel.agency",
  url: SITE_URL,
  tagline: "Northern Pakistan Tour Packages",

  contact: {
    // TODO: User to confirm public support email. If empty, the UI hides the email line.
    supportEmail: process.env.SUPPORT_EMAIL || "support@pakistantravel.agency",
    supportHours: {
      humanEmail: "Mon - Sat, 9:00 AM - 6:00 PM PKT",
      aiChatbot: "24/7 Instant AI Assistance",
    },
    // No physical address is claimed by default for the intermediary platform
    address: "",
  },

  cancellationPolicy: {
    fullRefundDays: 7,
    partialRefundDaysMin: 3,
    partialRefundDaysMax: 6,
    partialRefundPercent: 50,
    noRefundHours: 72,
    summary:
      "100% refund for cancellations made 7 or more days before departure. 50% refund for cancellations between 3 and 6 days before departure. Non-refundable within 72 hours of departure.",
  },

  marketplace: {
    // Single source of truth commission: COMMISSION_PERCENT (default: 10%)
    commissionPercent: COMMISSION_PERCENT,
    defaultCommissionRate: COMMISSION_PERCENT / 100,
    commissionModel: "deducted_from_vendor",
    commissionExplanation: `A flat ${COMMISSION_PERCENT}% platform commission is deducted from the operator's gross listing price on completed bookings. Travelers pay direct operator rates with zero booking fees.`,
    gatewayFeesDeductedSeparately: true,
    gatewayFeesNote: "Payment gateway processing fees (JazzCash, credit/debit cards, bank transfer) are deducted separately from operator disbursements.",
    payoutTiming: PAYOUT_TIMING,
    payoutMethods: ["Pakistani Commercial Bank Account (IBAN)"],
    contactVisibility: "after_booking", // Prevents platform commission bypass before confirmed booking
  },

  paymentGateways: {
    jazzcash: true,
    easypaisa: true,
    bankTransfer: true,
    cashOnArrival: false,
    stripe: false,
  },

  features: {
    aiChatbot: true,
    customTripEnquiry: true,
  },
};

/**
 * Returns trimmed string if valid and non-empty, otherwise null.
 */
export function getVerifiedValue(val: string | undefined | null): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}
