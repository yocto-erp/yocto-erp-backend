import * as yup from "yup";
import { validator, validatorType } from "../validation.middleware";
import { PAYMENT_TYPE } from "../../../db/models/payment/payment-type";

export const ecommerceProductValidator = validator(yup.object().shape({
  product: yup.object().required("Product is required."),
  unit: yup.object().required("Unit is required."),
  webDisplayName: yup.string().max(250).required("Web display name is required."),
  shortName: yup.string().max(64).required("Short name is required"),
  price: yup.number().required()
}), validatorType.BODY);

export const ecommerceSettingValidator = validator(yup.object().shape({
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
