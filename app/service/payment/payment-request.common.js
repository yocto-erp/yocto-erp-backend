import { PaymentRequestSource, PaymentRequestStatus } from '../../db/models/payment/payment-request';
import { confirmFormRegisterPayment } from '../form/form-register-payment.service';

export const getPaymentRequestPublicURL = (paymentRequest) => {
  return `${process.env.PUBLIC_URL || 'https://app.yoctoerp.com'}/cpm/pg/${paymentRequest.publicId}`;
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
      await confirmFormRegisterPayment({ paymentRequest }, transaction);
      break;
    default:
  }
};
