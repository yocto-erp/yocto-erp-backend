import express from 'express';
import { PUBLIC_PAYMENT_GW } from './constant';
import { confirmPayOSWebHook } from '../../../../service/public/payment/pay-os/pay-os.public.service';
import { getIP, userAgent } from '../../../../util/request.util';

const router = express.Router();

router.post('/webhook', (req, res, next) => {
  const ip = getIP(req);
  const ua = userAgent(req);
  return confirmPayOSWebHook(req.body, { ip, userAgent: ua })
    .then(result => res.status(200).json(result))
    .catch(next);
});


export function initPayOSPublicController(app) {
  app.use(`${PUBLIC_PAYMENT_GW}/pay-os`, router);
}
