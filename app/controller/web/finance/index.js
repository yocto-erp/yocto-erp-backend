import { initWebFinancePaymentController } from "./payment/payment.controller";

export function initFinanceController(app) {
  initWebFinancePaymentController(app);
}
