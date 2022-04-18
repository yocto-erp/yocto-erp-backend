import express from 'express';
import {
  getEcommerceProductShop,
  getListTags, listPublicECommerceProductsShop
} from '../../../service/public/public.service';
import { pagingParse } from '../../middleware/paging.middleware';
import { getIP, userAgent } from '../../../util/request.util';
import { userOrderProductInShop } from '../../../service/public/user-order.service';

const ecommerceShop = express.Router();

ecommerceShop.get('/products',
  pagingParse({ column: 'id', dir: 'asc' }),
  (req, res, next) => {
    return listPublicECommerceProductsShop(req.query, req.paging.order, req.paging.offset, req.paging.size)
      .then(result => res.status(200).json(result)).catch(next);
  });

ecommerceShop.get("/:id(\\d+)", (req, res, next) => {
  return getEcommerceProductShop(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

ecommerceShop.get('/', [pagingParse({column: 'id', dir: 'asc'})], async (req, res, next) => {
  return getListTags(req.query, req.paging.order, req.paging.offset, req.paging.limit)
    .then(t => res.status(200).json(t))
    .catch(next);
});

ecommerceShop.post("/", (req, res, next) => {
  const ip = getIP(req);
  const clientAgent = userAgent(req);
  return userOrderProductInShop(req.body, clientAgent, ip)
    .then(result => res.status(200).json(result))
    .catch(next);
});
export function initWebEcommerceShopController(app) {
  app.use('/api/ecommerce-shop', ecommerceShop);
}
