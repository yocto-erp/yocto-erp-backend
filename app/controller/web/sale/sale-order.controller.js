import express from "express";
import { hasPermission } from "../../middleware/permission";
import { PERMISSION } from "../../../db/models/acl/acl-action";
import { pagingParse } from "../../middleware/paging.middleware";
import {
  createOrder,
  getOrder,
  orders,
  removeOrder,
  updateOrder
} from "../../../service/order/order.service";
import { ORDER_TYPE } from "../../../db/models/order/order";
import { orderValidator } from "../../middleware/validators/order.validator";
import { SALE_API_PATH } from "./constants";

const sale = express.Router();


sale.get("/", [hasPermission(PERMISSION.ORDER.SALE.READ),
    pagingParse({ column: "id", dir: "asc" })],
  (req, res, next) => {
    return orders(ORDER_TYPE.SALE, req.query, req.paging.order, req.paging.offset, req.paging.size, req.user)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

sale.post("/", [orderValidator, hasPermission(PERMISSION.ORDER.SALE.CREATE)], (req, res, next) => {
  return createOrder(req.user, ORDER_TYPE.SALE, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

sale.get("/:id(\\d+)", hasPermission(PERMISSION.ORDER.SALE.READ), (req, res, next) => {
  return getOrder(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

sale.post("/:id(\\d+)", [orderValidator, hasPermission(PERMISSION.ORDER.SALE.UPDATE)], (req, res, next) => {
  return updateOrder(req.params.id, req.user, ORDER_TYPE.SALE, req.body)
    .then((result) => res.status(200).json(result))
    .catch(next);
});

sale.delete("/:id(\\d+)", hasPermission(PERMISSION.ORDER.SALE.DELETE), (req, res, next) => {
  return removeOrder(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});


export function initWebSaleOrderController(app) {
  app.use(`${SALE_API_PATH}/order`, sale);
}
