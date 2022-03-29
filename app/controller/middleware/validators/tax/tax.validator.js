import * as yup from 'yup';
import {validator, validatorType} from '../../validation.middleware';

export const taxValidator = validator(yup.object().shape({
  name: yup.string().max(250, 'Name max length 250 character').required('This field is required.'),
  shortName: yup.string().max(20, 'Name max length 20 character').required('This field is required.'),
  type: yup
    .number()
    .moreThan(0, 'Type is required')
    .required('Type is required'),
  amount: yup
    .number()
    .moreThan(0, 'Amount must larger than 0')
    .required('this field is required')
}), validatorType.BODY);
