/**
 * Pure booking pricing and availability calculation utilities
 * Single source of truth across listings, checkout, server booking service, and QA tests.
 */

export interface GroupDiscountTier {
  minPersons: number;
  pricePerPerson: number;
}

export interface PricingCalculationInput {
  basePrice: number;
  quantity: number;
  isTour: boolean;
  nightsCount?: number;
  isSoloTraveler?: boolean;
  isPrivateRoom?: boolean;
  singleSupplementAmount?: number;
  depositPercent?: number;
  discountAmount?: number;
  taxRate?: number;
  groupDiscounts?: GroupDiscountTier[];
}

export interface PricingCalculationResult {
  baseRate: number;
  effectiveUnitPrice: number;
  singleSupplement: number;
  groupDiscountSavings: number;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  depositAmount: number;
  balanceDue: number;
}

/**
 * Calculates pricing breakdown according to tour package rules:
 * - Sharing room: basePrice * travelers (with server-side group discount tier if quantity >= minPersons)
 * - Private room: covers 2 travelers per room (Math.ceil(travelers / 2) * roomPrice)
 * - Solo room: solo package rate without duplicate surcharge
 * - Advance deposit: 25% server-calculated; remaining balance on arrival
 */
export function calculateBookingPricing(input: PricingCalculationInput): PricingCalculationResult {
  const {
    basePrice,
    quantity,
    isTour,
    nightsCount = 1,
    isSoloTraveler = false,
    isPrivateRoom = false,
    singleSupplementAmount,
    depositPercent = 25,
    discountAmount = 0,
    taxRate = 0,
    groupDiscounts = [],
  } = input;

  if (basePrice < 0 || quantity < 1) {
    throw new Error("Base price must be non-negative and quantity must be at least 1.");
  }

  let effectiveUnitPrice = basePrice;
  let groupDiscountSavings = 0;

  // Check server-side group discount tier
  if (isTour && !isPrivateRoom && Array.isArray(groupDiscounts) && groupDiscounts.length > 0) {
    const sortedTiers = [...groupDiscounts].sort((a, b) => b.minPersons - a.minPersons);
    const applicableTier = sortedTiers.find((t) => quantity >= t.minPersons && t.pricePerPerson > 0 && t.pricePerPerson < basePrice);
    if (applicableTier) {
      effectiveUnitPrice = applicableTier.pricePerPerson;
      groupDiscountSavings = (basePrice - applicableTier.pricePerPerson) * quantity;
    }
  }

  let baseRate = 0;
  let singleSupplement = 0;

  if (isTour) {
    if (isPrivateRoom) {
      // Private room covers up to 2 guests per room
      const roomsRequired = Math.ceil(quantity / 2);
      baseRate = basePrice * roomsRequired;
    } else {
      baseRate = effectiveUnitPrice * quantity;
      // Single supplement applies only if solo sharing room opted for private single upgrade
      if (isSoloTraveler && quantity === 1) {
        singleSupplement = singleSupplementAmount !== undefined
          ? singleSupplementAmount
          : 0;
      }
    }
  } else {
    // Hotel or per-night stay
    baseRate = basePrice * Math.max(1, nightsCount) * quantity;
  }

  const subtotal = baseRate + singleSupplement;
  const tax = taxRate > 0 ? Math.round(subtotal * taxRate) : 0;
  const discount = Math.max(0, discountAmount);
  const totalAmount = Math.max(0, subtotal + tax - discount);

  // Exact 25% deposit
  const safeDepositPercent = Math.min(100, Math.max(0, depositPercent));
  const depositAmount = Math.round((totalAmount * safeDepositPercent) / 100);
  const balanceDue = totalAmount - depositAmount;

  return {
    baseRate,
    effectiveUnitPrice,
    singleSupplement,
    groupDiscountSavings,
    subtotal,
    tax,
    discount,
    totalAmount,
    depositAmount,
    balanceDue,
  };
}

export interface AvailabilityValidationInput {
  seatsTotal: number;
  seatsLeft: number;
  requestedSeats: number;
}

export interface AvailabilityValidationResult {
  allowed: boolean;
  error?: string;
  seatsRemainingAfterBooking: number;
}

/**
 * Validates departure seat inventory to strictly prevent double-booking or overbooking.
 */
export function validateDepartureAvailability(
  input: AvailabilityValidationInput
): AvailabilityValidationResult {
  const { seatsTotal, seatsLeft, requestedSeats } = input;

  if (requestedSeats < 1) {
    return {
      allowed: false,
      error: "Requested seats count must be greater than zero (at least 1 seat required).",
      seatsRemainingAfterBooking: seatsLeft,
    };
  }

  if (seatsLeft === 0) {
    return {
      allowed: false,
      error: "This tour departure is SOLD OUT. Please select another scheduled departure date.",
      seatsRemainingAfterBooking: 0,
    };
  }

  if (seatsLeft < requestedSeats) {
    return {
      allowed: false,
      error: `Overbooking prevented: Only ${seatsLeft} seat(s) remaining for this departure. Cannot accommodate ${requestedSeats} traveler(s).`,
      seatsRemainingAfterBooking: seatsLeft,
    };
  }

  const remaining = seatsLeft - requestedSeats;
  return {
    allowed: true,
    seatsRemainingAfterBooking: remaining,
  };
}

/**
 * Validates tour duration days and nights:
 * Rule: Nights = Days - 1, and EndDate = StartDate + (Days - 1)
 */
export function validateTourDuration(
  days: number,
  nights?: number
): { valid: boolean; correctedNights: number; durationString: string } {
  const safeDays = Math.max(1, Math.round(days));
  const expectedNights = Math.max(0, safeDays - 1);
  const isValid = nights === undefined || nights === expectedNights;
  return {
    valid: isValid,
    correctedNights: expectedNights,
    durationString: `${safeDays} Days / ${expectedNights} Nights`,
  };
}

export function calculateDepartureEndDate(startDateStr: string, durationDays: number): string {
  const start = new Date(startDateStr);
  const safeDays = Math.max(1, Math.round(durationDays));
  // End date = start + (days - 1) days
  const end = new Date(start.getTime() + (safeDays - 1) * 24 * 60 * 60 * 1000);
  return end.toISOString().split("T")[0];
}
