import * as yup from 'yup';
import {validator, validatorType} from '../validation.middleware';

export const templateValidator = validator(yup.object().shape({
  name: yup.string().max(250, 'Name max string 250').required('This field is required.'),
  content: yup.string().required('Content is required'),
  templateTypeId: yup.number().required('Template type is required')
}), validatorType.BODY);
