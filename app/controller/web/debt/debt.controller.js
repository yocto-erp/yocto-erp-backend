import express from 'express';
import {pagingParse} from '../../middleware/paging.middleware';
import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from '../../../db/models/acl/acl-action';
import { commonDebts, createDebt, debts, getDebt, removeDebt, updateDebt } from '../../../service/debt/debt.service';

const debt = express.Router();

debt.get('/', [hasPermission(PERMISSION.PRODUCT.READ),
    pagingParse({column: 'id', dir: 'asc'})],
  (req, res, next) => {
    return debts(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result)).catch(next);
  });

debt.get('/common', [hasPermission(PERMISSION.PRODUCT.READ),
    pagingParse({column: 'lastModifiedDate', dir: 'desc'})],
  (req, res, next) => {
    return commonDebts(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result)).catch(next);
  });

debt.get('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.READ), (req, res, next) => {
  return getDebt(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});


debt.post('/', [hasPermission(PERMISSION.PRODUCT.CREATE)], (req, res, next) => {
  return createDebt(req.user, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

debt.post('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.UPDATE), (req, res, next) => {
  return updateDebt(req.params.id, req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

debt.delete('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.DELETE), (req, res, next) => {
  return removeDebt(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebDebtController(app) {
  app.use('/api/debt', debt);
}
