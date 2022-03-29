import express from 'express';
import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from "../../../db/models/acl/acl-action";
import {pagingParse} from '../../middleware/paging.middleware';
import {createTaxSet, getTaxSet, listTaxSet, removeTaxSet, updateTaxSet} from "../../../service/tax/tax-set.service";
import {taxSetValidator} from "../../middleware/validators/tax/tax-set.validator";

const router = express.Router();

router.get('/', [hasPermission(PERMISSION.TAX.READ),
    pagingParse({column: 'id', dir: 'asc'})],
  (req, res, next) => {
    return listTaxSet(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.get('/:id(\\d+)', hasPermission(PERMISSION.TAX.READ), (req, res, next) => {
  return getTaxSet(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post('/', [taxSetValidator, hasPermission(PERMISSION.TAX.CREATE)],
  (req, res, next) => {
    return createTaxSet(req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.post('/:id(\\d+)', [taxSetValidator, hasPermission(PERMISSION.TAX.UPDATE)],
  (req, res, next) => {
    return updateTaxSet(req.user, req.params.id, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.delete('/:id(\\d+)', hasPermission(PERMISSION.TAX.DELETE), (req, res, next) => {
  return removeTaxSet(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebTaxSetController(app) {
  app.use('/api/tax-set', router);
}
