import express from 'express';
import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from '../../../db/models/acl/acl-action';
import {
  getInventory
} from '../../../service/inventory/inventory.service';
import {inventoryValidator} from '../../middleware/validators/inventory.validator';
import {
  createInventoryOut,
  removeInventoryOut,
  updateInventoryOut
} from "../../../service/inventory/inventory-out.service";

const goodsIssue = express.Router();

goodsIssue.get('/:id(\\d+)', hasPermission(PERMISSION.INVENTORY.GOODS_ISSUE.READ), (req, res, next) => {
  return getInventory(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

goodsIssue.post('/', [hasPermission(PERMISSION.INVENTORY.GOODS_ISSUE.CREATE), inventoryValidator], (req, res, next) => {
  return createInventoryOut(req.user, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

goodsIssue.post('/:id(\\d+)', [hasPermission(PERMISSION.INVENTORY.GOODS_ISSUE.UPDATE), inventoryValidator], (req, res, next) => {
  return updateInventoryOut(req.user, req.params.id, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

goodsIssue.delete('/:id(\\d+)', hasPermission(PERMISSION.INVENTORY.GOODS_ISSUE.DELETE), (req, res, next) => {
  return removeInventoryOut(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});


export function initWebInventoryGoodIssueController(app) {
  app.use('/api/inventory/goods-issue', goodsIssue);
}
