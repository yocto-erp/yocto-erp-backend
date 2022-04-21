import express from "express";

import { isAuthenticated } from "../../middleware/permission";

import { getListStudentTracking, sign } from "../../../service/student/student-tracking.service";
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
  console.log(req.headers)
  return sign(req.user, req.body, ip, req.headers['x-device-id'], clientAgent)
    .then(t => res.status(200).json(t))
    .catch(next);
});


export function initWebStudentTrackingController(app) {
  app.use("/api/student-tracking", router);
}
