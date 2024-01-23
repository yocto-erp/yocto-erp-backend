import { v4 as uuidv4 } from 'uuid';
import db from '../../db/models';
import {
  getOrCreatePaymentPartnerRequest
} from './partner/payment-request-partner.service';
import { PaymentRequestStatus } from '../../db/models/payment/payment-request';
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
  const paymentPartner = null;
  /**
   * No need to create partner request here, we will generate partner request
   * when user really want to check out, mean our website will show information
   * for user make payment
   */
  /*
  switch (paymentMethod.paymentTypeId) {
    case PAYMENT_METHOD_TYPE.PAYOS:
      paymentPartner = await requestPaymentPartner({
        paymentRequest
      }, transaction);
      break;
    default:
      paymentPartner = null;
  } */
  return { paymentRequest, paymentPartner };
};

export const getPaymentRequest = async (publicId, { isForceRefresh = false }) => {
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
  const paymentPartner = await getOrCreatePaymentPartnerRequest(paymentRequest, { isForceRefresh });

  return {
    paymentRequest,
    paymentPartner
  };
};
