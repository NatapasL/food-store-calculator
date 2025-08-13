import { Calculator, Menu } from './calculator';
import {
  BLUE_SET_NAME,
  BLUE_SET_PRICE,
  BUNDLE_DISCOUNT_PERCENTAGE,
  BUNDLE_QUANTITY,
  GREEN_SET_NAME,
  GREEN_SET_PRICE,
  MEMBERSHIP_CARD_DISCOUNT_PERCENTAGE,
  ORANGE_SET_NAME,
  ORANGE_SET_PRICE,
  PINK_SET_NAME,
  PINK_SET_PRICE,
  PURPLE_SET_NAME,
  PURPLE_SET_PRICE,
  RED_SET_NAME,
  RED_SET_PRICE,
  YELLOW_SET_NAME,
  YELLOW_SET_PRICE,
} from './constants';
import { BundleDiscount, BundleItem } from './discount-rule/bundle-discount';
import { DiscountRule } from './discount-rule/discount-rule';
import { MembershipCardDiscount } from './discount-rule/membership-card-discount';
import { FoodSet } from './food-set';

const redSet = new FoodSet(RED_SET_NAME, RED_SET_PRICE);
const greenSet = new FoodSet(GREEN_SET_NAME, GREEN_SET_PRICE);
const blueSet = new FoodSet(BLUE_SET_NAME, BLUE_SET_PRICE);
const yellowSet = new FoodSet(YELLOW_SET_NAME, YELLOW_SET_PRICE);
const pinkSet = new FoodSet(PINK_SET_NAME, PINK_SET_PRICE);
const purpleSet = new FoodSet(PURPLE_SET_NAME, PURPLE_SET_PRICE);
const orangeSet = new FoodSet(ORANGE_SET_NAME, ORANGE_SET_PRICE);

const menu = [
  redSet,
  greenSet,
  blueSet,
  yellowSet,
  pinkSet,
  purpleSet,
  orangeSet,
].reduce<Menu>((acc, cur) => ((acc[cur.name] = cur), acc), {});

const discountRules: DiscountRule[] = [
  new BundleDiscount([
    new BundleItem(orangeSet, BUNDLE_QUANTITY, BUNDLE_DISCOUNT_PERCENTAGE),
    new BundleItem(pinkSet, BUNDLE_QUANTITY, BUNDLE_DISCOUNT_PERCENTAGE),
    new BundleItem(greenSet, BUNDLE_QUANTITY, BUNDLE_DISCOUNT_PERCENTAGE),
  ]),
  new MembershipCardDiscount(MEMBERSHIP_CARD_DISCOUNT_PERCENTAGE),
];

export const calculator = new Calculator(menu, discountRules);
