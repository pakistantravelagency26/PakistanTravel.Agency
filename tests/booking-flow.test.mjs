import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateBookingPricing, validateDepartureAvailability } from '../src/lib/bookingPricing.ts';

describe('PakistanTravel.Agency Booking Flow QA Tests', () => {
  describe('Price Calculation & Breakdown', () => {
    it('calculates standard twin-sharing tour pricing correctly for 2 travelers', () => {
      const pricing = calculateBookingPricing({
        basePrice: 50000,
        quantity: 2,
        isTour: true,
        isSoloTraveler: false,
        taxRate: 0.05,
        depositPercent: 25,
      });

      // 50,000 * 2 = 100,000 baseRate
      assert.strictEqual(pricing.baseRate, 100000);
      assert.strictEqual(pricing.singleSupplement, 0);
      assert.strictEqual(pricing.subtotal, 100000);
      // 5% tax = 5,000
      assert.strictEqual(pricing.tax, 5000);
      // Total = 105,000
      assert.strictEqual(pricing.totalAmount, 105000);
      // 25% deposit = 26,250
      assert.strictEqual(pricing.depositAmount, 26250);
      // Balance due = 78,750
      assert.strictEqual(pricing.balanceDue, 78750);
    });

    it('applies solo-traveler single supplement when quantity is 1 and solo flag is active', () => {
      const pricing = calculateBookingPricing({
        basePrice: 40000,
        quantity: 1,
        isTour: true,
        isSoloTraveler: true,
        singleSupplementAmount: 14000, // Custom 35% supplement
        taxRate: 0.05,
        depositPercent: 30,
      });

      assert.strictEqual(pricing.baseRate, 40000);
      assert.strictEqual(pricing.singleSupplement, 14000);
      assert.strictEqual(pricing.subtotal, 54000);
      // 5% of 54,000 = 2,700
      assert.strictEqual(pricing.tax, 2700);
      // Total = 56,700
      assert.strictEqual(pricing.totalAmount, 56700);
      // 30% deposit = 17,010
      assert.strictEqual(pricing.depositAmount, 17010);
      assert.strictEqual(pricing.balanceDue, 39690);
    });

    it('calculates hotel lodging rates based on room quantity and number of nights', () => {
      const pricing = calculateBookingPricing({
        basePrice: 18000, // PKR per night
        quantity: 2, // 2 rooms
        isTour: false,
        nightsCount: 3, // 3 nights stay
        taxRate: 0.05,
        depositPercent: 20,
      });

      // 18,000 * 3 nights * 2 rooms = 108,000
      assert.strictEqual(pricing.baseRate, 108000);
      assert.strictEqual(pricing.singleSupplement, 0); // No solo supplement for hotels
      assert.strictEqual(pricing.subtotal, 108000);
      // 5% of 108,000 = 5,400
      assert.strictEqual(pricing.tax, 5400);
      assert.strictEqual(pricing.totalAmount, 113400);
      // 20% deposit = 22,680
      assert.strictEqual(pricing.depositAmount, 22680);
      assert.strictEqual(pricing.balanceDue, 90720);
    });

    it('accurately applies valid promo code discounts', () => {
      const pricing = calculateBookingPricing({
        basePrice: 60000,
        quantity: 1,
        isTour: true,
        discountAmount: 6000, // 10% promo
        taxRate: 0.05,
      });

      // Subtotal = 60,000, Tax = 3,000, Discount = 6,000 => Total = 57,000
      assert.strictEqual(pricing.subtotal, 60000);
      assert.strictEqual(pricing.tax, 3000);
      assert.strictEqual(pricing.discount, 6000);
      assert.strictEqual(pricing.totalAmount, 57000);
    });
  });

  describe('Availability & Overbooking Prevention', () => {
    it('permits booking when requested seats are within available capacity', () => {
      const check = validateDepartureAvailability({
        seatsTotal: 14,
        seatsLeft: 6,
        requestedSeats: 2,
      });

      assert.strictEqual(check.allowed, true);
      assert.strictEqual(check.seatsRemainingAfterBooking, 4);
      assert.strictEqual(check.error, undefined);
    });

    it('permits exact capacity booking (final available seats)', () => {
      const check = validateDepartureAvailability({
        seatsTotal: 12,
        seatsLeft: 3,
        requestedSeats: 3,
      });

      assert.strictEqual(check.allowed, true);
      assert.strictEqual(check.seatsRemainingAfterBooking, 0);
    });

    it('blocks overbooking when requested seats exceed remaining seats', () => {
      const check = validateDepartureAvailability({
        seatsTotal: 14,
        seatsLeft: 2,
        requestedSeats: 4,
      });

      assert.strictEqual(check.allowed, false);
      assert.match(check.error || '', /Overbooking prevented/);
      assert.strictEqual(check.seatsRemainingAfterBooking, 2);
    });

    it('blocks booking when departure is completely sold out', () => {
      const check = validateDepartureAvailability({
        seatsTotal: 14,
        seatsLeft: 0,
        requestedSeats: 1,
      });

      assert.strictEqual(check.allowed, false);
      assert.match(check.error || '', /SOLD OUT/);
      assert.strictEqual(check.seatsRemainingAfterBooking, 0);
    });

    it('rejects invalid non-positive seat requests', () => {
      const check = validateDepartureAvailability({
        seatsTotal: 10,
        seatsLeft: 5,
        requestedSeats: 0,
      });

      assert.strictEqual(check.allowed, false);
      assert.match(check.error || '', /greater than zero/);
    });
  });
});
