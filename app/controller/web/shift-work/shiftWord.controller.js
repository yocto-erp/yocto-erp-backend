import express  from 'express';

import { hasPermission} from '../../middleware/permission';
import { pagingParse} from '../../middleware/paging.middleware';
import  { shiftWorkValidator } from '../../middleware/validators/shiftWork.validator';
import { PERMISSION } from '../../../db/models/acl/acl-action';
import {
  createShiftWord,
  getShiftWord,
  removeShiftWork, search,
  updateShiftWord
} from '../../../service/shiftWork/shiftWork.service';



const shiftWord = express.Router();
shiftWord.get('/', hasPermission(PERMISSION.SHIFTWORK.READ),
  pagingParse({ dir:'asc'}),
  (req, res, next) => {
  return search(req.user, req.query, req.paging.order, req.paging.offset, req.paging.size)
    .then(result => res.status(200).json(result))
    .catch(next);
  });
shiftWord.get('/:id(\\d+)', hasPermission(PERMISSION.SHIFTWORK.READ), (req, res, next) => {
  return getShiftWord(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});
shiftWord.post('/', hasPermission(PERMISSION.SHIFTWORK.READ),
  (req, res, next) => {
    return createShiftWord(req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });
shiftWord.post('/:id(\\d+)', [shiftWorkValidator, hasPermission(PERMISSION.SHIFTWORK.UPDATE)],
  (req, res, next) => {
    return updateShiftWord(req.params.id, req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });
shiftWord.delete('/:id(\\d+)', hasPermission(PERMISSION.SHIFTWORK.DELETE),
  (req, res, next) => {
    return removeShiftWork(req.params.id)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

export function initWebshiftWorkController(app) {
  app.use('/api/shift-work', shiftWord);
}

