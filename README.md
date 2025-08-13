# food-store-calculator

# Usage

Entry point is at `./src/app.ts`.
For usage, you can uncomment lines 57 - 69

```ts
const order: Order = {
  [RED_SET_NAME]: 3,
  [GREEN_SET_NAME]: 2,
  [BLUE_SET_NAME]: 1,
  [YELLOW_SET_NAME]: 1,
  [PINK_SET_NAME]: 1,
  [PURPLE_SET_NAME]: 1,
  [ORANGE_SET_NAME]: 5,
};

const result = calculator.calculate(order, { hasMembershipCard: true });

console.log(result);
```

and then run with bun to see the result

```bash
bun run ./src/app.ts
```

# To install dependencies:

```bash
bun install
```

# To run:

```bash
bun run ./src/app.ts
```

This project was created using `bun init` in bun v1.1.22. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
