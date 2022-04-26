// import moment from 'moment';
import moment from "moment-timezone";

export const DEFAULT_TIMEZONE = "Asia/Ho_Chi_Minh";
export const MYSQL_HOURLY_FORMAT = "%Y-%m-%dT%H:00:00.000Z";
export const MIN_DATE = new Date(1900, 0, 1, 0, 0, 0, 0);
export const DATE_TIME_FORMAT_WITH_TIMEZONE = "DD-MM-YYYY hh:mm:ss ZZ";
export const DATE_TIME_FORMAT = "DD-MM-YYYY hh:mm:ss";
export const DATE_FORMAT = "YYYY-MM-DD";

export function getIsoWeek() {
  const _moment = moment();
  return {
    week: _moment.isoWeek(),
    year: _moment.isoWeekYear()
  };
}

export function nextDays(days) {
  const _nextDate = moment().add(days, "days");
  return _nextDate.toDate();
}

export function addMonths(date, month) {
  return moment(date).add(month, "months").toDate();
}

export function addHours(date, hours) {
  return moment(date).add(hours, "hours").toDate();
}

export function differentMonth(date, date1) {
  return Math.ceil(moment(date).diff(moment(date1), "months", true));
}

export function getHourRange(date) {
  const hourBegin = date ? new Date(date.getTime()) : new Date();
  const hourTo = date ? new Date(date.getTime()) : new Date();
  hourBegin.setMinutes(0);
  hourBegin.setSeconds(0);
  hourBegin.setMilliseconds(0);
  hourTo.setMinutes(59);
  hourTo.setSeconds(59);
  hourTo.setMilliseconds(999);
  return {
    begin: hourBegin,
    end: hourTo
  };
}

export function getHourRangeFromLastMin(minutes) {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return getHourRange(date);
}

export const beginningDateStr = (dateStr) => {
  const rs = new Date(dateStr);
  rs.setHours(0);
  rs.setMinutes(0);
  rs.setMinutes(0);
  rs.setMilliseconds(0);
  return rs;
};

export const endDateStr = (dateStr) => {
  const rs = new Date(dateStr);
  rs.setHours(23);
  rs.setMinutes(59);
  rs.setMinutes(59);
  rs.setMilliseconds(999);
  return rs;
};

export function beginningOfDate(dateStr) {
  if (!dateStr || !dateStr.length) {
    return null;
  }
  const date = new Date(dateStr);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

export function endOfDate(dateStr) {
  if (!dateStr || !dateStr.length) {
    return null;
  }
  const date = new Date(dateStr);
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(50);
  date.setMilliseconds(999);
  return date;
}

export function formatDateTZ(date, timezone = "UTC", format = DATE_FORMAT) {
  if (!date) {
    return "";
  }
  return moment(date).tz(timezone).format(format);
}

export function getStartDateUtcOfTimezoneDate(date, tz) {
  return moment(date).tz(tz).startOf("date").toDate();
}

export function getEndDateUtcOfTimezoneDate(date, tz){
  return moment(date).tz(tz).endOf("date").toDate();
}

export const getDatesBetween = (startDate, endDate, includeEndDate) => {
  const dates = [];
  const currentDate = startDate;
  while (currentDate < endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  if (includeEndDate) dates.push(endDate);
  return dates;
};
