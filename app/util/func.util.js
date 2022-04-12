import isArray from "lodash/isArray";

const isArrayHasLength = (arr) => {
  return arr && isArray(arr) && arr.length;
};

export {
  isArray,
  isArrayHasLength
};
