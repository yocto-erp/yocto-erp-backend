import db from '../../db/models';
import {badRequest, FIELD_ERROR} from '../../config/error';
import {PAYMENT_TYPE} from '../../db/models/payment/payment-type';

export async function listECommercePayment(user) {
  const where = {companyId: user.companyId};
  return db.PaymentMethodSetting.findAll({
    where
  });
}

export function getEcommercePaymentSetting(user, id) {
  return db.PaymentMethodSetting.findOne({
    where: {
      companyId: user.companyId,
      id
    }
  });
}

export async function createEcommercePaymentSetting(user, formData) {
  console.log(formData);
  const {paymentTypeId, setting, name} = formData;
  let settingStr = '';
  if (paymentTypeId === PAYMENT_TYPE.CASH || paymentTypeId === PAYMENT_TYPE.BANK) {
    settingStr = setting;
  } else {
    settingStr = JSON.stringify(setting);
  }
  return db.PaymentMethodSetting.create({
    name,
    paymentTypeId, setting: settingStr, companyId: user.companyId
  });
}

export async function updateEcommercePaymentSetting(user, id, formData) {
  const {paymentTypeId, setting, name} = formData;
  const item = await getEcommercePaymentSetting(user, id);
  if (!item) {
    throw badRequest('paymentMethod', FIELD_ERROR.INVALID, 'Invalid Payment Method');
  }
  let settingStr = '';
  if (paymentTypeId === PAYMENT_TYPE.BANK || paymentTypeId === PAYMENT_TYPE.CASH) {
    settingStr = setting;
  } else {
    settingStr = JSON.stringify(setting);
  }
  item.name = name;
  item.setting = settingStr;
  item.paymentMethodId = paymentTypeId;
  return item.save();
}

export async function removeEcommercePaymentSetting(user, id) {
  const item = await getEcommercePaymentSetting(user, id);
  if (!item) {
    throw badRequest('paymentMethod', FIELD_ERROR.INVALID, 'Invalid Payment Method');
  }
  return item.destroy();
}
