import * as yup from 'yup';
import { validator, validatorType } from '../validation.middleware';

export const personValidator = validator(yup.object().shape({
  firstName: yup.string().required('This field is required.'),
  lastName: yup.string().required('This field is required.'),
  email: yup.string()
    .email('Invalid Email.')
    .required('This field is required.')
}), validatorType.BODY);
