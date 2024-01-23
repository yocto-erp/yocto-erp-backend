import db from '../../../db/models';
import { getPaymentMethodSetting } from '../payment-method.service';
import { payosRequestPayment } from './payment-payos.api';
import { PAYMENT_METHOD_TYPE } from '../../../db/models/payment/payment-method-setting';


export const requestPaymentPartner = async ({
                                              paymentRequest
                                            }, transaction = null) => {
  const { paymentMethodId, companyId } = paymentRequest;
  const paymentMethodSetting = await getPaymentMethodSetting(paymentMethodId, companyId);
  const { payos: { clientId, apiKey, checksum } } = paymentMethodSetting;


  const { request, resp } = await payosRequestPayment({
    paymentRequest
  }, { clientId, apiKey, checksum });

  return db.PaymentRequestPartner.create({
    createdDate: new Date(),
    requestData: request,
    response: resp,
    paymentRequestId: paymentRequest.id,
    partnerId: resp.paymentLinkId
  }, { transaction });
};

/**
 * Depend on Partner, each payment request can be having single or multiple partner payment request
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

export const getOrCreatePaymentPartnerRequest = async (paymentRequest) => {
  let rs = await getPaymentPartnerRequest(paymentRequest);
  if (!rs) {
    rs = await requestPaymentPartner({ paymentRequest });
  }
  return rs;
};
