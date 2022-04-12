import express from "express";
import { hasPermission } from "../../middleware/permission";
import { PERMISSION } from "../../../db/models/acl/acl-action";
import { pagingParse } from "../../middleware/paging.middleware";
import { posValidator } from "../../middleware/validators/sale/pos.validator";
import {
  createPOS, getListUserAssignPos,
  getPOS,
  getPosUser,
  listPOS,
  removePOS,
  updatePOS,
  updatePosUser
} from "../../../service/sale/pos.service";
import { posOrder } from "../../../service/sale/pos-order.service";
import { getIP, userAgent } from "../../../util/request.util";

const router = express.Router();

router.get("/", [hasPermission(PERMISSION.POS.READ), pagingParse({ column: "id", dir: "asc" })], (req, res, next) => {
  return listPOS(req.user, req.query, req.paging)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.get("/list", [hasPermission(PERMISSION.POS.ORDER)], (req, res, next) => {
  return getListUserAssignPos(req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.get("/:id(\\d+)", hasPermission(PERMISSION.POS.READ), (req, res, next) => {
  return getPOS(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post("/", [posValidator, hasPermission(PERMISSION.POS.CREATE)], (req, res, next) => {
  return createPOS(req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post("/:id(\\d+)", [posValidator, hasPermission(PERMISSION.POS.UPDATE)], (req, res, next) => {
  return updatePOS(req.user, req.params.id, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.delete("/:id(\\d+)", hasPermission(PERMISSION.POS.DELETE), (req, res, next) => {
  return removePOS(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post("/:id(\\d+)/order", hasPermission(PERMISSION.POS.ORDER), (req, res, next) => {
  const ip = getIP(req);
  const clientAgent = userAgent(req);
  return posOrder(req.user, req.params.id, req.body, clientAgent, ip)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.get("/:id(\\d+)/users", hasPermission(PERMISSION.POS.READ), (req, res, next) => {
  return getPosUser(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post("/:id(\\d+)/users", hasPermission(PERMISSION.POS.UPDATE), (req, res, next) => {
  return updatePosUser(req.user, req.params.id, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebPOSController(app) {
  app.use("/api/pos", router);
}
