import * as Yup from 'yup';
import { validator, validatorType } from '../../validation.middleware';
import { phoneNumber } from '../../../../util/yup.util';

export const registerFormValidator = validator(Yup.object()
  .shape({
    name: Yup.string().required(),
    phone: phoneNumber().required(),
    classes: Yup.array().nullable(),
    products: Yup.array().nullable(),
    email: Yup.string()
      .email()
      .required(),
    captcha: Yup.object().required()
  })
  .test({
    name: 'asset',
    exclusive: false,
    message: 'Vui lòng chọn lớp hoặc sản phẩm',
    test: (value) => {
      // console.log(value, testContext);
      return (
        (value.classes && value.classes.length > 0) ||
        (value.products && value.products.length > 0)
      );
    }
  }), validatorType.BODY);
