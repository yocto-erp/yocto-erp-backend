import * as yup from 'yup';
import { validator, validatorType } from '../validation.middleware';

export const orderValidator = validator(yup.object().shape({
  name: yup.string().max(150, 'Name max string 150').required('This field is required.'),
  details: yup.array().of(yup.object({
    productId: yup.number().required('This field is required.'),
    unitId: yup.number().required('This field is required.'),
    price: yup.number().moreThan(0,'Price must larger than 0').required('This field is required.'),
    quantity: yup.number().moreThan(0,'Quantity must larger than 0').required('This field is required.')
  })).required('This field is required.')
}), validatorType.BODY);
