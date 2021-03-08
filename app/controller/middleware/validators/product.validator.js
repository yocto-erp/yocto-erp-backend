import * as yup from 'yup';
import {validator, validatorType} from '../validation.middleware';

export const productUnitValidator = validator(yup.array().of(yup.object({
  name: yup.string().max(50,'Name max string 50').required('This field is required.'),
  rate: yup.number().moreThan(0,'Rate must larger than 0').required('This field is required.')
})), validatorType.BODY);


export const productValidator = validator(yup.object().shape({
  name: yup.string().max(250, 'Name max string 250').required('This field is required.'),
  priceBaseUnit: yup.number().nullable(),
  units: yup.array().of(yup.object({
    name: yup.string().max(50).required('This field is required.'),
    rate: yup.number().moreThan(0,'Rate must larger than 0').required('This field is required.')
  })).required('This field is required.')
}), validatorType.BODY);
