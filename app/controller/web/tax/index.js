import {initWebTaxController} from "./tax.controller";
import {initWebTaxSetController} from "./tax-set.controller";

export function initTaxController(app) {
  initWebTaxController(app);
  initWebTaxSetController(app);
}
