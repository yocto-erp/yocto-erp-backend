import express from 'express';
import { pagingParse } from '../../middleware/paging.middleware';
import { hasPermission } from '../../middleware/permission';
import { PERMISSION } from '../../../db/models/acl/acl-action';
import { users, getUser, removeUser } from '../../../service/user/user.service';

const user = express.Router();

user.get('/',  hasPermission(PERMISSION.PRODUCT.READ),
  pagingParse({column: 'id', dir: 'asc'}),
  (req, res, next) => {
    return users(req.user, req.query, req.paging.order, req.paging.offset, req.paging.size)
      .then(result => res.status(200).json(result)).catch(next);
  });

user.get('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.READ), (req, res, next) => {
  return getUser(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

//
// user.post('/', (req, res, next) => {
//   return inviteUser(req.user, req.body)
//     .then(result => res.status(200).json(result)).catch(next);
// });
//
// user.post('/:id(\\d+)', hasPermission(PERMISSION.PRODUCT.UPDATE), (req, res, next) => {
//   return updateUser(req.params.id, req.user, req.body)
//     .then(result => res.status(200).json(result))
//     .catch(next);
// });

user.delete('/:id(\\d+)',  hasPermission(PERMISSION.PRODUCT.DELETE),  (req, res, next) => {
  return removeUser(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebUserController(app) {
  app.use('/api/user', user);
}
