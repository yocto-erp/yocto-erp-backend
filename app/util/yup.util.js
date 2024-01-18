import * as yup from 'yup';
import { isPhoneValid } from './phone.util';
import { hasText } from './string.util';

export const yupNumber = () => yup.number().typeError('Invalid');

export const phoneNumber = (countryCode = 'VN') =>
  yup.string().test(`phoneFormat`, 'Invalid phone number', function phoneValid(value) {
    const { path, createError } = this;
    if (hasText(value)) {
      try {
        isPhoneValid(value, countryCode);
        return true;
      } catch (error) {
        return createError({ path, message: 'Invalid phone number' });
      }
    }
    return true;
  });
