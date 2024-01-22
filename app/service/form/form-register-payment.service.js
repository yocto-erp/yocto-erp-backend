import db from '../../db/models';
import { getPaymentMethod } from '../payment/payment-method.service';
import { requestPayment } from '../payment/payment-request.service';
import { PaymentRequestSource } from '../../db/models/payment/payment-request';
import { FormRegisterStatus } from '../../db/models/form/form-register';
import { createCost } from '../cost/cost.util';
import { COST_TYPE } from '../../db/models/cost/cost';
import { COST_PURPOSE } from '../../db/models/cost/cost-purpose';


/**
 * This function handle process payment for register, and return array of payment
 *
 * @param form
 * @param formRegister
 * @param payment: Payment Method Setting from register form (in the future, we can support multiple payment method)
 * @param userAgent
 * @param ip
 * @param transaction
 * @return {Promise<*[
 *   {
 *     paymentMethodType, qrCode, url, paymentRequestId
 *   }
 * ]>}
 */
export const formRegisterPaymentProcess = async ({
                                                   form,
                                                   formRegister,
                                                   payment,
                                                   userAgent,
                                                   ip
                                                 }, transaction = null) => {
  const rs = {
    methods: []
  };
  const { companyId } = form;
  const paymentMethod = await getPaymentMethod(payment.id, companyId);
  const { paymentRequest, paymentPartner } = await requestPayment({
    companyId: companyId,
    name: `Payment request from ${formRegister.name}`,
    source: PaymentRequestSource.PUBLIC_REGISTER,
    paymentMethod,
    totalAmount: formRegister.totalAmount,
    userAgent,
    ip, remark: `Payment request from ${formRegister.name}`
  }, transaction);
  await db.FormRegisterPayment.create({
    formRegisterId: formRegister.id,
    paymentRequestId: paymentRequest.id
  }, { transaction });
  rs.paymentRequest = paymentRequest;
  rs.methods.push({
    paymentMethodType: paymentMethod.paymentTypeId,
    qrCode: paymentPartner.qrCode
  });
  return rs;
};

export const confirmFormRegisterPayment = async ({ paymentRequest }, transaction) => {
  const formRegisterPayment = await db.FormRegisterPayment.findOne({
    where: {
      paymentRequestId: paymentRequest.id
    },
    include: [
      { model: db.FormRegister, as: 'formRegister' }
    ]
  });
  if (formRegisterPayment) {
    const { formRegister } = formRegisterPayment;
    formRegister.status = FormRegisterStatus.PAID;
    formRegister.lastModifiedDate = new Date();
    await formRegister.save({ transaction });
    // we create cost in
    await createCost({
      name: paymentRequest.name,
      type: COST_TYPE.RECEIPT,
      companyId: paymentRequest.companyId,
      purposeId: COST_PURPOSE.REGISTER_FORM,
      amount: paymentRequest.totalAmount,
      relativeId: paymentRequest.id,
      userId: paymentRequest.createdById,
      paymentMethodId: paymentRequest.paymentMethodId
    }, transaction);
  }
};
