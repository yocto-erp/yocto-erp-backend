import express from 'express';
import {
  listTemplate,
  getTemplate,
  createTemplate,
  updateTemplate,
  removeTemplate
} from '../../../service/template/template.service';
import {hasPermission} from "../../middleware/permission";
import {PERMISSION} from "../../../db/models/acl/acl-action";
import {pagingParse} from "../../middleware/paging.middleware";
import {templateValidator} from "../../middleware/validators/template.validator";
import {templateRender} from "../../../service/template/template-render.service";

const router = express.Router();

router.get('/', hasPermission([PERMISSION.TEMPLATE.READ]),
  pagingParse({column: 'id', dir: 'asc'}),
  (req, res, next) => {
    return listTemplate(req.query, req.paging.order, req.paging.offset, req.paging.size, req.user)
      .then(result => res.status(200).json(result)).catch(next);
  });

router.get('/:id(\\d+)', hasPermission(PERMISSION.TEMPLATE.READ), (req, res, next) => {
  return getTemplate(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.get('/:id(\\d+)/preview', (req, res, next) => {
  return templateRender(req.params.id)
    .then(result => res.header('Content-Type', 'text/html').send(result))
    .catch(next);
});

router.post('/', [hasPermission(PERMISSION.TEMPLATE.CREATE), templateValidator], (req, res, next) => {
  return createTemplate(req.user, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

router.post('/:id(\\d+)', [hasPermission(PERMISSION.TEMPLATE.UPDATE), templateValidator], (req, res, next) => {
  return updateTemplate(req.params.id, req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.delete('/:id(\\d+)', hasPermission(PERMISSION.TEMPLATE.DELETE), (req, res, next) => {
  return removeTemplate(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initTemplateController(app) {
  app.use('/api/template', router);
}
