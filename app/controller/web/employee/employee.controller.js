import express from 'express';
import {
  createEmployee,
  removeEmployee,
  updateEmployee,
  getEmployee, search
} from '../../../service/employee/employee.service';
import { hasPermission } from '../../middleware/permission';
import {PERMISSION} from "../../../db/models/acl/acl-action";
import { pagingParse } from '../../middleware/paging.middleware';
import { employeeValidator } from '../../middleware/validators/employee.validator';

const employee = express.Router();
employee.get('/', hasPermission(PERMISSION.EMPLOYEE.READ),
  pagingParse({column: 'id', dir: 'asc'}),
  (req, res, next) => {
    return search(req.user, req.query, req.paging.order, req.paging.offset, req.paging.size)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

employee.get('/:id(\\d+)', hasPermission(PERMISSION.EMPLOYEE.READ), (req, res, next) => {
  return getEmployee(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});
employee.post('/', hasPermission(PERMISSION.EMPLOYEE.READ),
  (req, res, next) => {
    return createEmployee(req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });
employee.post('/:id(\\d+)', [employeeValidator, hasPermission(PERMISSION.EMPLOYEE.UPDATE)],
  (req, res, next) => {
    return updateEmployee(req.params.id, req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });
employee.delete('/:id(\\d+)', hasPermission(PERMISSION.EMPLOYEE.DELETE),
  (req, res, next) => {
  return removeEmployee(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebEmployeeController(app) {
  app.use('/api/employee', employee);
}
