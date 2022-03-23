import express from 'express';
import {
  shops,
  getShop,
  createShop,
  updateShop,
  removeShop
} from '../../../service/shop/shop.service';
import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from "../../../db/models/acl/acl-action";
import {pagingParse} from '../../middleware/paging.middleware';
import {shopValidator} from '../../middleware/validators/shop.validator';

const shop = express.Router();

shop.get('/', [hasPermission(PERMISSION.PRODUCT.READ), pagingParse({column: 'id', dir: 'asc'})], (req, res, next) => {
  return shops(req.user, req.query, req.paging.order, req.paging.offset, req.paging.size)
    .then(result => res.status(200).json(result))
    .catch(next);
});

shop.get('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.READ), (req, res, next) => {
  return getShop(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

shop.post('/', [shopValidator, hasPermission(PERMISSION.PRODUCT.CREATE)], (req, res, next) => {
  return createShop(req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

shop.post('/:id(\\d+)', [shopValidator, hasPermission(PERMISSION.PRODUCT.UPDATE)], (req, res, next) => {
  return updateShop(req.params.id, req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

shop.delete('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.DELETE), (req, res, next) => {
  return removeShop(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebShopController(app) {
  app.use('/api/shop', shop);
}
