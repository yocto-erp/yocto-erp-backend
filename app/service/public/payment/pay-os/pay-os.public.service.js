import PayOS from '@payos/node';
import db from '../../../../db/models';
import { getPaymentMethodSetting } from '../../../payment/payment-method.service';
import { badRequest, FIELD_ERROR } from '../../../../config/error';
import { confirmPayment } from '../../../payment/payment-request.common';
import { PAYMENT_METHOD_TYPE } from '../../../../db/models/payment/payment-method-setting';

/**
 * https://payos.vn/docs/
 * https://payos.vn/docs/du-lieu-tra-ve/webhook/#operation/webhook
 * @param body
 * @param ip
 * @param userAgent
 * @return {Promise<{ok: number}>}
 */
export const confirmPayOSWebHook = async (body, { ip, userAgent }) => {
  console.log(body, ip, userAgent);
  const rs = { ok: 0 };
  const { code, data } = body;
  if (code === '00' && data && data.orderCode) {
    const { orderCode, reference } = data;
    const partnerRequestConfirm = await db.PaymentRequestPartnerConfirm.findOne({
      where: {
        paymentType: PAYMENT_METHOD_TYPE.PAYOS,
        partnerRequestId: reference
      }
    });

    if (!partnerRequestConfirm) {
      await db.PaymentRequestPartnerConfirm.create({
        paymentType: PAYMENT_METHOD_TYPE.PAYOS,
        partnerRequestId: reference,
        confirmedData: data,
        confirmedDate: new Date(),
        confirmFromIP: ip
      });
      const paymentRequestPartner = await db.PaymentRequestPartner.findOne({
        where: {
          paymentRequestId: orderCode
        },
        include: [
          { model: db.PaymentRequest, as: 'paymentRequest', required: true }
        ]
      });

      if (paymentRequestPartner) {
        const { paymentRequest } = paymentRequestPartner;
        // Process payment confirm
        const { paymentMethodId, companyId } = paymentRequest;
        const paymentMethodSetting = await getPaymentMethodSetting(paymentMethodId, companyId);
        const { payos: { clientId, apiKey, checksum } } = paymentMethodSetting;
        const payOS = new PayOS(clientId, apiKey, checksum);
        const paymentDataVerify = payOS.verifyPaymentWebhookData(body);
        if (paymentDataVerify) {
          const transaction = await db.sequelize.transaction();
          try {
            // Create payment request webhook
            paymentRequestPartner.confirmData = body;
            paymentRequestPartner.confirmedDate = new Date();
            paymentRequestPartner.confirmFromIP = ip;
            await paymentRequestPartner.save({ transaction });
            await confirmPayment({ paymentRequest }, transaction);
            await transaction.commit();
            rs.ok = 1;
          } catch (e) {
            await transaction.rollback();
            throw e;
          }
        } else {
          throw badRequest('PAY_OS_WEBHOOK', FIELD_ERROR.INVALID, 'Invalid payment request webhook');
        }
      } else {
        // This is webhook testing and do nothing
        rs.ok = 0;
      }
    }
  }
  return rs;
};
