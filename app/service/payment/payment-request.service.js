import { v4 as uuidv4 } from 'uuid';
import db from '../../db/models';
import { PAYMENT_METHOD_TYPE } from '../../db/models/payment/payment-method-setting';
import { getPaymentPartnerRequest, requestPaymentPartner } from './partner/payment-request-partner.service';
import { PaymentRequestSource, PaymentRequestStatus } from '../../db/models/payment/payment-request';
import { badRequest, FIELD_ERROR } from '../../config/error';

/**
 * Create payment request, depend on payment setting, we can request to partner,
 * this function can be using for public and auth (with or without user authenticate)
 */
export const requestPayment = async ({
                                       companyId,
                                       name,
                                       remark,
                                       ip,
                                       userAgent,
                                       paymentMethod,

                                       totalAmount,
                                       source
                                     }, transaction = null) => {
  const paymentRequest = await db.PaymentRequest.create({
    companyId,
    name,
    remark,
    ip,
    userAgent,
    paymentMethodId: paymentMethod.id,
    totalAmount,
    source,
    status: PaymentRequestStatus.PENDING,
    publicId: uuidv4()
  }, {
    transaction
  });
  let paymentPartner = null;
  switch (paymentMethod.paymentTypeId) {
    case PAYMENT_METHOD_TYPE.PAYOS:
      paymentPartner = await requestPaymentPartner({
        paymentRequest
      }, transaction);
      break;
    default:
      paymentPartner = null;
  }
  return { paymentRequest, paymentPartner };
};

/**
 * Confirm payment success
 * @param paymentRequest
 * @param transaction
 * @return {Promise<void>}
 */
export const confirmPayment = async ({
                                       paymentRequest
                                     }, transaction = null) => {
  const { source } = paymentRequest;
  paymentRequest.status = PaymentRequestStatus.CONFIRMED;
  paymentRequest.lastConfirmedDate = new Date();
  await paymentRequest.save({ transaction });
  switch (source) {
    case PaymentRequestSource.PUBLIC_REGISTER:

      break;
    default:
  }
};

export const getPaymentRequest = async (publicId) => {
  const paymentRequest = await db.PaymentRequest.findOne({
    where: {
      publicId
    },
    include: [
      { model: db.PaymentMethodSetting, as: 'paymentMethod' }
    ]
  });
  if (!paymentRequest) {
    throw badRequest('PaymentRequest', FIELD_ERROR.INVALID, 'Invalid payment request');
  }
  const paymentPartner = await getPaymentPartnerRequest(paymentRequest);

  return {
    paymentRequest,
    paymentPartner
  };
};
