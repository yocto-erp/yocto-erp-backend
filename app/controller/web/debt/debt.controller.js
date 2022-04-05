import express from 'express';
import {pagingParse} from '../../middleware/paging.middleware';
import {
  createProduct,
  getProduct,
  removeProduct,
  updateProduct
} from '../../../service/product/product.service';
import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from '../../../db/models/acl/acl-action';
import { debts } from '../../../service/debt/debt.service';

const debt = express.Router();

debt.get('/', [hasPermission(PERMISSION.PRODUCT.READ),
    pagingParse({column: 'id', dir: 'asc'})],
  (req, res, next) => {
    return debts(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result)).catch(next);
  });

debt.get('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.READ), (req, res, next) => {
  return getProduct(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});


debt.post('/', [productValidator, hasPermission(PERMISSION.PRODUCT.CREATE)], (req, res, next) => {
  return createProduct(req.user, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

debt.post('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.UPDATE), (req, res, next) => {
  return updateProduct(req.params.id, req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

debt.delete('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.DELETE), (req, res, next) => {
  return removeProduct(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebDebtController(app) {
  app.use('/api/debt', debt);
}
