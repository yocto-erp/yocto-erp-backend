// import moment from 'moment';
import moment from 'moment-timezone';
import {appLog} from '../config/winston';

export const DEFAULT_TIMEZONE = 'Asia/Hong_Kong';
/**
 * Hong Kong
 * @type {number}
 */
const TIMEZONE = -8;

export function getIsoWeek() {
  const _moment = moment();
  return {
    week: _moment.isoWeek(),
    year: _moment.isoWeekYear()
  };
}

export function nextDays(days) {
  const _nextDate = moment().add(days, 'days');
  return _nextDate.toDate();
}

export function addMonths(date, month) {
  return moment(date).add(month, 'months').toDate();
}

export function addHours(date, hours) {
  return moment(date).add(hours, 'hours').toDate();
}

export function differentMonth(date, date1) {
  return Math.ceil(moment(date).diff(moment(date1), 'months', true));
}

export function getDifferentTimeZone() {
  const now = moment();
  const localOffset = now.utcOffset();
  now.tz(DEFAULT_TIMEZONE); // your time zone, not necessarily the server's
  const centralOffset = now.utcOffset();
  const diffInMinutes = localOffset - centralOffset;
  return diffInMinutes * 60000;
}

export function getCurrentPeriod() {
  const differentTimezoneMs = getDifferentTimeZone();

  let thisWeekWed = moment().day(3).toDate();
  thisWeekWed.setHours(0);
  thisWeekWed.setMinutes(0);
  thisWeekWed.setSeconds(0);
  thisWeekWed.setMilliseconds(0);
  let lastWeekWed = moment().day(-4).toDate();
  lastWeekWed.setHours(0);
  lastWeekWed.setMinutes(0);
  lastWeekWed.setSeconds(0);
  lastWeekWed.setMilliseconds(0);

  if (new Date() > thisWeekWed) {
    lastWeekWed = moment().day(3).toDate();
    lastWeekWed.setHours(0);
    lastWeekWed.setMinutes(0);
    lastWeekWed.setSeconds(0);
    lastWeekWed.setMilliseconds(0);
    thisWeekWed = moment().day(10).toDate();
    thisWeekWed.setHours(0);
    thisWeekWed.setMinutes(0);
    thisWeekWed.setSeconds(0);
    thisWeekWed.setMilliseconds(0);
  }

  return {
    from: new Date(lastWeekWed.getTime() + differentTimezoneMs),
    to: new Date(thisWeekWed.getTime() + differentTimezoneMs)
  };
}

export function getLastPeriod() {

  const differentTimezoneMs = getDifferentTimeZone();

  let thisWeekWed = moment().day(3).toDate();
  thisWeekWed.setHours(0);
  thisWeekWed.setMinutes(0);
  thisWeekWed.setSeconds(0);
  thisWeekWed.setMilliseconds(0);
  let lastWeekWed = moment().day(-4).toDate();
  lastWeekWed.setHours(0);
  lastWeekWed.setMinutes(0);
  lastWeekWed.setSeconds(0);
  lastWeekWed.setMilliseconds(0);

  appLog.info(`This Week Wed: ${thisWeekWed}`);
  appLog.info(`Last Week Wed: ${lastWeekWed}`);
  appLog.info(`Current date: ${new Date()}`);

  if (new Date() < thisWeekWed) {
    lastWeekWed = moment().day(-11).toDate();
    lastWeekWed.setHours(0);
    lastWeekWed.setMinutes(0);
    lastWeekWed.setSeconds(0);
    lastWeekWed.setMilliseconds(0);
    thisWeekWed = moment().day(-4).toDate();
    thisWeekWed.setHours(0);
    thisWeekWed.setMinutes(0);
    thisWeekWed.setSeconds(0);
    thisWeekWed.setMilliseconds(0);
  }

  return {
    from: new Date(lastWeekWed.getTime() + differentTimezoneMs),
    to: new Date(thisWeekWed.getTime() + differentTimezoneMs)
  };
}

/**
 * 8 AM: 21 - 23
 * 9 AM: 21 - 23
 * 10 AM: 23 - 01
 */
export function getCurrentPeriod1(date) {

  const currentDate = (date || new Date()).getTime();
  const timeRange = 3600000 * 2;
  const TZ = (TIMEZONE * 3600000);
  const time = Math.floor((currentDate + TZ) / timeRange);

  const from = new Date(time * timeRange - TZ);

  return {
    from: from,
    to: new Date(from.getTime() + timeRange)
  };
}

export function getLastPeriod1(date) {
  const currentDate = (date || new Date()).getTime();

  const timeRange = 3600000 * 2;
  const TZ = (TIMEZONE * 3600000);
  const time = Math.floor((currentDate + TZ) / timeRange);

  const toDate = new Date(time * timeRange - TZ);

  return {
    from: new Date(toDate.getTime() - timeRange),
    to: toDate
  };
}

export function formatDate(d) {
  // get the month
  let month = d.getMonth();
  // get the day
  // convert day to string
  let day = d.getDate().toString();
  // get the year
  let year = d.getFullYear();

  // pull the last two digits of the year
  year = year.toString().substr(-2);

  // increment month by 1 since it is 0 indexed
  // converts month to a string
  month = (month + 1).toString();

  // if month is 1-9 pad right with a 0 for two digits
  if (month.length === 1) {
    month = `0${month}`;
  }

  // if day is between 1-9 pad right with a 0 for two digits
  if (day.length === 1) {
    day = `0${day}`;
  }

  // return the string "MMddyy"
  return year + month + day;
}
