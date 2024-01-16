import Form from './form';
import FormAsset from './form-asset';

export const initFormModel = sequelize => ({
  Form: Form.init(sequelize),
  FormAsset: FormAsset.init(sequelize)
});

