import numeral from 'numeral';
import moment from "moment";
import {GENDER} from "../../db/models/person";

const TIMESTAMP_FORMAT = 'YYYYDDMM_hhmmss';
export const BIRTHDAY_FORMAT = 'DD-MM-YYYY';

export function formatDateTime(d, format = TIMESTAMP_FORMAT) {
  if (!d) return '';
  return moment(d).format(format);
}

export function formatDate(d) {
  if (!d) return '';
  let month = d.getMonth();
  let day = d.getDate().toString();
  const year = d.getFullYear();
  month = (month + 1).toString();
  if (month.length === 1) {
    month = `0${month}`;
  }
  if (day.length === 1) {
    day = `0${day}`;
  }

  return `${day}-${month}-${year}`;
}

export function formatTemplateMoney(money, currency = 'VND', format = '0,0') {
  if (Number.isNaN(money)) return '';
  return `${numeral(money).format(format)} ${currency}`;
}

export function gender(sex) {
  switch (sex) {
    case GENDER.FEMALE:
      return 'nữ';
    case GENDER.MALE:
      return 'nam';
    default:
      return 'khác';
  }
}

export function personToPrintData(person) {
  if (!person) return {};
  return {
    id: person.id,
    firstName: person.firstName,
    lastName: person.lastName,
    gsm: person.gsm,
    email: person.email,
    address: person.address,
    birthday: formatDateTime(person.birthday, BIRTHDAY_FORMAT),
    sex: gender(person.sex),
    remark: person.remark
  }
}
