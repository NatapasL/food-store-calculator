import { describe, expect, it } from 'bun:test';
import { calculator } from './app';
import { Order, OrderOptions } from './calculator';
import { GREEN_SET_NAME, ORANGE_SET_NAME, RED_SET_NAME } from './constants';

describe('app', () => {
  describe('when order 1 red set and 1 green set and has membership card', () => {
    const order: Order = {
      [RED_SET_NAME]: 1,
      [GREEN_SET_NAME]: 1,
    };
    const orderOptions: OrderOptions = { hasMembershipCard: true };

    it('calculates price correctly with 10% discount', () => {
      const finalPrice = calculator.calculate(order, orderOptions);

      expect(finalPrice).toBe(81);
    });
  });

  describe('when order 5 orange sets', () => {
    const order: Order = {
      [ORANGE_SET_NAME]: 5,
    };

    it('discounts exactly 4 of orange sets', () => {
      const finalPrice = calculator.calculate(order);

      expect(finalPrice).toBe(576);
    });
  });
});
