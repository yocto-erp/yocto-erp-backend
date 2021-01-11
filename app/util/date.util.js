// import moment from 'moment';
import moment from 'moment-timezone';

export const DEFAULT_TIMEZONE = 'Asia/Hong_Kong';
export const MYSQL_HOURLY_FORMAT = '%Y-%m-%dT%H:00:00.000Z'

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
  }
}

export function getHourRangeFromLastMin(minutes) {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return getHourRange(date)
}
