import * as yup from "yup";
import { validator, validatorType } from "../../validation.middleware";

export const providerValidator = validator(yup.object().shape({
  name: yup.string().required(),
  subject: yup.object().required()
}), validatorType.BODY);
