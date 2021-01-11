import express from 'express';
import {isAuthenticated} from "../../middleware/permission";
import {globalSummary} from "../../../service/report/summary.service";

const router = express.Router();

router.get('/', isAuthenticated(), async (req, res, next) => {
  return globalSummary(req.query.fromDate, req.query.toDate).then(t => res.status(200).json(t))
    .catch(next);
});

export function initSummaryController(app) {
  app.use('/api/summary', router);
}
