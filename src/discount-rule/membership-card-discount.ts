import { applyPercentage } from '../helpers';

import type { OrderOptions } from '../calculator';
import type { DiscountRule } from './discount-rule';

export class MembershipCardDiscount implements DiscountRule {
  constructor(private readonly discountPercentage: number) {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error('discountPercentage incorrect');
    }
  }

  calculate({
    subtotal,
    orderOptions,
  }: {
    subtotal: number;
    orderOptions: OrderOptions;
  }): number {
    if (!orderOptions.hasMembershipCard) {
      return 0;
    }

    return applyPercentage(this.discountPercentage, subtotal);
  }
}
