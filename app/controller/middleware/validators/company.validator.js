import * as yup from 'yup';
import {validator, validatorType} from '../validation.middleware';

export const companyValidator = validator(yup.object().shape({
  name: yup.string().max(250).required(),
  email: yup.string().email()
}), validatorType.BODY);
