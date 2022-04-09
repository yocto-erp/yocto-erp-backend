import express from "express";
import { pagingParse } from "../../../middleware/paging.middleware";
import { hasPermission } from "../../../middleware/permission";
import { PERMISSION } from "../../../../db/models/acl/acl-action";
import {
  createEcommercePaymentSetting,
  getEcommercePaymentSetting,
  listECommercePayment,
  removeEcommercePaymentSetting,
  updateEcommercePaymentSetting
} from "../../../../service/payment/ecommerce-setting.service";
import { paymentValidator } from "../../../middleware/validators/finance/payment.validator";

const router = express.Router();

router.get("/", [hasPermission(PERMISSION.ECOMMERCE.SETTING),
    pagingParse({ column: "id", dir: "asc" })],
  (req, res, next) => {
    return listECommercePayment(req.user, req.query, req.paging.order, req.paging.offset, req.paging.size)
      .then(result => res.status(200).json(result)).catch(next);
  });


router.post("/", [paymentValidator, hasPermission(PERMISSION.ECOMMERCE.SETTING)], (req, res, next) => {
  return createEcommercePaymentSetting(req.user, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

router.get("/:id(\\d+)", hasPermission(PERMISSION.ECOMMERCE.SETTING), (req, res, next) => {
  return getEcommercePaymentSetting(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post("/:id(\\d+)", [paymentValidator, hasPermission(PERMISSION.ECOMMERCE.SETTING)], (req, res, next) => {
  return updateEcommercePaymentSetting(req.user, req.params.id, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.delete("/:id(\\d+)", hasPermission(PERMISSION.ECOMMERCE.PRODUCT.DELETE), (req, res, next) => {
  return removeEcommercePaymentSetting(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebFinancePaymentController(app) {
  app.use("/api/finance/payment", router);
}
