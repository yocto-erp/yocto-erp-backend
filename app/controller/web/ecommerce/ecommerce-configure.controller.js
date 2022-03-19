import express from 'express';
import {pagingParse} from '../../middleware/paging.middleware';
import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from '../../../db/models/acl/acl-action';
import {ecommerceSettingValidator} from '../../middleware/validators/ecommerc-product.validator';
import {
  createEcommercePaymentSetting,
  getEcommercePaymentSetting,
  listECommercePayment,
  removeEcommercePaymentSetting,
  updateEcommercePaymentSetting
} from '../../../service/payment/ecommerce-setting.service';

const ecommerceSetting = express.Router();

ecommerceSetting.get('/', [hasPermission(PERMISSION.ECOMMERCE.SETTING),
    pagingParse({column: 'id', dir: 'asc'})],
  (req, res, next) => {
    return listECommercePayment(req.user, req.query, req.paging.order, req.paging.offset, req.paging.size)
      .then(result => res.status(200).json(result)).catch(next);
  });


ecommerceSetting.post('/', [ecommerceSettingValidator, hasPermission(PERMISSION.ECOMMERCE.SETTING)], (req, res, next) => {
  return createEcommercePaymentSetting(req.user, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

ecommerceSetting.get('/:id(\\d+)', hasPermission(PERMISSION.ECOMMERCE.SETTING), (req, res, next) => {
  return getEcommercePaymentSetting(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

ecommerceSetting.post('/:id(\\d+)', [ecommerceSettingValidator, hasPermission(PERMISSION.ECOMMERCE.SETTING)], (req, res, next) => {
  return updateEcommercePaymentSetting(req.user, req.params.id, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

ecommerceSetting.delete('/:id(\\d+)', hasPermission(PERMISSION.ECOMMERCE.PRODUCT.DELETE), (req, res, next) => {
  return removeEcommercePaymentSetting(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebEcommercePaymentSettingController(app) {
  app.use('/api/ecommerce/configure/payment', ecommerceSetting);
}
