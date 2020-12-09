import express from 'express';
import { pagingParse } from '../../middleware/paging.middleware';
import { hasPermission } from '../../middleware/permission';
import { PERMISSION } from '../../../db/models/acl/acl-action';
import {
  createSurvey,
  getSurvey,
  listSurveys,
  removeSurvey,
  updateSurvey
} from '../../../service/survey/survey-admin.service';

const surveyAdmin = express.Router();

surveyAdmin.get('/',  hasPermission(PERMISSION.PRODUCT.READ),
  pagingParse({column: 'id', dir: 'asc'}),
  (req, res, next) => {
    return listSurveys(req.user, req.query, req.paging.order, req.paging.offset, req.paging.size)
      .then(result => res.status(200).json(result)).catch(next);
  });

surveyAdmin.get('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.READ), (req, res, next) => {
  return getSurvey(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

surveyAdmin.post('/', [hasPermission(PERMISSION.PRODUCT.CREATE)],
  (req, res, next) => {
    return createSurvey(req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

surveyAdmin.post('/:id(\\d+)', [hasPermission(PERMISSION.PRODUCT.UPDATE)],
  (req, res, next) => {
    return updateSurvey(req.params.id, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

surveyAdmin.delete('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.DELETE), (req, res, next) => {
  return removeSurvey(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});


export function initWebSurveyAdminController(app) {
  app.use('/api/survey-admin', surveyAdmin);
}
