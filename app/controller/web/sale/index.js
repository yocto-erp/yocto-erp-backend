import {initWebPOSController} from "./pos.controller";
import {initWebShopController} from "../shop/shop.controller";

export function initWebSaleController(app){
  initWebPOSController(app);
  initWebShopController(app);
}
