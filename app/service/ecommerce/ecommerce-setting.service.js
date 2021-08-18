import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';
import { ECOMMERCE_PAYMENT_METHOD } from '../../db/models/ecommerce/ecommerce-payment-method';

export async function listECommercePayment(user) {
  const where = { companyId: user.companyId };
  return db.EcommercePaymentMethodSetting.findAll({
    where
  });
}

export function getEcommercePaymentSetting(user, id) {
  return db.EcommercePaymentMethodSetting.findOne({
    where: {
      companyId: user.companyId,
      id
    }
  });
}

async function getNextId(user) {
  const lastId = await db.EcommercePaymentMethodSetting.max('id', {
    where: {
      companyId: user.companyId
    }
  });

  return (lastId || 0) + 1;
}

export async function createEcommercePaymentSetting(user, formData) {
  console.log(formData);
  const { paymentMethodId, setting } = formData;
  let settingStr = '';
  if (paymentMethodId === ECOMMERCE_PAYMENT_METHOD.DIRECT_TRANSFER) {
    settingStr = setting;
  } else {
    settingStr = JSON.stringify(setting);
  }
  return db.EcommercePaymentMethodSetting.create({
    id: await getNextId(user),
    paymentMethodId, setting: settingStr, companyId: user.companyId
  });
}

export async function updateEcommercePaymentSetting(user, id, formData) {
  const { paymentMethodId, setting } = formData;
  const item = await getEcommercePaymentSetting(user, id);
  if (!item) {
    throw badRequest('paymentMethod', FIELD_ERROR.INVALID, 'Invalid Payment Method');
  }
  let settingStr = '';
  if (paymentMethodId === ECOMMERCE_PAYMENT_METHOD.DIRECT_TRANSFER) {
    settingStr = setting;
  } else {
    settingStr = JSON.stringify(setting);
  }
  item.setting = settingStr;
  item.paymentMethodId = paymentMethodId;
  return item.save();
}

export async function removeEcommercePaymentSetting(user, id) {
  const item = await getEcommercePaymentSetting(user, id);
  if (!item) {
    throw badRequest('paymentMethod', FIELD_ERROR.INVALID, 'Invalid Payment Method');
  }
  return item.destroy();
}
