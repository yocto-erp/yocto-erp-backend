import express from "express";

import { isAuthenticated } from "../../middleware/permission";

import {
  getListStudentTracking,
  listStudentTracking,
  sign, studentTrackingStatusSummary,
  updateStudentTrackingStatus
} from "../../../service/student/student-tracking.service";
import { getIP, userAgent } from "../../../util/request.util";

const router = express.Router();

router.get("/", [isAuthenticated()], (req, res, next) => {
  return getListStudentTracking(req.user, req.query)
    .then(t => res.status(200).json(t))
    .catch(next);
});

router.post("/", [isAuthenticated()], (req, res, next) => {
  const ip = getIP(req);
  const clientAgent = userAgent(req);
  console.log(req.headers);
  return sign(req.user, req.body, ip, req.headers["x-device-id"], clientAgent)
    .then(t => res.status(200).json(t))
    .catch(next);
});

router.get("/student", [isAuthenticated()], (req, res, next) => {
  return listStudentTracking(req.user, req.query)
    .then(t => res.status(200).json(t))
    .catch(next);
});

router.post("/student", [isAuthenticated()], (req, res, next) => {
  return updateStudentTrackingStatus(req.user, req.body)
    .then(t => res.status(200).json(t))
    .catch(next);
});

router.get("/summary", [isAuthenticated()], (req, res, next) => {
  return studentTrackingStatusSummary(req.user, req.query)
    .then(t => res.status(200).json(t))
    .catch(next);
});


export function initWebStudentTrackingController(app) {
  app.use("/api/student-tracking", router);
}
