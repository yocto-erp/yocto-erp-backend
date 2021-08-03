import express from 'express';
import {isAuthenticated} from '../../middleware/permission';
import { getCompanyConfig, saveCompanyConfig } from '../../../service/configuration/company-configure.service';

const router = express.Router();

router.get('/', isAuthenticated(),
  (req, res, next) => {
    return getCompanyConfig(req.user)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.post('/', isAuthenticated(),
  (req, res, next) => {
    return saveCompanyConfig(req.user, req.body)
      .then((t) => res.status(200).json(t))
      .catch(next);
  });


export function initCompanyConfigurationController(app) {
  app.use('/api/configuration/company', router);
}
