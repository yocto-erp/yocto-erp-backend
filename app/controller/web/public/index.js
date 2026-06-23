import { initWebFormPublicController } from './form-public.controller';
import { initWebEcommerceShopController } from './ecommerce-shop.controller';
import { initPaymentPublicController } from './payment/payment-request.controller';

export function initApiPublicController(app) {
  initWebFormPublicController(app);
  initWebEcommerceShopController(app);
  initPaymentPublicController(app);
}
