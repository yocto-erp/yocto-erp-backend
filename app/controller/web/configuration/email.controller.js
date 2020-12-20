import express from 'express';
import {isAuthenticated} from '../../middleware/permission';
import {getEmailConfigure, saveEmailConfigure} from "../../../service/configuration/configuration.service";
import {sendTestEmail} from "../../../service/email/company-email.service";

const emailConfiguration = express.Router();

emailConfiguration.get('/', isAuthenticated(),
  (req, res, next) => {
    return getEmailConfigure(req.user.companyId)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

emailConfiguration.post('/', isAuthenticated(),
  (req, res, next) => {
    return saveEmailConfigure(req.user.companyId, req.body)
      .then(() => res.status(200).json({ok: 1}))
      .catch(next);
  });

emailConfiguration.post('/test', isAuthenticated(),
  (req, res, next) => {
    const {configuration, email: {from, to}} = req.body;
    return sendTestEmail(configuration, {
      from,
      to,
      subject: 'Yocto ERP Test Email',
      message: 'This is test content from Yocto ERP'
    })
      .then((t) => res.status(200).json(t))
      .catch(next);
  });


export function initEmailConfigurationController(app) {
  app.use('/api/configuration/email', emailConfiguration);
}
