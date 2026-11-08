/**
 * PakistanTravel.Agency - Single Source of Truth Site Configuration
 * 
 * HARD RULES:
 * - Pure marketplace model: The platform owner is an intermediary, has NO license of their own,
 *   and has NO personal phone/WhatsApp number published.
 * - Independent tour operators and hotels publish and manage their own listings.
 * - Never invent legal numbers, license numbers, company names, or statistics.
 * - Every page, footer, metadata, voucher, and chatbot prompt must read from this config.
 */

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
    // TODO: Confirm marketplace commission percentage with owner (default: 10%)
    defaultCommissionRate: number;
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
  domain: "pakistantravel.agency",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://pakistantravel-agency.vercel.app",
  tagline: "Northern Pakistan Tours, Hotels & 4x4 Bookings",

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
    // TODO: Awaiting user confirmation for actual vendor commission percentage
    defaultCommissionRate: 0.10, // 10%
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
