import express from "express";
import { pagingParse } from "../../middleware/paging.middleware";
import { hasPermission } from "../../middleware/permission";
import { PERMISSION } from "../../../db/models/acl/acl-action";
import { ecommerceProductValidator } from "../../middleware/validators/ecommerc-product.validator";
import {
  createEcommerceProduct,
  getEcommerceProduct,
  listECommerceProducts, removeEcommerceProduct, updateEcommerceProduct
} from "../../../service/ecommerce/ecommerce-product.service";
import { mappingAssetItem } from "../../../service/asset/asset.service";

const product = express.Router();

product.get("/", [hasPermission(PERMISSION.ECOMMERCE.PRODUCT.READ),
    pagingParse({ column: "id", dir: "asc" })],
  (req, res, next) => {
    return listECommerceProducts(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result)).catch(next);
  });

product.get("/:id(\\d+)", hasPermission(PERMISSION.ECOMMERCE.PRODUCT.READ), (req, res, next) => {
  return getEcommerceProduct(req.user, req.params.id)
    .then(result => res.status(200).json(mappingAssetItem(result)))
    .catch(next);
});


product.post("/", [ecommerceProductValidator, hasPermission(PERMISSION.ECOMMERCE.PRODUCT.CREATE)], (req, res, next) => {
  return createEcommerceProduct(req.user, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

product.post("/:id(\\d+)", hasPermission(PERMISSION.ECOMMERCE.PRODUCT.UPDATE), (req, res, next) => {
  return updateEcommerceProduct(req.user, req.params.id, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

product.delete("/:id(\\d+)", hasPermission(PERMISSION.ECOMMERCE.PRODUCT.DELETE), (req, res, next) => {
  return removeEcommerceProduct(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebEcommerceProductController(app) {
  app.use("/api/ecommerce/product", product);
}
