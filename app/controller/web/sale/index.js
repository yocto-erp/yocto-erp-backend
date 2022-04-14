import { initWebPOSController } from "./pos.controller";
import { initWebShopController } from "../shop/shop.controller";
import { initWebSaleSettingController } from "./sale-configure.controller";
import { initWebSaleOrderController } from "./sale-order.controller";

export function initWebSaleController(app) {
  initWebPOSController(app);
  initWebShopController(app);
  initWebSaleSettingController(app);
  initWebSaleOrderController(app);
}
