import * as yup from 'yup';
import {validator, validatorType} from '../../validation.middleware';

export const studentClassValidator = validator(yup.object().shape({
  name: yup.string().max(250, 'Name max string 250').required('This field is required.'),
  tuitionFeePerMonth: yup.number().moreThan(0, 'Tuition Fee must larger than 0')
    .required('this field is required'),
  absentFeeReturnPerDay: yup.number().moreThan(0, 'Tuition Fee must larger than 0')
    .required('this field is required'),
  feePerTrialDay: yup.number().required('this field is required'),
  mealFeePerMonth: yup.number().moreThan(0, 'Tuition Fee must larger than 0'),
  mealFeeReturnPerDay: yup.number()
}), validatorType.BODY);
