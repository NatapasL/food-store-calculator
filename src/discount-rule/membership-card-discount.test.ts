import { describe, expect, it } from 'bun:test';

import { OrderOptions } from '../calculator';
import { MembershipCardDiscount } from './membership-card-discount';

describe('MembershipCardDiscount', () => {
  describe('#constructor', () => {
    describe('when discountPercentage is less than 0', () => {
      it('throws an error', () => {
        expect(() => new MembershipCardDiscount(-1)).toThrow(
          'discountPercentage incorrect'
        );
      });
    });

    describe('when discountPercentage is greater than 100', () => {
      it('throws an error', () => {
        expect(() => new MembershipCardDiscount(101)).toThrow(
          'discountPercentage incorrect'
        );
      });
    });

    describe('when discountPercentage is valid', () => {
      it('does not throw an error', () => {
        expect(() => new MembershipCardDiscount(0)).not.toThrow();
        expect(() => new MembershipCardDiscount(50)).not.toThrow();
        expect(() => new MembershipCardDiscount(100)).not.toThrow();
      });
    });
  });

  describe('#calculate', () => {
    const subtotal = 1000;

    describe('when the order has a membership card', () => {
      it('calculates the discount based on the subtotal', () => {
        const discountRule = new MembershipCardDiscount(10);
        const orderOptions: OrderOptions = { hasMembershipCard: true };

        expect(discountRule.calculate({ subtotal, orderOptions })).toBe(100);
      });
    });

    describe('when the order does not have a membership card', () => {
      it('returns a discount of 0', () => {
        const discountRule = new MembershipCardDiscount(10);
        const orderOptions: OrderOptions = { hasMembershipCard: false };

        expect(discountRule.calculate({ subtotal, orderOptions })).toBe(0);
      });
    });

    describe('when the membership card status is not specified', () => {
      it('returns a discount of 0', () => {
        const discountRule = new MembershipCardDiscount(10);
        const orderOptions: OrderOptions = {};

        expect(discountRule.calculate({ subtotal, orderOptions })).toBe(0);
      });
    });

    describe('when the discount percentage is 0', () => {
      it('returns a discount of 0 even with a membership card', () => {
        const discountRule = new MembershipCardDiscount(0);
        const orderOptions: OrderOptions = { hasMembershipCard: true };

        expect(discountRule.calculate({ subtotal, orderOptions })).toBe(0);
      });
    });

    describe('when the discount percentage is 100', () => {
      it('returns the full subtotal as discount when card is present', () => {
        const discountRule = new MembershipCardDiscount(100);
        const orderOptions: OrderOptions = { hasMembershipCard: true };

        expect(discountRule.calculate({ subtotal, orderOptions })).toBe(1000);
      });
    });
  });
});
