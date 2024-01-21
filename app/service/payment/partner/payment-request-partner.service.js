import db from '../../../db/models';
import { getPaymentMethodSetting } from '../payment-method.service';
import { payosRequestPayment } from './payment-payos.api';
import { PAYMENT_METHOD_TYPE } from '../../../db/models/payment/payment-method-setting';


export const requestPaymentPartner = async ({
                                              paymentRequest
                                            }, transaction = null) => {
  const { paymentMethodId, companyId } = paymentRequest;
  const paymentMethodSetting = await getPaymentMethodSetting(paymentMethodId, companyId);
  console.log('Setting: ', paymentMethodSetting);
  const { payos: { clientId, apiKey, checksum } } = paymentMethodSetting;


  const { request, resp } = await payosRequestPayment({
    paymentRequest
  }, { clientId, apiKey, checksum });

  await db.PaymentRequestPartner.create({
    createdDate: new Date(),
    requestData: request,
    response: resp,
    paymentRequestId: paymentRequest.id,
    partnerId: resp.paymentLinkId
  }, { transaction });

  return resp;
};

/**
 * Depend on Partner, each payment request can be have single or multiple partner payment request
 * @param paymentRequest
 * @return {Promise<void>}
 */
export const getPaymentPartnerRequest = async (paymentRequest) => {
  let rs = null;
  if (paymentRequest.paymentMethod) {
    const { paymentTypeId } = paymentRequest.paymentMethod;
    switch (paymentTypeId) {
      case PAYMENT_METHOD_TYPE.PAYOS:
        rs = await db.PaymentRequestPartner.findOne({
          where: {
            paymentRequestId: paymentRequest.id
          }
        });
        break;
      default:
    }
  }
  return rs;
};
