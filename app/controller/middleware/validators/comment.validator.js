import * as yup from "yup";
import { validator, validatorType } from "../validation.middleware";


export const commentValidator = validator(yup.object().shape({
  message: yup.string().required()
}), validatorType.BODY);
