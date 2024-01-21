import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';


export const getPaymentMethod = async (paymentMethodId, companyId) => {
  const rs = await db.PaymentMethodSetting.findOne({
    where: {
      id: paymentMethodId, companyId
    }
  });
  if (!rs) {
    throw badRequest('PaymentMethod', FIELD_ERROR.INVALID, 'Payment method not found');
  }
  return rs;
};

export const getPaymentMethodSetting = async (paymentMethodId, companyId) => {
  const rs = await getPaymentMethod(paymentMethodId, companyId);
  return rs.setting;
};
