import { initFormRegisterController } from './form.controller';
import { initWebFormPublicController } from '../public/form-public.controller';

export const initFormController = (app) => {
  initFormRegisterController(app);
  initWebFormPublicController(app);
};
