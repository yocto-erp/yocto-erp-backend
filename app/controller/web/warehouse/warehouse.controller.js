import express from 'express';
import {
  warehouses,
  createWarehouse,
  removeWarehouse,
  updateWarehouse,
  getWarehouse
} from '../../../service/warehouse/warehouse.service';
import { hasPermission } from '../../middleware/permission';
import {PERMISSION} from "../../../db/models/acl/acl-action";
import { pagingParse } from '../../middleware/paging.middleware';
import { warehouseValidator } from '../../middleware/validators/warehouse.validator';

const warehouse = express.Router();

warehouse.get('/', hasPermission(PERMISSION.WAREHOUSE.READ),
  pagingParse({column: 'id', dir: 'asc'}),
  (req, res, next) => {
    return warehouses(req.user, req.query, req.paging.order, req.paging.offset, req.paging.size)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

warehouse.get('/:id(\\d+)', hasPermission(PERMISSION.WAREHOUSE.READ), (req, res, next) => {
  return getWarehouse(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

warehouse.post('/', [ warehouseValidator, hasPermission(PERMISSION.WAREHOUSE.CREATE)],
  (req, res, next) => {
  return createWarehouse(req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

warehouse.post('/:id(\\d+)', [warehouseValidator, hasPermission(PERMISSION.WAREHOUSE.UPDATE)],
  (req, res, next) => {
  return updateWarehouse(req.params.id, req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

warehouse.delete('/:id(\\d+)', hasPermission(PERMISSION.WAREHOUSE.DELETE), (req, res, next) => {
  return removeWarehouse(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebWarehouseController(app) {
  app.use('/api/warehouse', warehouse);
}
