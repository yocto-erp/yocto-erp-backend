import express from 'express';
import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from '../../../db/models/acl/acl-action';
import {
  getInventory
} from '../../../service/inventory/inventory.service';
import {inventoryValidator} from '../../middleware/validators/inventory.validator';
import {createInventoryIn, removeInventoryIn, updateInventoryIn} from "../../../service/inventory/inventory-in.service";

const goodsReceipt = express.Router();
goodsReceipt.get('/:id(\\d+)', hasPermission(PERMISSION.INVENTORY.GOODS_RECEIPT.READ), (req, res, next) => {
  return getInventory(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

goodsReceipt.post('/', [hasPermission(PERMISSION.INVENTORY.GOODS_RECEIPT.CREATE), inventoryValidator], (req, res, next) => {
  return createInventoryIn(req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

goodsReceipt.post('/:id(\\d+)', [hasPermission(PERMISSION.INVENTORY.GOODS_RECEIPT.UPDATE), inventoryValidator], (req, res, next) => {
  return updateInventoryIn(req.user, req.params.id, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

goodsReceipt.delete('/:id(\\d+)', hasPermission(PERMISSION.INVENTORY.GOODS_RECEIPT.DELETE), (req, res, next) => {
  return removeInventoryIn(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});


export function initWebInventoryGoodReceiptController(app) {
  app.use('/api/inventory/goods-receipt', goodsReceipt);
}
