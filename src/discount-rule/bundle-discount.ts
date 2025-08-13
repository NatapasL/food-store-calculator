import { applyPercentage } from '../helpers';

import type { Order } from '../calculator';
import type { FoodSet } from '../food-set';
import type { DiscountRule } from './discount-rule';

export class BundleDiscount implements DiscountRule {
  private readonly bundleItems = new Map<string, BundleItem>([]);

  constructor(bundleItems: BundleItem[]) {
    for (const bundleItem of bundleItems) {
      this.bundleItems.set(bundleItem.name, bundleItem);
    }
  }

  calculate({ order }: { order: Order }): number {
    return Object.entries(order).reduce((sum, [name, quantity]) => {
      const bundleItem = this.bundleItems.get(name);
      if (!bundleItem) return sum;

      return sum + bundleItem.calculateDiscountAmount(quantity);
    }, 0);
  }
}

export class BundleItem {
  constructor(
    private readonly item: FoodSet,
    private readonly bundleQuantity: number,
    private readonly discountPercentage: number
  ) {
    if (bundleQuantity <= 0) {
      throw new Error('bundleQuantity incorrect');
    }

    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error('discountPercentage incorrect');
    }
  }

  get name() {
    return this.item.name;
  }

  calculateDiscountAmount(orderQuantity: number): number {
    const discountQuantity =
      orderQuantity - (orderQuantity % this.bundleQuantity);

    return applyPercentage(
      this.discountPercentage,
      discountQuantity * this.item.unitPrice
    );
  }
}
