import PayOS from '@payos/node';
import db from '../../../../db/models';
import { getPaymentMethodSetting } from '../../../payment/payment-method.service';
import { badRequest, FIELD_ERROR } from '../../../../config/error';
import { PaymentRequestStatus } from '../../../../db/models/payment/payment-request';

/**
 * https://payos.vn/docs/
 * https://payos.vn/docs/du-lieu-tra-ve/webhook/#operation/webhook
 * @param body
 * @param ip
 * @param userAgent
 * @return {Promise<void>}
 */
export const confirmPayOSWebHook = async (body, { ip, userAgent }) => {
  console.log(body, ip, userAgent);
  const rs = { ok: 0 };
  const { code, data } = body;
  if (code === '00' && data && data.orderCode) {
    const { orderCode } = data;
    const paymentRequestOS = await db.PaymentRequestPayOs.findOne({
      where: {
        paymentRequestId: orderCode
      },
      include: [
        { model: db.PaymentRequest, as: 'paymentRequest', required: true }
      ]
    });

    if (paymentRequestOS) {
      const { paymentRequest } = paymentRequestOS;
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
          paymentRequestOS.confirmData = body;
          paymentRequestOS.confirmedDate = new Date();
          paymentRequestOS.confirmFromIP = ip;
          await paymentRequestOS.save({ transaction });
          paymentRequest.status = PaymentRequestStatus.CONFIRMED;
          paymentRequest.lastConfirmedDate = new Date();
          await paymentRequest.save({ transaction });
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
  return rs;
};
