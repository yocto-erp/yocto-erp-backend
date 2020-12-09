import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export function isPhoneValid (phone) {
  const number = phoneUtil.parse(phone, 'KR');
  const existPhone = phoneUtil.isValidNumber(number);
  if (!existPhone) {
    throw new Error('Invalid phone');
  }
  return {
    countryCode: number.getCountryCode(),
    nationalNumber: `0${number.getNationalNumber()}`,
    e164: `${number.getCountryCode()}${number.getNationalNumber()}`
  };
}

