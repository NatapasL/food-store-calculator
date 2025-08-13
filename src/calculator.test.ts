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
    describe('when multiple discounts are applied', () => {
      it('applies them sequentially, passing the reduced subtotal to subsequent rules', () => {
        const calculator = new Calculator(menu, [
          discountRule,
          anotherDiscountRule,
        ]);
        const order: Order = {
          [redSet.name]: 4,
        };
        const orderOptions: OrderOptions = { hasMembershipCard: true };

        discountRuleCalculate.mockReturnValue(20);
        anotherDiscountRuleCalculate.mockReturnValue(10);

        const finalPrice = calculator.calculate(order, orderOptions);

        expect(finalPrice).toBe(170);

        expect(discountRuleCalculate).toHaveBeenCalledWith({
          order,
          subtotal: 200,
          orderOptions,
        });

        expect(anotherDiscountRuleCalculate).toHaveBeenCalledWith({
          order,
          subtotal: 180,
          orderOptions,
        });
      });
    });

    describe('when a discount amount exceeds the remaining subtotal', () => {
      it('caps the final price at 0 and does not go negative', () => {
        const calculator = new Calculator(menu, [discountRule]);
        const order: Order = { [greenSet.name]: 1 };

        discountRuleCalculate.mockReturnValue(100);

        const finalPrice = calculator.calculate(order);

        expect(finalPrice).toBe(0);
      });
    });

    describe('when there are no discount rules', () => {
      it('returns the full subtotal', () => {
        const calculator = new Calculator(menu, []);
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

        expect(discountRuleCalculate).toHaveBeenCalledWith({
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
