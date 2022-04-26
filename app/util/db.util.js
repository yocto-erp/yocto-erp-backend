import {Op} from 'sequelize'
import {hasText} from "./string.util";
import {
  beginningOfDate,
  DEFAULT_TIMEZONE,
  endOfDate,
  getEndDateUtcOfTimezoneDate,
  getStartDateUtcOfTimezoneDate
} from "./date.util";

export function buildDateTimezoneRangeQuery(fromDate, toDate, tz = DEFAULT_TIMEZONE) {
  if (hasText(fromDate) && hasText(toDate)) {
    return {
      [Op.and]: {
        [Op.gte]: getStartDateUtcOfTimezoneDate(new Date(fromDate), tz),
        [Op.lte]: getEndDateUtcOfTimezoneDate(new Date(toDate), tz)
      }
    }
  }
  if (hasText(fromDate)) {
    return {
      [Op.gte]: getStartDateUtcOfTimezoneDate(new Date(fromDate), tz)
    }
  }
  if (hasText(toDate)) {
    return {
      [Op.lte]: getEndDateUtcOfTimezoneDate(new Date(toDate), tz)
    }
  }
  return null;
}

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
