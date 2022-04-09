import * as yup from "yup";
import { validator, validatorType } from "../../validation.middleware";
import { PAYMENT_TYPE } from "../../../../db/models/payment/payment-type";

export const paymentValidator = validator(yup.object().shape({
  name: yup.string().required(),
  paymentTypeId: yup.number().required("Payment Method is required"),
  setting: yup.mixed().test("isValid", "Invalid Setting", (value, ctx) => {
    console.log(ctx);
    const { paymentTypeId } = ctx.parent;
    if (paymentTypeId === PAYMENT_TYPE.BANK) {
      if (!value || !value.trim().length) return false;
    }
    return true;
  })
}), validatorType.BODY);
