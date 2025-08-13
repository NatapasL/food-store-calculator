import type { Order, OrderOptions } from '../calculator';

export interface DiscountRule {
  calculate(args: {
    order: Order;
    subtotal: number;
    orderOptions: OrderOptions;
  }): number;
}
