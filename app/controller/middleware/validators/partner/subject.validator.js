import * as yup from 'yup';
import {validator, validatorType} from '../../validation.middleware';
import {SUBJECT_TYPE} from "../../../../db/models/partner/subject";

export const subjectValidator = validator(yup.object().shape({
  company: yup.object().when("type", {
    is: val => Number(val) === SUBJECT_TYPE.COMPANY,
    then: yup.object().required()
  }),
  person: yup.object().when("type", {
    is: val => Number(val) === SUBJECT_TYPE.PERSONAL,
    then: yup.object().required()
  }),
  type: yup.string().required()
}), validatorType.BODY);
