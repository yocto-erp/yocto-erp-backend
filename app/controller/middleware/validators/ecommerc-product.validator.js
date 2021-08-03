import * as yup from 'yup';
import { validator, validatorType } from '../validation.middleware';

export const ecommerceProductValidator = validator(yup.object().shape({
  product: yup.object().required('Product is required.'),
  unit: yup.object().required('Unit is required.'),
  webDisplayName: yup.string().max(250).required('Web display name is required.'),
  shortName: yup.string().max(64).required('Short name is required'),
  price: yup.number().required()
}), validatorType.BODY);
