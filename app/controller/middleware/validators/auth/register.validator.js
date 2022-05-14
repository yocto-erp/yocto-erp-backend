import * as yup from 'yup';
import { validator, validatorType } from "../../validation.middleware";

export const registerValidator = validator(yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  password: yup.string().required('This field is required.'),
  email: yup
    .string()
    .email()
    .required('This field is required.')
}), validatorType.BODY);
