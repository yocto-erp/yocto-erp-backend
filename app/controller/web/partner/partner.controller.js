import express from 'express';

import { hasPermission } from '../../middleware/permission';
import { PERMISSION } from '../../../db/models/acl/acl-action';
import { pagingParse } from '../../middleware/paging.middleware';
import {
  createSubject,
  getSubject,
  listSubject,
  removeSubject,
  updateSubject
} from '../../../service/subject/subject.service';
import { subjectValidator } from '../../middleware/validators/partner/subject.validator';

const router = express.Router();

router.get('/', ...hasPermission(PERMISSION.CUSTOMER.READ), pagingParse({
  column: 'id',
  dir: 'asc'
}), (req, res, next) => {
  return listSubject(req.user, req.query, req.paging)
    .then(t => res.status(200).json(t))
    .catch(next);
});

router.get('/:id(\\d+)', hasPermission(PERMISSION.CUSTOMER.READ), (req, res, next) => {
  return getSubject(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post('/', [hasPermission(PERMISSION.CUSTOMER.CREATE), subjectValidator],
  (req, res, next) => {
    return createSubject(req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.post('/:id(\\d+)', [hasPermission(PERMISSION.CUSTOMER.UPDATE), subjectValidator], (req, res, next) => {
  return updateSubject(req.params.id, req.body, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.delete('/:id(\\d+)', hasPermission(PERMISSION.CUSTOMER.DELETE), (req, res, next) => {
  return removeSubject(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebPartnerController(app) {
  app.use('/api/partner', router);
}
