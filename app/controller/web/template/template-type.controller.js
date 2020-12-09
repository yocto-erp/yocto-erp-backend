import express from 'express';
import {
  getTemplateTypes, getTemplateTypeVariables
} from '../../../service/template/template.service';
import {isAuthenticated} from "../../middleware/permission";

const router = express.Router();

router.get('/', isAuthenticated(),
  (req, res, next) => {
    return getTemplateTypes()
      .then(result => res.status(200).json(result)).catch(next);
  });

router.get('/:id(\\d+)', (req, res, next) => {
  return getTemplateTypeVariables(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initTemplateTypeController(app) {
  app.use('/api/template/type', router);
}
