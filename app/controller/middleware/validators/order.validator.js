import * as yup from 'yup';
import {validator, validatorType} from '../validation.middleware';

export const orderValidator = validator(yup.object().shape({
  name: yup.string().max(150).required(),
  details: yup.array().of(yup.object({
    product: yup.object().required(),
    unit: yup.object().required(),
    price: yup.number().moreThan(0).required(),
    quantity: yup.number().moreThan(0).required()
  })).required()
}), validatorType.BODY);
