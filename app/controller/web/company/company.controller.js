import express from 'express';
import {
  companies,
  createCompany,
  getCompany, removeCompany,
  updateCompany
} from '../../../service/company/company.service';
import { pagingParse } from '../../middleware/paging.middleware';
import { hasPermission } from '../../middleware/permission';
import { PERMISSION } from '../../../db/models/acl/acl-action';
import { companyValidator } from '../../middleware/validators/company.validator';

const company = express.Router();

company.get('/', [pagingParse({column: 'id', dir: 'asc'}), hasPermission(PERMISSION.CUSTOMER.READ)],
  (req, res, next) => {
    return companies(req.query, req.paging.order, req.paging.offset, req.paging.size, req.user)
      .then(t => res.status(200).json(t))
      .catch(next);
  });

company.get('/:id(\\d+)', hasPermission(PERMISSION.CUSTOMER.READ), (req, res, next) => {
  return getCompany(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

company.post('/', [companyValidator, hasPermission(PERMISSION.CUSTOMER.CREATE)], (req, res, next) => {
  return createCompany(req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

company.post('/:id(\\d+)', [companyValidator, hasPermission(PERMISSION.CUSTOMER.UPDATE)], (req, res, next) => {
  return updateCompany(req.params.id, req.body, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

company.delete('/:id(\\d+)', hasPermission(PERMISSION.CUSTOMER.DELETE), (req, res, next) => {
  return removeCompany(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebCompanyController(app) {
  app.use('/api/company', company);
}
