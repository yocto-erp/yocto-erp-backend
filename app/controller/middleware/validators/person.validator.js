import * as yup from 'yup';
import {validator, validatorType} from '../validation.middleware';

export const personValidator = validator(yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string()
    .email()
}), validatorType.BODY);
