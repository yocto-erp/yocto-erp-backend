import * as yup from "yup";
import { validator, validatorType } from "../../validation.middleware";

export const providerValidator = validator(yup.object().shape({
  subject: yup.object().required(),
  status: yup.number().required(),
  products: yup.array().required().min(1)
}), validatorType.BODY);
