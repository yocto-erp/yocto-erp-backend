import db from '../../../db/models';
import { getPaymentMethodSetting } from '../payment-method.service';
import { PAY_OS_PAYMENT_STATUS, payosPaymentInfo, payosRequestPayment } from './payment-payos.api';
import { PAYMENT_METHOD_TYPE } from '../../../db/models/payment/payment-method-setting';
import { PaymentRequestStatus } from '../../../db/models/payment/payment-request';
import { confirmPayment } from '../payment-request.common';

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

const getPayOSStatus = async ({ paymentRequest, paymentRequestPartner }, { forcePartner }) => {
  const { status, paymentMethod, lastConfirmedDate } = paymentRequest;
  if (status === PaymentRequestStatus.PENDING &&
    ((!lastConfirmedDate || (new Date().getTime() - lastConfirmedDate.getTime() > 2 * 3600 * 1000)) || forcePartner)) {

    const transaction = await db.sequelize.transaction();
    try {
      const resp = await payosPaymentInfo({ paymentRequestId: paymentRequest.id }, paymentMethod.setting.payos);
      paymentRequestPartner.confirmData = resp;
      paymentRequestPartner.confirmedDate = new Date();
      await paymentRequestPartner.save({ transaction });
      if (resp.status === PAY_OS_PAYMENT_STATUS.PAID && paymentRequest.status !== PaymentRequestStatus.CONFIRMED) {
        await confirmPayment({ paymentRequest }, transaction);
      }
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      console.error(e);
    }
  }
};

/**
 * Depend on Partner, each payment request can be having single or multiple partner payment request.
 * If PartnerRequest is not confirm PAID or REJECT, we will get information from partner
 * @param paymentRequest
 * @param forcePartner
 * @return {Promise<void>}
 */
export const getPaymentPartnerRequest = async (paymentRequest, { forcePartner } = { forcePartner: false }) => {
  let rs = null;
  if (paymentRequest.paymentMethod) {
    const { paymentTypeId } = paymentRequest.paymentMethod;
    switch (paymentTypeId) {
      case PAYMENT_METHOD_TYPE.PAYOS: {
        rs = await db.PaymentRequestPartner.findOne({
          where: {
            paymentRequestId: paymentRequest.id
          }
        });
        if (rs) {
          await getPayOSStatus({ paymentRequest, paymentRequestPartner: rs }, { forcePartner });
        }

        break;
      }
      default:
    }
  }
  return rs;
};

export const getOrCreatePaymentPartnerRequest = async (paymentRequest, { isForceRefresh = false }) => {
  let rs = await getPaymentPartnerRequest(paymentRequest, { forcePartner: isForceRefresh });
  if (!rs) {
    rs = await requestPaymentPartner({ paymentRequest });
  }
  return rs;
};
