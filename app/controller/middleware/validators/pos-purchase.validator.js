import * as yup from 'yup';
import { validator, validatorType } from '../validation.middleware';

export const posOrderValidator = validator(yup.object().shape({
  name: yup.string().max(150, 'Name max string 150').required('This field is required.'),
  customer: yup.object().required(),
  products: yup.array().of(yup.object({
    product: yup.object().required('This field is required.'),
    qty: yup.number().moreThan(0,'Quantity must larger than 0')
  })).required('This field is required.')
}), validatorType.BODY);
