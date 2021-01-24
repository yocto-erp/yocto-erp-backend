import express from 'express';
import {isAuthenticated} from "../../middleware/permission";
import {pagingParse} from "../../middleware/paging.middleware";
import {createTag, getListTags} from "../../../service/tagging/tagging.service";

const router = express.Router();

router.get('/', [isAuthenticated(), pagingParse({column: 'id', dir: 'asc'})], async (req, res, next) => {
  return getListTags(req.query, req.paging.order, req.paging.offset, req.paging.limit, req.user)
    .then(t => res.status(200).json(t))
    .catch(next);
});

router.post('/', isAuthenticated(), async (req, res, next) => {
  return createTag(req.body, req.user)
    .then(t => res.status(200).json(t))
    .catch(next);
});

export function initTaggingController(app) {
  app.use('/api/tagging', router);
}
