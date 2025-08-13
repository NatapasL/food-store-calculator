import type { DiscountRule } from './discount-rule/discount-rule';
import type { FoodSet } from './food-set';

export interface Menu {
  [key: string]: FoodSet;
}

export interface Order {
  [key: string]: number;
}

export interface OrderOptions {
  hasMembershipCard?: boolean;
}

export class Calculator {
  constructor(
    private readonly menu: Menu,
    private readonly discounts: DiscountRule[]
  ) {}

  calculate(order: Order, options: OrderOptions = {}): number {
    const subtotal = this.sumOrderPrices(order);

    return this.applyDiscount(order, subtotal, options);
  }

  private sumOrderPrices(order: Order): number {
    return Object.entries(order).reduce((sum, [name, quantity]) => {
      const foodSet = this.menu[name];
      if (!foodSet) {
        throw new Error(`${name} is not in menu`);
      }

      return sum + foodSet.order(quantity);
    }, 0);
  }

  private applyDiscount(
    order: Order,
    subtotal: number,
    options: OrderOptions
  ): number {
    return this.discounts.reduce((remainingSubtotal, discount) => {
      const discountAmount = discount.calculate({
        order,
        subtotal: remainingSubtotal,
        orderOptions: options,
      });

      if (discountAmount > remainingSubtotal) {
        return 0;
      }

      return remainingSubtotal - discountAmount;
    }, subtotal);
  }
}
