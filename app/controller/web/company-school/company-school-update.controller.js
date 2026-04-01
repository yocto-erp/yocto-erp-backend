import express from 'express';
import { hasPermission, isAuthenticated } from '../../middleware/permission';
import {
  getCompanySchoolUpdate,
  getCompanySchoolUpdateById,
  listCompanySchoolUpdate,
  saveCompanySchoolUpdate
} from '../../../service/company-school/company-school-update.service';
import { PERMISSION } from '../../../db/models/acl/acl-action';
import { pagingParse } from '../../middleware/paging.middleware';

const router = express.Router();

router.get('/', [hasPermission([PERMISSION.COMPANY_SCHOOL.READ]),
    pagingParse({column: 'id', dir: 'asc'})],
  (req, res, next) => {
    return listCompanySchoolUpdate(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result)).catch(next);
  });

router.get('/:id(\\d+)', hasPermission(PERMISSION.COMPANY_SCHOOL.READ), (req, res, next) => {
  return getCompanySchoolUpdateById(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.get('/getDetail', isAuthenticated(),
  (req, res, next) => {
    return getCompanySchoolUpdate(req.user)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.post('/', isAuthenticated(),
  (req, res, next) => {
    return saveCompanySchoolUpdate(req.user, req.body)
      .then((t) => res.status(200).json(t))
      .catch(next);
  });


export function initCompanySchoolUpdateController(app) {
  app.use('/api/company-school-update', router);
}
