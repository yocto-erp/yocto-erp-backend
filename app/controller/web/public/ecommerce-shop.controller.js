import express from 'express';
import { getListTags, listPublicECommerceProducts } from '../../../service/public/public.service';
import { pagingParse } from '../../middleware/paging.middleware';

const ecommerceShop = express.Router();

ecommerceShop.get('/products',
  pagingParse({ column: 'id', dir: 'asc' }),
  (req, res, next) => {
    return listPublicECommerceProducts(req.query, req.paging.order, req.paging.offset, req.paging.size)
      .then(result => res.status(200).json(result)).catch(next);
  });

ecommerceShop.get('/', [pagingParse({column: 'id', dir: 'asc'})], async (req, res, next) => {
  return getListTags(req.query, req.paging.order, req.paging.offset, req.paging.limit)
    .then(t => res.status(200).json(t))
    .catch(next);
});
export function initWebEcommerceShopController(app) {
  app.use('/api/ecommerce-shop', ecommerceShop);
}
