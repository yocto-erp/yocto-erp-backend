import express from 'express';
import {hasPermission, isAuthenticated} from "../../middleware/permission";
import {pagingParse} from "../../middleware/paging.middleware";
import {createTag, getListTags, readTagging, removeTagging} from "../../../service/tagging/tagging.service";

const router = express.Router();

router.get('/', [hasPermission(100), pagingParse({column: 'id', dir: 'asc'})], async (req, res, next) => {
  return getListTags(req.query, req.paging.order, req.paging.offset, req.paging.limit, req.user)
    .then(t => res.status(200).json(t))
    .catch(next);
});

router.post('/', isAuthenticated(), async (req, res, next) => {
  return createTag(req.body, req.user)
    .then(t => res.status(200).json(t))
    .catch(next);
});

router.get('/:id(\\d+)', isAuthenticated(), (req, res, next) => {
  return readTagging(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

router.delete('/:id(\\d+)', isAuthenticated(), (req, res, next) => {
  return removeTagging(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initTaggingController(app) {
  app.use('/api/tagging', router);
}
