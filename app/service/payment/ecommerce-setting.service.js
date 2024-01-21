import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';
import { USER_ATTR_VIEW } from '../../db/models/user/user';

export async function listECommercePayment(user) {
  const where = { companyId: user.companyId };
  return db.PaymentMethodSetting.findAll({
    where,
    attributes: {
      exclude: ['setting']
    },
    include: [
      { model: db.User, as: 'createdBy', attributes: USER_ATTR_VIEW }
    ]
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
  const { paymentTypeId, setting, name } = formData;

  return db.PaymentMethodSetting.create({
    name,
    paymentTypeId, setting, companyId: user.companyId,
    createdDate: new Date(),
    createdById: user.id
  });
}

export async function updateEcommercePaymentSetting(user, id, formData) {
  const { paymentTypeId, setting, name } = formData;
  const item = await getEcommercePaymentSetting(user, id);
  if (!item) {
    throw badRequest('paymentMethod', FIELD_ERROR.INVALID, 'Invalid Payment Method');
  }
  item.name = name;
  item.setting = { ...setting };
  item.paymentMethodId = paymentTypeId;
  item.lastModifiedById = user.id;
  item.lastModifiedDate = new Date();
  return item.save();
}

export async function removeEcommercePaymentSetting(user, id) {
  const item = await getEcommercePaymentSetting(user, id);
  if (!item) {
    throw badRequest('paymentMethod', FIELD_ERROR.INVALID, 'Invalid Payment Method');
  }
  return item.destroy();
}
