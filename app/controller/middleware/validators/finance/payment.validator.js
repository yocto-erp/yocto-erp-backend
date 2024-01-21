import * as yup from 'yup';
import { validator, validatorType } from '../../validation.middleware';
import { PAYMENT_METHOD_TYPE } from '../../../../db/models/payment/payment-method-setting';
import { yupPayOS } from './payos.validator';

export const paymentValidator = validator(yup.object().shape({
  name: yup.string().required(),
  paymentTypeId: yup.number().required('Payment Method is required'),
  setting: yup.object().when("paymentTypeId", {
    is: val => Number(val) === PAYMENT_METHOD_TYPE.PAYOS,
    then: yupPayOS.required(),
    otherwise: yup.object().nullable(),
  }),
}), validatorType.BODY);
