import express from 'express';
import { pagingParse } from '../../middleware/paging.middleware';
import { hasPermission } from '../../middleware/permission';
import { PERMISSION } from '../../../db/models/acl/acl-action';
import {
  createNoteCompany,
  getNoteCompany,
  listNoteCompany,
  removeNoteCompany,
  updateNoteCompany
} from '../../../service/note/company-note.service';

const companyNote = express.Router();

companyNote.get(
  '/',
  [
    hasPermission(PERMISSION.COMPANY_SCHOOL.READ)
  ],
  (req, res, next) => {
    return listNoteCompany(req.user, req.query)
      .then((result) => res.status(200).json(result))
      .catch(next);
  }
);

companyNote.get(
  '/:id(\\d+)',
  hasPermission(PERMISSION.COMPANY_SCHOOL.READ),
  (req, res, next) => {
    return getNoteCompany(req.user, req.params.id)
      .then((result) => res.status(200).json(result))
      .catch(next);
  }
);

companyNote.post(
  '/',
  [hasPermission(PERMISSION.COMPANY_SCHOOL.READ)],
  (req, res, next) => {
    return createNoteCompany(req.user, req.body)
      .then((result) => res.status(200).json(result))
      .catch(next);
  }
);

companyNote.post(
  '/:id(\\d+)',
  hasPermission(PERMISSION.COMPANY_SCHOOL.READ),
  (req, res, next) => {
    return updateNoteCompany(req.params.id, req.user, req.body)
      .then((result) => res.status(200).json(result))
      .catch(next);
  }
);

companyNote.delete(
  '/:id(\\d+)',
  hasPermission(PERMISSION.COMPANY_SCHOOL.READ),
  (req, res, next) => {
    return removeNoteCompany(req.user, req.params.id)
      .then((result) => res.status(200).json(result))
      .catch(next);
  }
);

export function initWebCompanyNoteController(app) {
  app.use('/api/company-note', companyNote);
}
