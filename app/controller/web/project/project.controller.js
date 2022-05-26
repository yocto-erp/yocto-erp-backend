import express from "express";
import { pagingParse } from "../../middleware/paging.middleware";
import {
  createProduct,
  getAssets,
  getProduct, listProduct, mappingProduct,
  removeProduct,
  updateProduct
} from "../../../service/product/product.service";
import { hasPermission } from "../../middleware/permission";
import { PERMISSION } from "../../../db/models/acl/acl-action";
import { updateUnit } from "../../../service/product/product-unit.service";
import { productUnitValidator, productValidator } from "../../middleware/validators/product.validator";

const router = express.Router();

router.get("/", [hasPermission(PERMISSION.PROJECT.READ),
    pagingParse({ column: "id", dir: "asc" })],
  (req, res, next) => {
    return listProduct(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result)).catch(next);
  });

router.get("/:id(\\d+)", hasPermission(PERMISSION.PRODUCT.READ), (req, res, next) => {
  return getProduct(req.user, req.params.id)
    .then(result => res.status(200).json(mappingProduct(result)))
    .catch(next);
});


router.post("/", [productValidator, hasPermission(PERMISSION.PRODUCT.CREATE)], (req, res, next) => {
  return createProduct(req.user, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

router.post("/:id(\\d+)", hasPermission(PERMISSION.PRODUCT.UPDATE), (req, res, next) => {
  return updateProduct(req.params.id, req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post("/:id(\\d+)/units",
  [productUnitValidator, hasPermission(PERMISSION.PRODUCT.UPDATE)], (req, res, next) => {
    return updateUnit(req.user, req.params.id, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.get("/:id(\\d+)/assets",
  hasPermission(PERMISSION.PRODUCT.READ), (req, res, next) => {
    return getAssets(req.user, req.params.id)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.delete("/:id(\\d+)", hasPermission(PERMISSION.PRODUCT.DELETE), (req, res, next) => {
  return removeProduct(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebProjectController(app) {
  app.use("/api/project", router);
}
