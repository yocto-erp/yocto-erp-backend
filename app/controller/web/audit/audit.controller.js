import express from 'express';
import {hasPermission} from '../../middleware/permission';
import {PERMISSION} from "../../../db/models/acl/acl-action";
import {pagingParse} from '../../middleware/paging.middleware';
import {filter} from "../../../service/audit/audit.service";

const router = express.Router();

router.get('/', [hasPermission(PERMISSION.AUDIT),
  pagingParse({column: 'id', dir: 'asc'})],
  (req, res, next) => {
    return filter({paging: req.paging, user: req.user})
      .then(result => res.status(200).json(result))
      .catch(next);
  });


export function initAuditController(app) {
  app.use('/api/audit', router);
}
