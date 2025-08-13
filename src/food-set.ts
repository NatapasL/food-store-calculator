export class FoodSet {
  constructor(readonly name: string, readonly unitPrice: number) {}

  order(quantity: number): number {
    return this.unitPrice * quantity;
  }
}
