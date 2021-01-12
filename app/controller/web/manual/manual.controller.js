import express from 'express';
import {costSummary} from "../../../cron/report/report-cost";

const router = express.Router();

router.get('/cost-summary',
  (req, res, next) => {
    return costSummary()
      .then(result => res.status(200).json(result))
      .catch(next);
  });


export function initManualController(app) {
  app.use('/api/manual', router);
}
