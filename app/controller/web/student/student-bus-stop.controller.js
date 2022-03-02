import express from 'express';

import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from "../../../db/models/acl/acl-action";
import {pagingParse} from '../../middleware/paging.middleware';
import {
  createStudentBusStop,
  getStudentBusStop,
  listStudentBusStop, removeStudentBusStop, updateStudentBusStop
} from "../../../service/student/student-bus-stop.service";
import {studentBusStopValidator} from "../../middleware/validators/student/student-bus-stop.validator";

const router = express.Router();

router.get('/', [pagingParse({
  column: 'id',
  dir: 'asc'
}), hasPermission(PERMISSION.CUSTOMER.READ)], (req, res, next) => {
  return listStudentBusStop(req.user, req.query, req.paging)
    .then(t => res.status(200).json(t))
    .catch(next);
});

router.get('/:id(\\d+)', hasPermission(PERMISSION.CUSTOMER.READ), (req, res, next) => {
  return getStudentBusStop(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post('/', [hasPermission(PERMISSION.CUSTOMER.CREATE), studentBusStopValidator],
  (req, res, next) => {
    return createStudentBusStop(req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.post('/:id(\\d+)', [hasPermission(PERMISSION.CUSTOMER.UPDATE), studentBusStopValidator], (req, res, next) => {
  return updateStudentBusStop(req.params.id, req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.delete('/:id(\\d+)', hasPermission(PERMISSION.CUSTOMER.DELETE), (req, res, next) => {
  return removeStudentBusStop(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebStudentBusStopController(app) {
  app.use('/api/student-bus-stop', router);
}
