import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';

import { Calculator, Menu, Order, OrderOptions } from './calculator';
import { DiscountRule } from './discount-rule/discount-rule';
import { FoodSet } from './food-set';

const discountRuleCalculate = mock();
const anotherDiscountRuleCalculate = mock();

const discountRule: DiscountRule = {
  calculate: discountRuleCalculate,
};

const anotherDiscountRule: DiscountRule = {
  calculate: anotherDiscountRuleCalculate,
};

describe('Calculator', () => {
  let menu: Menu;
  let redSet: FoodSet;
  let greenSet: FoodSet;

  beforeEach(() => {
    redSet = new FoodSet('Red set', 50);
    greenSet = new FoodSet('Green set', 20);

    menu = {
      [redSet.name]: redSet,
      [greenSet.name]: greenSet,
    };
  });

  afterEach(() => {
    discountRuleCalculate.mockReset();
    anotherDiscountRuleCalculate.mockReset();
  });

  describe('#calculate', () => {
    describe('when a valid order is provided', () => {
      it('calculates the final price by subtracting all discounts from the subtotal', () => {
        const calculator = new Calculator(menu, [
          discountRule,
          anotherDiscountRule,
        ]);
        const order: Order = {
          [redSet.name]: 2,
          [greenSet.name]: 3,
        };

        discountRuleCalculate.mockReturnValue(15);
        anotherDiscountRuleCalculate.mockReturnValue(5);

        const finalPrice = calculator.calculate(order);

        expect(finalPrice).toBe(140);
      });

      it('passes the correct subtotal, order, and options to the discount rules', () => {
        const calculator = new Calculator(menu, [discountRule]);
        const order: Order = { [redSet.name]: 1 };
        const orderOptions: OrderOptions = { hasMembershipCard: true };

        discountRuleCalculate.mockReturnValue(0);

        calculator.calculate(order, orderOptions);

        expect(discountRule.calculate).toHaveBeenCalledWith({
          order,
          subtotal: 50,
          orderOptions,
        });
        expect(discountRule.calculate).toHaveBeenCalledTimes(1);
      });
    });

    describe('when there are no discount rules', () => {
      it('returns the full subtotal', () => {
        const calculator = new Calculator(menu, []); // No discounts
        const order: Order = {
          [redSet.name]: 1,
          [greenSet.name]: 2,
        };

        expect(calculator.calculate(order)).toBe(90);
      });
    });

    describe('when the order is empty', () => {
      it('returns 0', () => {
        const calculator = new Calculator(menu, [discountRule]);
        const order: Order = {};
        discountRuleCalculate.mockReturnValue(0);

        expect(calculator.calculate(order)).toBe(0);

        expect(discountRule.calculate).toHaveBeenCalledWith({
          order: {},
          subtotal: 0,
          orderOptions: {},
        });
      });
    });

    describe('when an item in the order is not in the menu', () => {
      it('throws an error', () => {
        const calculator = new Calculator(menu, []);
        const invalidOrder: Order = { 'Blue set': 1 };

        expect(() => calculator.calculate(invalidOrder)).toThrow(
          'Blue set is not in menu'
        );
      });
    });
  });
});
