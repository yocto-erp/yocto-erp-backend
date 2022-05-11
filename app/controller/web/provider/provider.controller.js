import express from "express";
import { pagingParse } from "../../middleware/paging.middleware";
import { hasPermission } from "../../middleware/permission";
import { PERMISSION } from "../../../db/models/acl/acl-action";
import {
  createProvider,
  getProvider,
  listProvider,
  removeProvider,
  updateProvider
} from "../../../service/provider/provider.service";
import { providerValidator } from "../../middleware/validators/provider/provider.validator";
import { API_PATH } from "../constants";

const router = express.Router();
router.get("/",
  [pagingParse({ column: "id", dir: "desc" }), hasPermission(PERMISSION.PROVIDER.READ)],
  (req, res, next) => {
    return listProvider(req.query, req.user, req.paging)
      .then(result => res.status(200).json(result)).catch(next);
  });

router.get("/:id(\\d+)", hasPermission(PERMISSION.PROVIDER.READ), (req, res, next) => {
  return getProvider(req.params.id, req.user).then(result => res.status(200).json(result)).catch(next);
});

router.post("/", [hasPermission(PERMISSION.PROVIDER.CREATE), providerValidator], (req, res, next) => {
  return createProvider(req.user, req.body).then(result => res.status(200).json(result)).catch(next);
});

router.post("/:id(\\d+)", [hasPermission(PERMISSION.PROVIDER.UPDATE), providerValidator], (req, res, next) => {
  return updateProvider(req.params.id, req.user, req.body).then(result => res.status(200).json(result)).catch(next);
});

router.delete("/:id(\\d+)", hasPermission(PERMISSION.PROVIDER.DELETE), (req, res, next) => {
  return removeProvider(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebProviderController(app) {
  app.use(`${API_PATH}/provider`, router);
}
