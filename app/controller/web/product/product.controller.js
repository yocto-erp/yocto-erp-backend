import express from 'express';
import { pagingParse } from '../../middleware/paging.middleware';
import {
  createProduct,
  getAssets,
  getProduct, listProduct,
  products,
  removeProduct,
  updateProduct
} from '../../../service/product/product.service';
import { hasPermission } from '../../middleware/permission';
import { PERMISSION } from '../../../db/models/acl/acl-action';
import { updateUnit } from '../../../service/product/product-unit.service';
import { productUnitValidator, productValidator } from '../../middleware/validators/product.validator';

const product = express.Router();

product.get('/', hasPermission(PERMISSION.PRODUCT.READ),
  pagingParse({ column: 'id', dir: 'asc' }),
  (req, res, next) => {
    return listProduct(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result)).catch(next);
  });

product.get('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.READ), (req, res, next) => {
  return getProduct(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});


product.post('/', [productValidator, hasPermission(PERMISSION.PRODUCT.CREATE)], (req, res, next) => {
  return createProduct(req.user, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

product.post('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.UPDATE), (req, res, next) => {
  return updateProduct(req.params.id, req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

product.post('/:id(\\d+)/units',
  [productUnitValidator, hasPermission(PERMISSION.PRODUCT.UPDATE)], (req, res, next) => {
    return updateUnit(req.params.id, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

product.get('/:id(\\d+)/assets',
  hasPermission(PERMISSION.PRODUCT.READ), (req, res, next) => {
    return getAssets(req.params.id)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

product.delete('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.DELETE), (req, res, next) => {
  return removeProduct(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebProductController(app) {
  app.use('/api/product', product);
}
