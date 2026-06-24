import express from 'express';
import { userLogin } from '../../../service/auth/user-auth.service';
import { isAuthenticated } from '../../middleware/permission';

const auth = express.Router();

auth.post('/email/login', async (req, res, next) => {
  try {
    const data = await userLogin(req.body);
    return res.json(data);
  } catch (e) {
    return next(e);
  }
});

auth.get('/information', ...isAuthenticated(), (req, res) => {
  return res.status(200).json(req.user);
});

export function initWebAuthEmailController(app) {
  app.use('/api/auth', auth);
}
