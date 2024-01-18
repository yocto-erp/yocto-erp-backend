import Form from './form';
import FormAsset from './form-asset';
import FormRegister from './form-register';
import FormRegisterAsset from './form-register-asset';

export const initFormModel = sequelize => ({
  Form: Form.init(sequelize),
  FormAsset: FormAsset.init(sequelize),
  FormRegister: FormRegister.init(sequelize),
  FormRegisterAsset: FormRegisterAsset.init(sequelize)
});

