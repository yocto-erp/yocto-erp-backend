import * as yup from 'yup';
import { validator, validatorType } from '../validation.middleware';

export const shopValidator = validator(yup.object().shape({
  name: yup.string().max(250,'Name max string 250').required('This field is required.'),
  address: yup.string().max(250,'Address max string 250'),
  phone: yup.string().max(250,'Phone max string 20')
}), validatorType.BODY);
