import express from 'express';
import { hasPermission } from '../../middleware/permission';
import { PERMISSION } from '../../../db/models/acl/acl-action';
import { pagingParse } from '../../middleware/paging.middleware';
import { createFormRegister, getFormDetail, listForm, updateFormRegister } from '../../../service/form/form.service';

const router = express.Router();

router.get('/', ...hasPermission(PERMISSION.FORM.READ),
  pagingParse({ column: 'id', dir: 'asc' }),
  (req, res, next) => {
    return listForm(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.post('/', ...hasPermission(PERMISSION.FORM.CREATE), async (req, res, next) => {
  return createFormRegister(req.user, req.body).then(result => res.status(200).json(result)).catch(next);
});

router.get('/:id(\\d+)', ...hasPermission(PERMISSION.FORM.READ), async (req, res, next) => {
  return getFormDetail(req.user, req.params.id).then(result => res.status(200).json(result)).catch(next);
});

router.post('/:id(\\d+)', ...hasPermission(PERMISSION.FORM.CREATE), async (req, res, next) => {
  return updateFormRegister(req.user, req.params.id, req.body).then(result => res.status(200).json(result)).catch(next);
});

export function initFormRegisterController(app) {
  app.use('/api/form/register', router);
}
