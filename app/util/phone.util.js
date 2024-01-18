import { PhoneNumberUtil } from 'google-libphonenumber';
import { hasText } from './string.util';

const phoneUtil = PhoneNumberUtil.getInstance();
const DEFAULT_COUNTRY = 'VN';

export function isPhoneValid(phone, country = DEFAULT_COUNTRY) {
  if (!phone || !hasText(phone)) {
    throw new Error(`Invalid phone ${phone}`);
  }
  // eslint-disable-next-line no-underscore-dangle
  let _phone = phone;
  const phone2Prefix = phone.substring(0, 2);
  if (phone2Prefix !== '00') {
    const phone1Prefix = phone[0];
    if (phone1Prefix !== '0') {
      _phone = `+${phone}`;
    }
  }
  const number = phoneUtil.parse(_phone, country);
  if (!phoneUtil.isValidNumber(number)) {
    throw new Error(`Invalid phone ${phone}`);
  }
  return {
    countryCode: number.getCountryCode(),
    nationalNumber: `0${number.getNationalNumber()}`,
    e164: `${number.getCountryCode()}${number.getNationalNumber()}`
  };
}
