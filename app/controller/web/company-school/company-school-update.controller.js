import express from 'express';
import fs from 'fs';
import { hasPermission, isAuthenticated } from '../../middleware/permission';
import {
  downloadCompanySchoolUpdate,
  getCompanySchoolUpdate,
  getCompanySchoolUpdateById,
  listCompanySchoolUpdate, printPDF,
  saveCompanySchoolUpdate
} from '../../../service/company-school/company-school-update.service';
import { PERMISSION } from '../../../db/models/acl/acl-action';
import { pagingParse } from '../../middleware/paging.middleware';

const router = express.Router();

router.get('/', [hasPermission([PERMISSION.COMPANY_SCHOOL.READ]),
    pagingParse({ column: 'id', dir: 'desc' })],
  (req, res, next) => {
    return listCompanySchoolUpdate(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result)).catch(next);
  });

router.get('/:id(\\d+)', hasPermission(PERMISSION.COMPANY_SCHOOL.READ), (req, res, next) => {
  return getCompanySchoolUpdateById(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.get('/:id(\\d+)/print/:templateId', hasPermission(PERMISSION.COMPANY_SCHOOL.READ), async (req, res, next) => {
  try {
    const pdfFile = await printPDF(req.params.templateId, req.params.id, req.user.companyId);
    const s = fs.createReadStream(pdfFile);
    s.on('open', function onOpen() {
      res.set('Content-Type', 'application/pdf');
      s.pipe(res);
    });
    s.on('error', function onError() {
      res.set('Content-Type', 'text/plain');
      res.status(404).end('Not found');
    });
  } catch (e) {
    next(e);
  }
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


router.get('/download', hasPermission(PERMISSION.COMPANY_SCHOOL.READ), async (req, res, next) => {
  try {
    const csvFile = await downloadCompanySchoolUpdate(req.user, req.query);
    const s = fs.createReadStream(csvFile);
    s.on('open', function onOpen() {
      res.set('Content-Type', 'text/csv; charset=utf-8');
      res.set('Content-Disposition', 'attachment; filename="file.csv"');
      s.pipe(res);
    });
    s.on('error', function onError() {
      res.set('Content-Type', 'text/plain');
      res.status(404).end('Not found');
    });
  } catch (e) {
    next(e);
  }
});


export function initCompanySchoolUpdateController(app) {
  app.use('/api/company-school-update', router);
}
