import express from 'express';
import { pagingParse } from '../../middleware/paging.middleware';
import { hasPermission } from '../../middleware/permission';
import { PERMISSION } from '../../../db/models/acl/acl-action';
import {costs,createCost,getCost,updateCost,removeCost} from '../../../service/cost/cost.service';
import { costValidator } from '../../middleware/validators/cost.validator';

const cost = express.Router();
cost.get('/',
    pagingParse({column: 'id', dir: 'desc'}), hasPermission(PERMISSION.COST.READ),
    (req, res, next) => {
    return costs(req.query, req.paging, req.user)
      .then(result => res.status(200).json(result)).catch(next);
    });

cost.get('/:id(\\d+)', hasPermission(PERMISSION.COST.READ),(req, res, next) => {
    return getCost(req.params.id,req.user).then(result => res.status(200).json(result)).catch(next);
});

cost.post('/', [hasPermission(PERMISSION.COST.CREATE), costValidator], (req, res, next) => {
    return createCost(req.user, req.body).then(result => res.status(200).json(result)).catch(next);
});

cost.post('/:id(\\d+)',[ hasPermission(PERMISSION.COST.UPDATE), costValidator],(req, res, next) => {
    return updateCost(req.params.id, req.user, req.body).then(result => res.status(200).json(result)).catch(next);
});

cost.delete('/:id(\\d+)', hasPermission(PERMISSION.COST.DELETE),(req, res, next) => {
    return removeCost(req.params.id,req.user)
      .then(result => res.status(200).json(result))
      .catch(next);
  });
export function initWebCostController(app) {
    app.use('/api/cost', cost);
}
