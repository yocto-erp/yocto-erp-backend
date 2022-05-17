import express from "express";
import { hasPermission } from "../../middleware/permission";
import { PERMISSION } from "../../../db/models/acl/acl-action";
import { pagingParse } from "../../middleware/paging.middleware";
import { getOrder, orders, removeOrder } from "../../../service/order/order.service";
import { ORDER_TYPE } from "../../../db/models/order/order";
import { orderValidator } from "../../middleware/validators/order.validator";
import { createPurchaseOrder, updatePurchaseOrder } from "../../../service/order/purchase.service";
import { trackingMiddleware } from "../../middleware/tracking.middleware";

const purchase = express.Router();

purchase.get("/", [hasPermission(PERMISSION.ORDER.PURCHASE.READ),
    pagingParse({ column: "id", dir: "asc" })],
  (req, res, next) => {
    return orders(ORDER_TYPE.PURCHASE, req.query, req.paging.order, req.paging.offset, req.paging.size, req.user)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

purchase.post("/", [orderValidator, hasPermission(PERMISSION.ORDER.PURCHASE.CREATE)], (req, res, next) => {
  return createPurchaseOrder(req.user, req.body, req.tracking)
    .then(result => res.status(200).json(result)).catch(next);
});

purchase.get("/:id(\\d+)", hasPermission(PERMISSION.ORDER.PURCHASE.READ), (req, res, next) => {
  return getOrder(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

purchase.post("/:id(\\d+)", [orderValidator, hasPermission(PERMISSION.ORDER.PURCHASE.UPDATE), trackingMiddleware], (req, res, next) => {
  return updatePurchaseOrder(req.params.id, req.user, req.body, req.tracking)
    .then((result) => res.status(200).json(result))
    .catch(next);
});

purchase.delete("/:id(\\d+)", hasPermission(PERMISSION.ORDER.PURCHASE.DELETE), (req, res, next) => {
  return removeOrder(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebOrderPurchaseController(app) {
  app.use("/api/order/purchase", purchase);
}
