import PaymentType from './payment-type';
import PaymentMethodSetting from './payment-method-setting';
import PaymentRequest from './payment-request';
import PaymentRequestPartner from './partner/payment-request-partner';
import PaymentRequestPartnerConfirm from './partner/payment-request-partner-confirm';

export const initPaymentModel = sequelize => ({
  PaymentType: PaymentType.init(sequelize),
  PaymentMethodSetting: PaymentMethodSetting.init(sequelize),
  PaymentRequest: PaymentRequest.init(sequelize),
  PaymentRequestPartner: PaymentRequestPartner.init(sequelize),
  PaymentRequestPartnerConfirm: PaymentRequestPartnerConfirm.init(sequelize)
});
