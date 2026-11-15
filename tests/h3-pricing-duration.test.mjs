import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBookingPricing,
  validateTourDuration,
  calculateDepartureEndDate,
} from '../src/lib/bookingPricing.ts';

describe('H3: Duration and Pricing Calculations Test Suite', () => {
  describe('H3.1: Duration Math (Nights = Days - 1, EndDate = StartDate + Days - 1)', () => {
    test('enforces nights = days - 1 for 8-day tour', () => {
      const res = validateTourDuration(8, 9); // invalid 9 nights
      assert.equal(res.valid, false);
      assert.equal(res.correctedNights, 7);
      assert.equal(res.durationString, '8 Days / 7 Nights');
    });

    test('validates correct 10-day tour duration (10 Days / 9 Nights)', () => {
      const res = validateTourDuration(10, 9);
      assert.equal(res.valid, true);
      assert.equal(res.correctedNights, 9);
      assert.equal(res.durationString, '10 Days / 9 Nights');
    });

    test('calculates exact 8-day departure calendar end date (Nov 15 -> Nov 22)', () => {
      // Nov 15 to Nov 22 is exactly 8 calendar days (15, 16, 17, 18, 19, 20, 21, 22)
      const endDate = calculateDepartureEndDate('2026-11-15', 8);
      assert.equal(endDate, '2026-11-22');
    });

    test('calculates exact 10-day departure calendar end date (Dec 06 -> Dec 15)', () => {
      // Dec 6 to Dec 15 is exactly 10 calendar days
      const endDate = calculateDepartureEndDate('2026-12-06', 10);
      assert.equal(endDate, '2026-12-15');
    });
  });

  describe('H3.2 & H3.5: Package Tier Pricing & 25% Deposit Calculations', () => {
    test('Sharing Room: 2 travelers at PKR 49,500 each', () => {
      const pricing = calculateBookingPricing({
        basePrice: 49500,
        quantity: 2,
        isTour: true,
        isPrivateRoom: false,
        depositPercent: 25,
      });

      assert.equal(pricing.baseRate, 99000);
      assert.equal(pricing.totalAmount, 99000);
      assert.equal(pricing.depositAmount, 24750); // 25%
      assert.equal(pricing.balanceDue, 74250); // 75%
      assert.equal(pricing.depositAmount + pricing.balanceDue, pricing.totalAmount);
    });

    test('Private Room: 2 travelers (1 private room) at PKR 104,000 package price', () => {
      const pricing = calculateBookingPricing({
        basePrice: 104000,
        quantity: 2,
        isTour: true,
        isPrivateRoom: true,
        depositPercent: 25,
      });

      assert.equal(pricing.baseRate, 104000); // 1 room covers 2 guests
      assert.equal(pricing.totalAmount, 104000);
      assert.equal(pricing.depositAmount, 26000); // 25%
      assert.equal(pricing.balanceDue, 78000); // 75%
    });

    test('Private Room: 4 travelers (2 private rooms) at PKR 104,000 per room', () => {
      const pricing = calculateBookingPricing({
        basePrice: 104000,
        quantity: 4,
        isTour: true,
        isPrivateRoom: true,
        depositPercent: 25,
      });

      assert.equal(pricing.baseRate, 208000); // 2 rooms * 104,000
      assert.equal(pricing.totalAmount, 208000);
      assert.equal(pricing.depositAmount, 52000); // 25%
      assert.equal(pricing.balanceDue, 156000); // 75%
    });

    test('Solo Room: 1 traveler at PKR 68,000 without duplicate single supplement', () => {
      const pricing = calculateBookingPricing({
        basePrice: 68000,
        quantity: 1,
        isTour: true,
        isSoloTraveler: false, // Solo room already includes private occupancy
        depositPercent: 25,
      });

      assert.equal(pricing.baseRate, 68000);
      assert.equal(pricing.singleSupplement, 0);
      assert.equal(pricing.totalAmount, 68000);
      assert.equal(pricing.depositAmount, 17000); // 25%
      assert.equal(pricing.balanceDue, 51000); // 75%
    });

    test('Group Discount: 5 travelers qualify for tier discount (PKR 42,000 vs PKR 49,500)', () => {
      const pricing = calculateBookingPricing({
        basePrice: 49500,
        quantity: 5,
        isTour: true,
        isPrivateRoom: false,
        depositPercent: 25,
        groupDiscounts: [
          { minPersons: 5, pricePerPerson: 42000 },
        ],
      });

      assert.equal(pricing.effectiveUnitPrice, 42000);
      assert.equal(pricing.baseRate, 210000); // 5 * 42,000
      assert.equal(pricing.groupDiscountSavings, 37500); // (49,500 - 42,000) * 5
      assert.equal(pricing.totalAmount, 210000);
      assert.equal(pricing.depositAmount, 52500); // 25% of 210,000
      assert.equal(pricing.balanceDue, 157500); // 75%
    });
  });
});
