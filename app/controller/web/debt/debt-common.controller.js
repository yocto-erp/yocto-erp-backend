import express from 'express';
import {pagingParse} from '../../middleware/paging.middleware';
import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from '../../../db/models/acl/acl-action';
import { commonDebts } from '../../../service/debt/debt.service';

const debtCommon = express.Router();

debtCommon.get('/', [hasPermission(PERMISSION.PRODUCT.READ),
    pagingParse({column: 'id', dir: 'asc'})],
  (req, res, next) => {
    return commonDebts(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result)).catch(next);
  });


export function initWebDebtCommonController(app) {
  app.use('/api/debt/common', debtCommon);
}
