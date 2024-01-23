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
import { FORM_STATUS } from '../../db/models/form/form';
import { sendTemplateEmail } from '../template/template-email-render.service';
import { toPrintData } from './form.util';
import { buildEmail } from '../email/email.util';
import { createCustomerPerson } from '../subject/subject.util';

export const register = async (user, formPublicId, formBody, { ip, userAgent }) => {
  const { name, email, phone, captcha, classes, products, description } = formBody;
  await verifyCaptcha(captcha.token);
  const form = await getFormByPublic(formPublicId);
  if (form.status !== FORM_STATUS.ACTIVE) {
    throw badRequest('FORM', FIELD_ERROR.INVALID, 'Form is not active');
  }
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
    const subject = await createCustomerPerson({
      name, email, phone, companyId: form.companyId, createdById: form.createdById
    }, transaction);
    rs.formRegister = await db.FormRegister.create({
      publicId: uuidv4(),
      ip,
      userAgent,
      userId: user?.id,
      registerData: registerData,
      createdDate: new Date(),
      totalAmount,
      subjectId: subject.id,
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
    await db.Form.update({
      lastRegister: new Date()
    }, {
      where: {
        id: form.id
      },
      transaction
    });
    await transaction.commit();
    if (form.registerTemplate) {
      // If setting for sending email confirm
      sendTemplateEmail({
        emailTemplateId: form.registerTemplate.templateId,
        companyId: form.companyId,
        userId: form.createdById
      }, {
        to: [buildEmail({ email, name })], printData: toPrintData(rs.formRegister, form)
      }).then();
    }
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
  return rs;
};

export const parseRegisterInfo = async (formRegisterInfo) => {
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
    payments,
    subject
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
    name: subject?.name,
    phone: subject?.gsm,
    email: subject?.email,
    payment: payments?.[0]
  };
};

export const getFormRegisterInfo = async (registerPublicId) => {
  console.log('getFormRegisterInfo: ', registerPublicId);
  const formRegisterInfo = await db.FormRegister.findOne({
    where: {
      publicId: registerPublicId
    },
    include: [
      { model: db.PaymentRequest, as: 'payments' },
      { model: db.Form, as: 'form' },
      { model: db.Subject, as: 'subject' }
    ]
  });
  if (!formRegisterInfo) {
    throw badRequest('FormRegister', FIELD_ERROR.INVALID, 'Not found any data');
  }
  return parseRegisterInfo(formRegisterInfo);
};

export const toPrintDataFromId = async (id) => {
  const formRegisterInfo = await db.FormRegister.findOne({
    where: {
      id
    }
  });
  if (!formRegisterInfo) {
    throw badRequest('FormRegister', FIELD_ERROR.INVALID, 'Not found any data');
  }
  return toPrintData(formRegisterInfo, formRegisterInfo.form);
};
