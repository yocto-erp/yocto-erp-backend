import express from "express";

import { isAuthenticated } from "../../middleware/permission";

import { getListStudentTracking } from "../../../service/student/student-tracking.service";

const router = express.Router();

router.get("/", [isAuthenticated()], (req, res, next) => {
  return getListStudentTracking(req.user, req.query)
    .then(t => res.status(200).json(t))
    .catch(next);
});


export function initWebStudentTrackingController(app) {
  app.use("/api/student-tracking", router);
}
