import PayOS from '@payos/node';
import { getPaymentRequestPublicURL } from '../payment-request.common';
import { PaymentRequestSource } from '../../../db/models/payment/payment-request';

/**
 * https://payos.vn/docs/api/#operation/payment-request
 * @param paymentRequest: MAX 9
 * @return {string}
 */
const getDescription = (paymentRequest) => {
  switch (paymentRequest.source) {
    case PaymentRequestSource.PUBLIC_REGISTER:
      return 'Dang Ky';
    default:
      return 'Thanh toan';
  }
};

export const payosRequestPayment = async ({ paymentRequest }, {
  clientId,
  apiKey,
  checksum
}) => {
  const payOS = new PayOS(clientId, apiKey, checksum);
  const returnURL = getPaymentRequestPublicURL(paymentRequest);
  const body = {
    orderCode: paymentRequest.id,
    amount: paymentRequest.totalAmount,
    description: getDescription(paymentRequest),
    cancelUrl: returnURL,
    returnUrl: returnURL
  };

  console.log('createPaymentLink REQUEST: ', body);
  const resp = await payOS.createPaymentLink(body);
  return {
    request: body,
    resp
  };
};
