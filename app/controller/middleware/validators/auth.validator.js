import * as yup from 'yup';
import {validator, validatorType} from '../validation.middleware';


export const authValidator = validator(yup.object().shape({
  password: yup.string().required('This field is required.'),
  rePassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('This field is required.')
}), validatorType.BODY);

export const mailValidator = validator(yup.object().shape({
  email: yup
    .string()
    .email('Invalid Email')
    .required('This field is required.')
}), validatorType.BODY)
