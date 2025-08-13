import { beforeEach, describe, expect, it } from 'bun:test';

import { FoodSet } from './food-set';

describe('FoodSet', () => {
  let foodSet: FoodSet;
  const unitPrice = 50;

  beforeEach(() => {
    foodSet = new FoodSet('Red set', unitPrice);
  });

  describe('#constructor', () => {
    it('assigns the name and unitPrice properties correctly', () => {
      expect(foodSet.name).toBe('Red set');
      expect(foodSet.unitPrice).toBe(unitPrice);
    });
  });

  describe('#order', () => {
    describe('when the quantity is a positive number', () => {
      it('returns the correct total price', () => {
        const quantity = 3;
        expect(foodSet.order(quantity)).toBe(150);
      });
    });

    describe('when the quantity is one', () => {
      it('returns the unit price', () => {
        const quantity = 1;
        expect(foodSet.order(quantity)).toBe(unitPrice);
      });
    });

    describe('when the quantity is zero', () => {
      it('returns zero', () => {
        const quantity = 0;
        expect(foodSet.order(quantity)).toBe(0);
      });
    });
  });
});
