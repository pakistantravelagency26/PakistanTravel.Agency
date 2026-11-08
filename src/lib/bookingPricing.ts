/**
 * Pure booking pricing and availability calculation utilities
 * Used across checkout, server booking service, and automated QA tests.
 */

export interface PricingCalculationInput {
  basePrice: number;
  quantity: number;
  isTour: boolean;
  nightsCount?: number;
  isSoloTraveler?: boolean;
  singleSupplementAmount?: number;
  depositPercent?: number;
  discountAmount?: number;
  taxRate?: number; // Default 0.05 (5% provincial tourism levy)
}

export interface PricingCalculationResult {
  baseRate: number;
  singleSupplement: number;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  depositAmount: number;
  balanceDue: number;
}

/**
 * Calculates pricing breakdown according to tour package rules,
 * solo traveler single-supplement surcharge, provincial taxes, and deposit splits.
 */
export function calculateBookingPricing(input: PricingCalculationInput): PricingCalculationResult {
  const {
    basePrice,
    quantity,
    isTour,
    nightsCount = 1,
    isSoloTraveler = false,
    singleSupplementAmount,
    depositPercent = 25,
    discountAmount = 0,
    taxRate = 0.05,
  } = input;

  if (basePrice < 0 || quantity < 1) {
    throw new Error("Base price must be non-negative and quantity must be at least 1.");
  }

  // Base rate calculation
  const baseRate = isTour ? basePrice * quantity : basePrice * Math.max(1, nightsCount) * quantity;

  // Single supplement applies strictly to solo travelers on tours
  let singleSupplement = 0;
  if (isTour && isSoloTraveler && quantity === 1) {
    singleSupplement = singleSupplementAmount !== undefined
      ? singleSupplementAmount
      : Math.round(basePrice * 0.35); // 35% default single supplement
  }

  const subtotal = baseRate + singleSupplement;
  const tax = Math.round(subtotal * taxRate);
  const discount = Math.max(0, discountAmount);
  const totalAmount = Math.max(0, subtotal + tax - discount);

  // Deposit calculation (clamped between 0 and 100)
  const safeDepositPercent = Math.min(100, Math.max(0, depositPercent));
  const depositAmount = Math.round((totalAmount * safeDepositPercent) / 100);
  const balanceDue = totalAmount - depositAmount;

  return {
    baseRate,
    singleSupplement,
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

  if (requestedSeats <= 0) {
    return {
      allowed: false,
      error: "Requested seats must be greater than zero.",
      seatsRemainingAfterBooking: seatsLeft,
    };
  }

  if (seatsLeft <= 0) {
    return {
      allowed: false,
      error: "This departure is completely SOLD OUT.",
      seatsRemainingAfterBooking: 0,
    };
  }

  if (requestedSeats > seatsLeft) {
    return {
      allowed: false,
      error: `Overbooking prevented: Only ${seatsLeft} seat(s) remaining of ${seatsTotal} total seats, but ${requestedSeats} were requested.`,
      seatsRemainingAfterBooking: seatsLeft,
    };
  }

  const seatsRemainingAfterBooking = seatsLeft - requestedSeats;

  return {
    allowed: true,
    seatsRemainingAfterBooking,
  };
}
