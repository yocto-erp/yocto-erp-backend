import { randomUUID } from 'crypto';
import numeral from 'numeral';

export function generateRandomCode(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function generateRandomUpperCode(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < length; i += 1)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function formatMoney(amount, currencyCode) {
  return `${numeral(amount).format('0,0.00[000000]')} ${currencyCode}`;
}

export function binary2hex(obj) {
  return Buffer.from(obj, 'hex').toString('hex');
}

export function hex2binary(obj) {
  return Buffer.from(obj, 'hex');
}

export function hasText(str) {
  return str && str.length && str.trim().length;
}

export function toNonAccentVietnamese(_str) {
  let str = _str;
  str = str.replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A');
  str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
  str = str.replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/, 'E');
  str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
  str = str.replace(/[ÌÍỊỈĨ]/g, 'I');
  str = str.replace(/[ìíịỉĩ]/g, 'i');
  str = str.replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O');
  str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
  str = str.replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U');
  str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
  str = str.replace(/[ỲÝỴỶỸ]/g, 'Y');
  str = str.replace(/[ỳýỵỷỹ]/g, 'y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/[\u0300\u0301\u0303\u0309\u0323]/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/[\u02C6\u0306\u031B]/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
}

export const parseNameInfo = (fullName) => {
  const splitFullName = fullName.trim().split(' ');
  let firstName = '';
  const lastName = splitFullName[splitFullName.length - 1];
  if (splitFullName.length > 1) {
    splitFullName.splice(splitFullName.length - 1, 1);
    firstName = splitFullName.join(' ');
  }
  return {
    firstName, lastName
  };
};

export const paddingLeft = (str, length, character = '0') => {
  if (length < str.length) {
    return str;
  }
  let rs = str;
  for (let i = 0; i < length - str.length; i += 1) {
    rs = `${character}${rs}`;
  }
  return rs;
};

export const uuidV4 = ()=>{
  return randomUUID()
}
