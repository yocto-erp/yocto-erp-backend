import PaymentType from './payment-type';
import PaymentMethodSetting from "./payment-method-setting";

export const initPaymentModel = sequelize => ({
  PaymentType: PaymentType.init(sequelize),
  PaymentMethodSetting: PaymentMethodSetting.init(sequelize)
});
