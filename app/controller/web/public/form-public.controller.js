import express from 'express';
import { PUBLIC_URL } from './constant';
import { getFormByPublic } from '../../../service/form/form.service';
import { isAuthenticated } from '../../middleware/permission';
import { registerFormValidator } from '../../middleware/validators/form/register-form.validator';
import { register } from '../../../service/form/form-register.service';

const router = express.Router();

router.get('/:publicId', (req, res, next) => {
  return getFormByPublic(req.params.publicId)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post('/:publicId', registerFormValidator, ...isAuthenticated(), (req, res, next) => {
  return register(req.user, req.params.publicId, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebFormPublicController(app) {
  app.use(`${PUBLIC_URL}/form`, router);
}
