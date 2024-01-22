import { initFormRegisterController } from './form.controller';
import { initFormRegisteredController } from './form-register.controller';

export const initFormController = (app) => {
  initFormRegisterController(app);
  initFormRegisteredController(app);
};
