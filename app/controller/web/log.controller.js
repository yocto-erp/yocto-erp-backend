import express from 'express';
import {
  warehouses,
  createWarehouse,
  removeWarehouse,
  updateWarehouse,
  getWarehouse
} from '../../service/warehouse/warehouse.service';
import { hasPermission } from '../middleware/permission';
import {PERMISSION} from "../../db/models/acl/acl-action";
import { pagingParse } from '../middleware/paging.middleware';
import { warehouseValidator } from '../middleware/validators/warehouse.validator';
import { logEmail } from '../../service/log.service';

const log = express.Router();

log.get('/emails', hasPermission(PERMISSION.CUSTOMER.READ),
  pagingParse({column: 'id', dir: 'asc'}),
  (req, res, next) => {
    return logEmail(req.user, req.query, req.paging.order, req.paging.offset, req.paging.size)
      .then(result => res.status(200).json(result))
      .catch(next);
  });


export function initWebLogController(app) {
  app.use('/api/log', log);
}
