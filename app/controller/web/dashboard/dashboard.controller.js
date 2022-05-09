import express from "express";
import { isAuthenticated } from "../../middleware/permission";
import { API_PATH } from "../constants";
import { summaryStudentToday } from "../../../service/dashboard/dashboard.service";

const router = express.Router();

router.get("/student/today/summary", [isAuthenticated()],
  (req, res, next) => {
    return summaryStudentToday(req.user)
      .then(result => res.status(200).json(result))
      .catch(next);
  });


export function initMobileDashboardController(app) {
  app.use(`${API_PATH}/dashboard`, router);
}
