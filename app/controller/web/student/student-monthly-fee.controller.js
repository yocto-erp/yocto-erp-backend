import express from 'express';

import fs from "fs";
import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from "../../../db/models/acl/acl-action";
import {pagingParse} from '../../middleware/paging.middleware';
import {
  createStudentMonthlyFee,
  generatePDF,
  getStudentMonthlyFee,
  listStudentMonthlyFee,
  removeStudentMonthlyFee,
  sendEmails,
  toPrintData,
  updateStudentMonthlyFee
} from '../../../service/student/student-monthly-fee.service';

const studentMonthlyFee = express.Router();

studentMonthlyFee.get('/', [pagingParse({
  column: 'id',
  dir: 'asc'
}), hasPermission(PERMISSION.CUSTOMER.READ)], (req, res, next) => {
  return listStudentMonthlyFee(req.query, req.paging.order, req.paging.offset, req.paging.size, req.user)
    .then(t => {
      res.status(200).json(t)
    })
    .catch(next);
});

studentMonthlyFee.get('/:ids', hasPermission(PERMISSION.CUSTOMER.READ), (req, res, next) => {
  return getStudentMonthlyFee(req.params.ids, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

studentMonthlyFee.get('/:id/pdf/:templateId', hasPermission(PERMISSION.CUSTOMER.READ), async (req, res, next) => {
  try {
    const pdfFile = await generatePDF(req.params.templateId, req.params.id, req.user.companyId);
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
    return next(e)
  }
});

studentMonthlyFee.post('/', [hasPermission(PERMISSION.CUSTOMER.CREATE)],
  (req, res, next) => {
    return createStudentMonthlyFee(req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

studentMonthlyFee.post('/send-email', [hasPermission(PERMISSION.CUSTOMER.READ)], (req, res, next) => {
  return sendEmails(req.body, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

studentMonthlyFee.post('/:ids', [hasPermission(PERMISSION.CUSTOMER.UPDATE)], (req, res, next) => {
  return updateStudentMonthlyFee(req.params.ids, req.body, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

studentMonthlyFee.delete('/:id', hasPermission(PERMISSION.CUSTOMER.DELETE), (req, res, next) => {
  return removeStudentMonthlyFee(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

studentMonthlyFee.get('/:id/print-data', hasPermission(PERMISSION.CUSTOMER.READ), async (req, res, next) => {
  return toPrintData(req.params.id, req.user.companyId)
    .then(t => res.status(200).json(t))
    .catch(next)
});

studentMonthlyFee.post('/:id/paid', hasPermission(PERMISSION.CUSTOMER.READ), async (req, res, next) => {
  console.log(req.body);
  res.status(200).json({});
});

export function initWebStudentMonthlyFeeController(app) {
  app.use('/api/student-monthly-fee', studentMonthlyFee);
}
