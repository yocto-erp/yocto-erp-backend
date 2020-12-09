import * as yup from 'yup';
import { validator, validatorType } from '../validation.middleware';

export const inventoryValidator = validator(yup.object().shape({
  warehouseId: yup.number().required('This field is required.'),
  name: yup.string().max(250, 'Name max string 250').required('This field is required.'),
  details: yup.array().of(yup.object({
    productId: yup.number().required('This field is required.'),
    unitId: yup.number().required('This field is required.'),
    quantity: yup.number().moreThan(0, 'Quantity must larger than 0').required('This field is required.')
  })).required('This field is required.')
}), validatorType.BODY);
