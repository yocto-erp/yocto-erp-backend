import express from 'express';
import { hasPermission } from '../../middleware/permission';
import { PERMISSION } from '../../../db/models/acl/acl-action';
import { pagingParse } from '../../middleware/paging.middleware';
import { listFormRegister } from '../../../service/form/form-register/form-register.crud';

const router = express.Router();

router.get('/', ...hasPermission(PERMISSION.FORM.READ),
  pagingParse({ column: 'id', dir: 'asc' }),
  (req, res, next) => {
    return listFormRegister(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result))
      .catch(next);
  });


export function initFormRegisteredController(app) {
  app.use('/api/form/registered', router);
}
