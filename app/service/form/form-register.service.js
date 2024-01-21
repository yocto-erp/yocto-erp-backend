import { v4 as uuidv4 } from 'uuid';
import db from '../../db/models';

/**
 * Save register request from user.
 * Depend on payment setting enable,
 *  - process payment request
 * @param user
 * @param formPublicId
 * @param formBody
 * @return {Promise<{ok: number}>}
 */
import { verifyCaptcha } from '../captcha/hcaptcha.service';
import { getFormByPublic, getFormInfo } from './form.service';
import { FormRegisterStatus } from '../../db/models/form/form-register';
import { formRegisterPaymentProcess } from './form-register-payment.service';
import { badRequest, FIELD_ERROR } from '../../config/error';

export const register = async (user, formPublicId, formBody, { ip, userAgent }) => {
  const { name, email, phone, captcha, classes, products, description } = formBody;
  await verifyCaptcha(captcha.token);
  const form = await getFormByPublic(formPublicId);
  const rs = {
    formRegister: null,
    payments: []
  };
  const transaction = await db.sequelize.transaction();
  try {
    const registerData = {
      name, email, phone, description, classes, products
    };
    let totalAmount = 0;
    totalAmount += (products || []).map(t => t.price).reduce((a, b) => a + b, 0);
    totalAmount += (classes || []).map(t => t.tuitionFeePerMonth).reduce((a, b) => a + b, 0);
    rs.formRegister = await db.FormRegister.create({
      publicId: uuidv4(),
      ip,
      userAgent,
      userId: user?.id,
      registerData: registerData,
      createdDate: new Date(),
      totalAmount,
      isConfirmed: true,
      status: FormRegisterStatus.CONFIRMED,
      formId: form.id,
      name,
      phone,
      email
    }, { transaction });

    if (form.payment) {
      rs.payment = await formRegisterPaymentProcess({
        form,
        formRegister: rs.formRegister, ip, userAgent, payment: form.payment
      }, transaction);
    }
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
  return rs;
};


export const getFormRegisterInfo = async (registerPublicId) => {
  console.log('getFormRegisterInfo: ', registerPublicId);
  const formRegisterInfo = await db.FormRegister.findOne({
    where: {
      publicId: registerPublicId
    },
    include: [
      { model: db.PaymentRequest, as: 'payments' },
      { model: db.Form, as: 'form' }
    ]
  });
  if (!formRegisterInfo) {
    throw badRequest('FormRegister', FIELD_ERROR.INVALID, 'Not found any data');
  }
  const {
    publicId,
    ip,
    userAgent,
    registerData,
    createdDate,
    totalAmount,
    isConfirmed,
    status,
    form,
    name,
    phone,
    email,
    payments
  } = formRegisterInfo;

  const { classes, products, description, ...other } = registerData;

  return {
    publicId,
    ip,
    userAgent,
    registerData,
    classes, products,
    description,
    ...other,
    createdDate,
    totalAmount,
    isConfirmed,
    status,
    form: await getFormInfo(form, false),
    name,
    phone,
    email,
    payment: payments?.[0]
  };
};