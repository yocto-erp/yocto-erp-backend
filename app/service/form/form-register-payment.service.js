import db from '../../db/models';
import { getPaymentMethod } from '../payment/payment-method.service';
import { requestPayment } from '../payment/payment-request.service';
import { PaymentRequestSource } from '../../db/models/payment/payment-request';


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
