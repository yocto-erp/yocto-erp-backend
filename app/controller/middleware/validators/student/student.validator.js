import * as Yup from "yup";
import {validator, validatorType} from "../../validation.middleware";
import {MAIN_CONTACT_TYPE} from "../../../../db/models/student/student";

export const studentValidator = validator(Yup.object().shape({
  fullName: Yup.string().required(),
  studentId: Yup.string().required(),
  sex: Yup.string().required(),
  mainContact: Yup.string().required(),
  mother: Yup.object()
    .nullable()
    .when("mainContact", {
      is: val => Number(val) === MAIN_CONTACT_TYPE.MOTHER,
      then: Yup.object()
        .nullable()
        .required()
    }),
  father: Yup.object()
    .nullable()
    .when("mainContact", {
      is: val => Number(val) === MAIN_CONTACT_TYPE.FATHER,
      then: Yup.object()
        .nullable()
        .required()
    })
}), validatorType.BODY);
