import express from 'express';
import { hasPermission } from '../../middleware/permission';
import { PERMISSION } from '../../../db/models/acl/acl-action';
import { createEcommerceProduct } from '../../../service/ecommerce/ecommerce-product.service';
import { posOrderValidator } from '../../middleware/validators/pos-purchase.validator';


const router = express.Router();

router.post('/', [posOrderValidator, hasPermission(PERMISSION.ECOMMERCE.POS.CREATE)], (req, res, next) => {
  return createEcommerceProduct(req.user, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

export function initWebEcommercePosController(app) {
  app.use('/api/ecommerce/pos', router);
}
