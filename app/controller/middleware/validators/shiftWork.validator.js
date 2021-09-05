import * as yup from 'yup';
import { validator, validatorType } from '../validation.middleware';

export const shiftWorkValidator = validator(yup.object().shape({

  name: yup.string().max(250,'Name max string 250').required('This field is required.'),
  personId: yup
    .number()
    .moreThan(0, 'Amount must larger than 0')
    .required('this field is required')
}), validatorType.BODY);
