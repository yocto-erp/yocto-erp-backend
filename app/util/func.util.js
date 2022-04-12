import isArray from "lodash/isArray";

const isArrayHasLength = (arr) => {
  return isArray(arr) && arr.length;
};

export {
  isArray,
  isArrayHasLength
};
