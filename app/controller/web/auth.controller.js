import express from 'express';
import {hasPermission, isAuthenticated} from '../middleware/permission';
import {
  confirmEmail,
  createCompanyOnboard,
  register,
  resendEmailActive,
  selectCompany,
  signIn
} from '../../service/user/auth.service';
import {PERMISSION} from "../../db/models/acl/acl-action";
import {isTokenValid, requestResetPassword, updatePassword} from '../../service/user/user-forgot-password.service';
import {sendResetPassword} from '../../service/email/email.service';
import {authValidator, mailValidator} from '../middleware/validators/auth.validator';
import {companyValidator} from '../middleware/validators/company.validator';
import {getOrigin} from "../../util/request.util";

const auth = express.Router();

auth.get('/information', isAuthenticated(), (req, res) => {
  return res.status(200).json(req.user);
});

auth.get("/information/mobile", isAuthenticated(), (req, res, next) => {
  return selectCompany(req.user, req.user.companyId).then(resp => res.status(200).json(resp))
    .catch(next);
});

auth.get('/select-company', isAuthenticated(), (req, res, next) => {
  return selectCompany(req.user, Number(req.query.id)).then(resp => res.status(200).json(resp)).catch(next);
});

auth.get('/access-denied', hasPermission(PERMISSION.INVENTORY.READ), (req, res) => {
  return res.status(200).json(req.user);
});

auth.get('/access-denies', hasPermission([PERMISSION.INVENTORY.READ, PERMISSION.ORDER.CREATE]), (req, res) => {
  return res.status(200).json(req.user);
});

auth.get('/resendEmailActive', (req, res, next) => {
  const origin = getOrigin(req);
  return resendEmailActive(req.query.email, origin)
    .then(() => res.status(200).json({ok: 1}))
    .catch(next);
});

auth.post('/register', async (req, res, next) => {
  try {
    const origin = getOrigin(req);
    const registerResp = register(req.body, origin);
    res.status(200).json(registerResp);
  } catch (err) {
    next(err);
  }
});

auth.post('/sign-in', async (req, res, next) => {
  try {
    const data = await signIn(req.body);
    return res.json(data);
  } catch (e) {
    return next(e);
  }
});

auth.get('/sign-out', (req, res) => {
  req.logout();
  res.status(200)
    .send('{}');
});

auth.post('/email-verify', (req, res, next) => {
  confirmEmail(req.body.email, req.body.token)
    .then(result => {
      res.status(200)
        .json(result);
    }).catch(next);
});

auth.post('/forgot-password/send-mail', mailValidator, async (req, res, next) => {
  const {email} = req.body;
  try {
    const origin = getOrigin(req);
    const token = await requestResetPassword(email);
    sendResetPassword(email, token, origin).then();
    res.status(200)
      .json({ok: 1});
  } catch (error) {
    next(error);
  }
});

auth.get('/forgot-password/verify-token', (req, res, next) => {
  const {token} = req.query;
  isTokenValid(token)
    .then(rs => {
      res.status(200)
        .json(rs);
    }).catch(next);
});

auth.post('/forgot-password/reset', authValidator, (req, res, next) => {
  updatePassword(req.body).then(result => {
    res.status(200)
      .json(result);
  }).catch(next);
});

auth.post('/createCompanyOnboard', [companyValidator, isAuthenticated()], (req, res, next) => {
  return createCompanyOnboard(req.user, req.body)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebAuthController(app) {
  app.use('/api', auth);
}
