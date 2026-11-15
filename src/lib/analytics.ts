// Client analytics utility for Google Analytics 4 (GA4) / Google Tag Manager (GTM)
// Consent-aware, type-safe, and strictly PII-free event tracking for PakistanTravel.Agency

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Safely push an event to dataLayer / gtag
 */
export function pushAnalyticsEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
    timestamp: new Date().toISOString(),
  });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

/**
 * Update consent state (Google Consent Mode v2)
 * Keeps analytics consent and advertising consent strictly separate.
 */
export function updateAnalyticsConsent(granted: boolean) {
  if (typeof window === "undefined") return;

  const state = granted ? "granted" : "denied";

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: state,
      // Advertising consent remains strictly denied
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "consent_update",
    analytics_storage: state,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Backward compatibility alias for updateConsentState
 */
export function updateConsentState(granted: boolean) {
  updateAnalyticsConsent(granted);
}

// ==========================================
// Strongly-Typed Custom Events (Strictly PII-Free)
// ==========================================

/**
 * 1. tour_view
 * Emitted when traveler navigates to a tour package detail page
 */
export function trackTourView(params: {
  listingId: string;
  slug: string;
  title: string;
  destination: string;
  price: number;
  durationDays?: number;
}) {
  pushAnalyticsEvent("tour_view", {
    listing_id: params.listingId,
    tour_slug: params.slug,
    tour_title: params.title,
    destination: params.destination,
    price_pkr: params.price,
    duration_days: params.durationDays ?? null,
  });
}

/**
 * 2. booking_started
 * Emitted when traveler initiates checkout / booking flow
 */
export function trackBookingStarted(params: {
  listingId: string;
  title: string;
  destination?: string;
  travelersCount: number;
  tierId?: string;
  totalPrice: number;
  depositAmount: number;
}) {
  pushAnalyticsEvent("booking_started", {
    listing_id: params.listingId,
    item_name: params.title,
    destination: params.destination || "general",
    travelers_count: params.travelersCount,
    tier_id: params.tierId || "standard",
    total_amount_pkr: params.totalPrice,
    deposit_amount_pkr: params.depositAmount,
    currency: "PKR",
  });
}

/**
 * 3. deposit_paid
 * Emitted when deposit confirmation is loaded after checkout
 */
export function trackDepositPaid(params: {
  bookingId: string;
  listingId: string;
  depositAmount: number;
  paymentMethod?: string;
}) {
  pushAnalyticsEvent("deposit_paid", {
    transaction_id: params.bookingId,
    listing_id: params.listingId,
    deposit_amount_pkr: params.depositAmount,
    currency: "PKR",
    payment_method: params.paymentMethod || "bank_transfer",
  });
}

/**
 * 4. trip_request_submitted
 * Emitted when custom trip inquiry form is submitted
 */
export function trackTripRequestSubmitted(params: {
  destination: string;
  travelersCount?: number;
  travelers?: number;
  travelDate?: string;
}) {
  const count = params.travelersCount ?? params.travelers ?? 1;
  pushAnalyticsEvent("trip_request_submitted", {
    destination: params.destination,
    travelers_count: count,
    travel_date: params.travelDate || "flexible",
  });
}

/**
 * 5. vendor_registered
 * Emitted when a tour operator completes partner registration
 */
export function trackVendorRegistered(params: {
  city?: string;
  businessType?: string;
}) {
  pushAnalyticsEvent("vendor_registered", {
    city: params.city || "Islamabad",
    business_type: params.businessType || "TOUR_OPERATOR",
    registered_at: new Date().toISOString(),
  });
}

/**
 * 6. chat_started
 * Emitted when traveler opens or sends first message in support chat
 */
export function trackChatStarted(params: {
  pagePath: string;
}) {
  pushAnalyticsEvent("chat_started", {
    page_path: params.pagePath,
    started_at: new Date().toISOString(),
  });
}

// Backward compatibility aliases
export const trackTourViewed = trackTourView;
export const trackCustomTripSubmitted = trackTripRequestSubmitted;
export const trackCheckoutStarted = trackBookingStarted;
export const trackBookingConfirmed = trackDepositPaid;
