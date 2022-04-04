import {Op} from 'sequelize'
import {hasText} from "./string.util";
import {beginningOfDate, endOfDate} from "./date.util";

export function buildDateRangeQuery(fromDate, toDate) {
  if (hasText(fromDate) && hasText(toDate)) {
    return {
      [Op.and]: {
        [Op.gte]: beginningOfDate(fromDate),
        [Op.lte]: endOfDate(toDate)
      }
    }
  }
  if (hasText(fromDate)) {
    return {
      [Op.gte]: beginningOfDate(fromDate)
    }
  }
  if (hasText(toDate)) {
    return {
      [Op.lte]: endOfDate(toDate)
    }
  }
  return null;
}

export function buildDateObjRangeQuery(fromDate, toDate) {
  if (fromDate && toDate) {
    return {
      [Op.and]: {
        [Op.gte]: fromDate,
        [Op.lte]: toDate
      }
    }
  }
  if (fromDate) {
    return {
      [Op.gte]: fromDate
    }
  }
  if (toDate) {
    return {
      [Op.lte]: toDate
    }
  }
  return null;
}
