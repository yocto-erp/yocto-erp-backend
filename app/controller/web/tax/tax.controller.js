import express from 'express';
import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from "../../../db/models/acl/acl-action";
import {pagingParse} from '../../middleware/paging.middleware';
import {createTax, getTax, listTax, removeTax, updateTax} from "../../../service/tax/tax.service";
import {taxValidator} from "../../middleware/validators/tax/tax.validator";

const router = express.Router();

router.get('/', [hasPermission(PERMISSION.TAX.READ),
    pagingParse({column: 'id', dir: 'asc'})],
  (req, res, next) => {
    return listTax(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.get('/:id(\\d+)', hasPermission(PERMISSION.TAX.READ), (req, res, next) => {
  return getTax(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post('/', [taxValidator, hasPermission(PERMISSION.TAX.CREATE)],
  (req, res, next) => {
    return createTax(req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.post('/:id(\\d+)', [taxValidator, hasPermission(PERMISSION.TAX.UPDATE)],
  (req, res, next) => {
    return updateTax(req.user, req.params.id, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.delete('/:id(\\d+)', hasPermission(PERMISSION.TAX.DELETE), (req, res, next) => {
  return removeTax(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebTaxController(app) {
  app.use('/api/tax', router);
}
