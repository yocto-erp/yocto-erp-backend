import express from 'express';

import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from "../../../db/models/acl/acl-action";
import {pagingParse} from '../../middleware/paging.middleware';
import {
  createStudentClass,
  getStudentClass,
  listStudentClass, removeStudentClass,
  updateStudentClass
} from "../../../service/student/student-class.service";
import {studentClassValidator} from "../../middleware/validators/student/student-class.validator";

const router = express.Router();

router.get('/', [pagingParse({
  column: 'id',
  dir: 'asc'
}), hasPermission(PERMISSION.CUSTOMER.READ)], (req, res, next) => {
  return listStudentClass(req.user, req.query, req.paging)
    .then(t => res.status(200).json(t))
    .catch(next);
});

router.get('/:id(\\d+)', hasPermission(PERMISSION.CUSTOMER.READ), (req, res, next) => {
  return getStudentClass(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post('/', [hasPermission(PERMISSION.CUSTOMER.CREATE), studentClassValidator],
  (req, res, next) => {
    return createStudentClass(req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.post('/:id(\\d+)', [hasPermission(PERMISSION.CUSTOMER.UPDATE), studentClassValidator], (req, res, next) => {
  return updateStudentClass(req.params.id, req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.delete('/:id(\\d+)', hasPermission(PERMISSION.CUSTOMER.DELETE), (req, res, next) => {
  return removeStudentClass(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebStudentClassController(app) {
  app.use('/api/student-class', router);
}
