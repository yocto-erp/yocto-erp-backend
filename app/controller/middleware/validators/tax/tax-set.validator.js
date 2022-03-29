import * as yup from 'yup';
import {validator, validatorType} from '../../validation.middleware';

export const taxSetValidator = validator(yup.object().shape({
  name: yup.string().max(100, 'Name max length 100 character').required('This field is required.'),
  taxes: yup.array().of(yup.object({
    id: yup.number().required('This field is required.'),
    name: yup.string().required('This field is required.')
  })).required('This field is required.')
}), validatorType.BODY);
