import express from 'express';
import { PUBLIC_PAYMENT } from './constant';
import { getPaymentRequest } from '../../../../service/payment/payment-request.service';

const router = express.Router();

router.get('/:publicId', (req, res, next) => {
  return getPaymentRequest(req.params.publicId, { isForceRefresh: req.query.isForceRefresh === '1' })
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initPaymentPublicController(app) {
  app.use(`${PUBLIC_PAYMENT}`, router);
}
