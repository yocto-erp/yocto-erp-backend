import express from 'express';
import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from '../../../db/models/acl/acl-action';
import {getDetailInventorySummary, inventorySummaries} from '../../../service/inventory/inventory-summary.service';
import {pagingParse} from '../../middleware/paging.middleware';

const inventorySummary = express.Router();

inventorySummary.get('/', hasPermission([PERMISSION.INVENTORY.GOODS_RECEIPT.READ, PERMISSION.INVENTORY.GOODS_ISSUE.READ]),
  pagingParse({column: 'id', dir: 'asc'}),
  (req, res, next) => {
    return inventorySummaries(req.query, req.paging.order, req.paging.offset, req.paging.size, req.user)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

inventorySummary.get('/:id(\\d+)', hasPermission([PERMISSION.INVENTORY.GOODS_RECEIPT.READ, PERMISSION.INVENTORY.GOODS_ISSUE.READ]), (req, res, next) => {
  return getDetailInventorySummary(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});


export function initWebInventorySummaryController(app) {
  app.use('/api/inventory/summary', inventorySummary);
}
