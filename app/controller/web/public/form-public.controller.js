import express from 'express';
import { PUBLIC_URL } from './constant';
import { getFormByPublic } from '../../../service/form/form.service';
import { getAuthUser } from '../../middleware/permission';
import { registerFormValidator } from '../../middleware/validators/form/register-form.validator';
import { getFormRegisterInfo, register } from '../../../service/form/form-register.service';
import { getIP, userAgent } from '../../../util/request.util';

const router = express.Router();

router.get('/:publicId', (req, res, next) => {
  return getFormByPublic(req.params.publicId)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.post('/:publicId', registerFormValidator, getAuthUser, (req, res, next) => {
  const ip = getIP(req);
  const ua = userAgent(req);
  return register(req.user, req.params.publicId, req.body, { ip, userAgent: ua })
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.get('/register/:publicId', (req, res, next) => {
  return getFormRegisterInfo(req.params.publicId)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebFormPublicController(app) {
  app.use(`${PUBLIC_URL}/form`, router);
}
