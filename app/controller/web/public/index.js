import { initWebFormPublicController } from './form-public.controller';
import { initWebEcommerceShopController } from './ecommerce-shop.controller';
import { initPayOSPublicController } from './payment/pay-os.controller';
import { initPaymentPublicController } from './payment/payment-request.controller';

export function initApiPublicController(app) {
  initWebFormPublicController(app);
  initWebEcommerceShopController(app);
  initPayOSPublicController(app);
  initPaymentPublicController(app);
}
