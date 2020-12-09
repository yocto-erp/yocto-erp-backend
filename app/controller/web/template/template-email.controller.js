import express from 'express';
import {
  createEmailTemplate,
  getEmailTemplate,
  listEmailTemplate,
  removeEmailTemplate,
  updateEmailTemplate
} from '../../../service/template/template-email.service';
import {hasPermission} from "../../middleware/permission";
import {PERMISSION} from "../../../db/models/acl/acl-action";
import {pagingParse} from "../../middleware/paging.middleware";
import {templateValidator} from "../../middleware/validators/template.validator";

const router = express.Router();

router.get('/', hasPermission([PERMISSION.TEMPLATE.READ]),
  pagingParse({column: 'id', dir: 'asc'}),
  (req, res, next) => {
    return listEmailTemplate(req.query, req.paging.order, req.paging.offset, req.paging.size, req.user)
      .then(result => res.status(200).json(result)).catch(next);
  });

router.get('/:id(\\d+)', hasPermission(PERMISSION.TEMPLATE.READ), (req, res, next) => {
  return getEmailTemplate(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post('/', [hasPermission(PERMISSION.TEMPLATE.CREATE), templateValidator], (req, res, next) => {
  return createEmailTemplate(req.user, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

router.post('/:id(\\d+)', [hasPermission(PERMISSION.TEMPLATE.UPDATE), templateValidator], (req, res, next) => {
  return updateEmailTemplate(req.params.id, req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.delete('/:id(\\d+)', hasPermission(PERMISSION.TEMPLATE.DELETE), (req, res, next) => {
  return removeEmailTemplate(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initEmailTemplateController(app) {
  app.use('/api/email-template', router);
}
