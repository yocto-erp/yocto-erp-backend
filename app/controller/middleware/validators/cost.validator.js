import * as yup from 'yup';
import { validator, validatorType } from '../validation.middleware';


export const costValidator = validator(yup.object().shape({
  name: yup.string().required('this field is required'),
  amount: yup
    .number()
    .moreThan(0, 'Amount must larger than 0')
    .required('this field is required')
}), validatorType.BODY);
