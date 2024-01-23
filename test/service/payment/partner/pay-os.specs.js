import { payosPaymentInfo } from '../../../../app/service/payment/partner/payment-payos.api';

/**
 * {"payos": {"apiKey": "82536d8e-14b8-443f-97f3-18ffbacdd0c0", "checksum": "7a5a380dd7a17b4f803a9637c7f53623256c276ad94879f82795341c43bbf6ec", "clientId": "3ca8cb1e-bc38-4888-ad5e-c41fbb79fc37"}}
 */
describe('paymentPartnerRequestPAYOS', () => {
  it('getLink', async function renderTemplate() {
    console.log(await payosPaymentInfo({ paymentRequestId: 15 }, {
      'apiKey': '82536d8e-14b8-443f-97f3-18ffbacdd0c0',
      'checksum': '7a5a380dd7a17b4f803a9637c7f53623256c276ad94879f82795341c43bbf6ec',
      'clientId': '3ca8cb1e-bc38-4888-ad5e-c41fbb79fc37'
    }));
  });
});
