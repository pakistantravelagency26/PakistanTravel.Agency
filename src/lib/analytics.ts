// Client analytics utility for Google Analytics 4 (GA4) / Google Tag Manager (GTM)
// Consent-aware and type-safe event tracking for PakistanTravel.Agency

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
      // Advertising consent remains strictly denied unless explicitly opted into
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
// Strongly-Typed Custom Events
// ==========================================

export function trackSearchUsed(params: {
  searchTerm?: string;
  destination?: string;
  duration?: string;
  resultsCount?: number;
}) {
  pushAnalyticsEvent("search_used", {
    search_term: params.searchTerm || "",
    destination: params.destination || "all",
    duration: params.duration || "any",
    results_count: params.resultsCount ?? null,
  });
}

export function trackDestinationViewed(params: {
  slug: string;
  name: string;
  province: string;
}) {
  pushAnalyticsEvent("destination_viewed", {
    destination_slug: params.slug,
    destination_name: params.name,
    province: params.province,
  });
}

export function trackTourViewed(params: {
  tourId: string;
  slug: string;
  title: string;
  price: number;
  vendorName: string;
  destination: string;
}) {
  pushAnalyticsEvent("tour_viewed", {
    tour_id: params.tourId,
    tour_slug: params.slug,
    tour_title: params.title,
    price_pkr: params.price,
    vendor_name: params.vendorName,
    destination: params.destination,
  });
}

export function trackCustomTripSubmitted(params: {
  destination: string;
  travelers: number;
  travelDate?: string;
}) {
  pushAnalyticsEvent("custom_trip_submitted", {
    destination: params.destination,
    travelers_count: params.travelers,
    travel_date: params.travelDate || "flexible",
  });
}

export function trackPartnerSignupClicked(params: {
  location: "header" | "footer" | "banner" | "dedicated_page";
}) {
  pushAnalyticsEvent("partner_signup_clicked", {
    click_location: params.location,
  });
}

export function trackContactClicked(params: {
  contactMethod: "whatsapp" | "email" | "form" | "phone";
}) {
  pushAnalyticsEvent("contact_clicked", {
    contact_method: params.contactMethod,
  });
}

export function trackCheckoutStarted(params: {
  listingId: string;
  title: string;
  price: number;
  travelers: number;
  currency?: string;
}) {
  pushAnalyticsEvent("checkout_started", {
    listing_id: params.listingId,
    item_name: params.title,
    value: params.price,
    currency: params.currency || "PKR",
    travelers_count: params.travelers,
  });
}

export function trackBookingConfirmed(params: {
  bookingId: string;
  listingId: string;
  title: string;
  value: number;
  currency?: string;
}) {
  pushAnalyticsEvent("booking_confirmed", {
    transaction_id: params.bookingId,
    listing_id: params.listingId,
    item_name: params.title,
    value: params.value,
    currency: params.currency || "PKR",
  });
}
