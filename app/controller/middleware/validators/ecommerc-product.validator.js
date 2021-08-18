import * as yup from 'yup';
import { validator, validatorType } from '../validation.middleware';
import { ECOMMERCE_PAYMENT_METHOD } from '../../../db/models/ecommerce/ecommerce-payment-method';

export const ecommerceProductValidator = validator(yup.object().shape({
  product: yup.object().required('Product is required.'),
  unit: yup.object().required('Unit is required.'),
  webDisplayName: yup.string().max(250).required('Web display name is required.'),
  shortName: yup.string().max(64).required('Short name is required'),
  price: yup.number().required()
}), validatorType.BODY);

export const ecommerceSettingValidator = validator(yup.object().shape({
  paymentMethodId: yup.number().required('Payment Method is required'),
  setting: yup.mixed().test('isValid', 'Invalid Setting', (value, ctx) => {
    console.log(ctx)
    const { paymentMethodId } = ctx.parent;
    if (paymentMethodId === ECOMMERCE_PAYMENT_METHOD.DIRECT_TRANSFER) {
      if (!value || !value.trim().length) return false;
    }
    return true;
  })
}), validatorType.BODY);
