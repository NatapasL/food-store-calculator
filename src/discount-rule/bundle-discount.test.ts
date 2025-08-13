import { beforeEach, describe, expect, it } from 'bun:test';

import { Order } from '../calculator';
import { FoodSet } from '../food-set';
import { BundleDiscount, BundleItem } from './bundle-discount';

describe('BundleDiscount', () => {
  let redFootSet: FoodSet;
  let redBundle: BundleItem;

  let greenFootSet: FoodSet;
  let greenBundle: BundleItem;

  beforeEach(() => {
    redFootSet = new FoodSet('Red set', 10);
    redBundle = new BundleItem(redFootSet, 2, 10);

    greenFootSet = new FoodSet('Green set', 30);
    greenBundle = new BundleItem(greenFootSet, 3, 20);
  });

  describe('#calculate', () => {
    describe('when order contains items that are all eligible for bundle discounts', () => {
      it('calculates the total discount by summing discounts from each item', () => {
        const bundleDiscount = new BundleDiscount([redBundle, greenBundle]);
        const order: Order = {
          [redFootSet.name]: 2,
          [greenFootSet.name]: 4,
        };

        expect(bundleDiscount.calculate({ order })).toBe(20);
      });
    });

    describe('when an order contains a mix of eligible and ineligible items', () => {
      it('calculates discount only for the eligible items', () => {
        const bundleDiscount = new BundleDiscount([redBundle]);
        const order: Order = {
          [redFootSet.name]: 5,
          [greenFootSet.name]: 10,
        };

        expect(bundleDiscount.calculate({ order })).toBe(4);
      });
    });

    describe('when an eligible item quantity is not enough to trigger a discount', () => {
      it('calculates a discount of 0 for that item and sums the rest', () => {
        const bundleDiscount = new BundleDiscount([redBundle, greenBundle]);
        const order: Order = {
          [redFootSet.name]: 1,
          [greenFootSet.name]: 3,
        };

        expect(bundleDiscount.calculate({ order })).toBe(18);
      });
    });

    describe('when the order contains no items that match any bundle rules', () => {
      it('returns a total discount of 0', () => {
        const bundleDiscount = new BundleDiscount([redBundle, greenBundle]);
        const order: Order = {
          cherry: 10,
          date: 5,
        };

        expect(bundleDiscount.calculate({ order })).toBe(0);
      });
    });

    describe('when the order is empty', () => {
      it('returns a total discount of 0', () => {
        const bundleDiscount = new BundleDiscount([redBundle, greenBundle]);
        const order: Order = {};

        expect(bundleDiscount.calculate({ order })).toBe(0);
      });
    });
  });
});

describe('BundleItem', () => {
  let foodSet: FoodSet;

  beforeEach(() => {
    foodSet = new FoodSet('sample', 10);
  });

  describe('#constructor', () => {
    describe('bundleQuantity is negative', () => {
      it('throws an error', () => {
        expect(() => new BundleItem(foodSet, 0, 10)).toThrow(
          'bundleQuantity incorrect'
        );
      });
    });

    describe('discountPercentage less than 0', () => {
      it('throws an error', () => {
        expect(() => new BundleItem(foodSet, 10, -1)).toThrow(
          'discountPercentage incorrect'
        );
      });
    });

    describe('discountPercentage greater than 100', () => {
      it('throws an error', () => {
        expect(() => new BundleItem(foodSet, 10, 101)).toThrow(
          'discountPercentage incorrect'
        );
      });
    });
  });

  describe('#name', () => {
    it('returns the name of the food set', () => {
      expect(new BundleItem(foodSet, 10, 10).name).toBe(foodSet.name);
    });
  });

  describe('calculateDiscountAmount', () => {
    describe('when order quantity is an exact multiple of bundle quantity', () => {
      it('calculates discount correctly ', () => {
        const bundle = new BundleItem(foodSet, 3, 20);
        const discount = bundle.calculateDiscountAmount(6);
        expect(discount).toBe(12);
      });
    });

    describe('when order quantity is not an exact multiple', () => {
      it('ignores the remainder', () => {
        const bundle = new BundleItem(foodSet, 3, 10);
        const discount = bundle.calculateDiscountAmount(8);
        expect(discount).toBe(6);
      });
    });

    describe('when the order quantity is less than the bundle quantity', () => {
      it('returns 0 ', () => {
        const bundle = new BundleItem(foodSet, 3, 25);
        const discount = bundle.calculateDiscountAmount(2);
        expect(discount).toBe(0);
      });
    });

    describe('when the discount percentage is 0', () => {
      it('returns 0', () => {
        const bundle = new BundleItem(foodSet, 4, 0);
        const discount = bundle.calculateDiscountAmount(8);
        expect(discount).toBe(0);
      });
    });

    describe('when the discount percentage is 100', () => {
      it('returns the full amount', () => {
        const bundle = new BundleItem(foodSet, 4, 100);
        const discount = bundle.calculateDiscountAmount(8);
        expect(discount).toBe(80);
      });
    });
  });
});
