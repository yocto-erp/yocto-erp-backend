import express from 'express';

import { hasPermission } from '../../middleware/permission';
import {PERMISSION} from "../../../db/models/acl/acl-action";
import { pagingParse } from '../../middleware/paging.middleware';
import { personValidator } from '../../middleware/validators/person.validator';
import { createPerson, getPerson, persons, removePerson, updatePerson } from '../../../service/person/person.service';

const person = express.Router();

person.get('/', [pagingParse({ column: 'id', dir: 'asc' }), hasPermission(PERMISSION.CUSTOMER.READ)], (req, res, next) => {
  return persons(req.query, req.paging.order, req.paging.offset, req.paging.size, req.user)
    .then(t => res.status(200).json(t))
    .catch(next);
});

person.get('/:id(\\d+)', hasPermission(PERMISSION.CUSTOMER.READ), (req, res, next) => {
  return getPerson(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

person.post('/', [hasPermission(PERMISSION.CUSTOMER.CREATE), personValidator],
  (req, res, next) => {
    return createPerson(req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

person.post('/:id(\\d+)', [hasPermission(PERMISSION.CUSTOMER.UPDATE), personValidator], (req, res, next) => {
  return updatePerson(req.params.id, req.body, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

person.delete('/:id(\\d+)', hasPermission(PERMISSION.CUSTOMER.DELETE), (req, res, next) => {
  return removePerson(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebPersonController(app) {
  app.use('/api/person', person);
}
