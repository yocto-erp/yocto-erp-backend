import express from 'express';
import * as userService from '../../service/user/user.service';
import {isAuthenticated} from '../middleware/permission';
import {register, signIn} from "../../service/user/auth.service";
import {appLog} from "../../config/winston";

const auth = express.Router();

auth.get('/information', isAuthenticated(), (req, res) => {
  return res.status(200).json(req.user);
});

auth.post('/register', (req, res, next) => {
  return register(req.body)
    .then((newUser) => {
      res.json(newUser);
    }, next);
});

auth.get('/resendEmailActive', (req, res, next) => {
  return userService.resendEmailActive(req.query.email)
    .then(() => res.status(200).json({ok: 1}))
    .catch(next);
});

auth.post('/sign-in', async (req, res, next) => {
  try {
    const resp = await signIn(req.body);
    appLog.info(JSON.stringify(resp));
    return res.json(resp);
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
  userService.confirmEmail(req.body.email, req.body.token)
    .then((t) => {
      res.status(200)
        .json(t);
    }, next);
});

export function initMobileAuthController(app) {
  app.use('/mobile', auth);
}
