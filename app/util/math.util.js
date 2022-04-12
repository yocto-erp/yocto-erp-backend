import { create, all } from "mathjs";

const config = {
  // Default type of number
  // Available options: 'number' (default), 'BigNumber', or 'Fraction'
  number: "BigNumber",

  // Number of significant digits for BigNumbers
  precision: 20
};
const math = create(all, config);

export const plus = (num1, num2) =>
  math.add(num1, num2);

export const divide = (num1, num2) =>
  math.divide(num1, num2);

export const multiply = (num1, num2) =>
  math.multiply(num1, num2);
export const subtract = (num1, num2) =>
  math.subtract(num1, num2);

export const compare = (num1, num2) =>
  math.compare(num1, num2);

export const isNumber = num1 => math.isNumber(num1) || math.isBigNumber(num1);

export const fromBigNumberJson = obj => {
  return math.bignumber(obj.value);
};

export const toBigNumber = (t) => math.bignumber(t)

export const formatNumberDB = bigNumber => {
  return math.format(bigNumber, {notation: "fixed", precision: 2})
}

