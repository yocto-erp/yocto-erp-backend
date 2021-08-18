import { initWebEcommerceProductController } from './ecommerce-product.controller';
import {
  initWebEcommercePaymentSettingController
} from './ecommerce-configure.controller';

export function initEcommerceController(app) {
  initWebEcommerceProductController(app);
  initWebEcommercePaymentSettingController(app);
}
