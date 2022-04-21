import express from "express";

import { hasPermission, isAuthenticated } from "../../middleware/permission";
import { PERMISSION } from "../../../db/models/acl/acl-action";
import { pagingParse } from "../../middleware/paging.middleware";
import {
  students,
  getStudent,
  createStudent,
  updateStudent,
  removeStudent
} from "../../../service/student/student.service";
import { getStudentConfigure, saveStudentConfigure } from "../../../service/configuration/configuration.service";
import { studentValidator } from "../../middleware/validators/student/student.validator";

const student = express.Router();

student.get("/", [pagingParse({
  column: "id",
  dir: "asc"
}), hasPermission(PERMISSION.CUSTOMER.READ)], (req, res, next) => {
  return students(req.query, req.paging.order, req.paging.offset, req.paging.size, req.user)
    .then(t => res.status(200).json(t))
    .catch(next);
});

student.get("/:id(\\d+)", hasPermission(PERMISSION.CUSTOMER.READ), (req, res, next) => {
  return getStudent(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

student.post("/", [hasPermission(PERMISSION.CUSTOMER.CREATE), studentValidator],
  (req, res, next) => {
    return createStudent(req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

student.post("/:id(\\d+)", [hasPermission(PERMISSION.CUSTOMER.UPDATE), studentValidator], (req, res, next) => {
  return updateStudent(req.params.id, req.body, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

student.delete("/:id(\\d+)", hasPermission(PERMISSION.CUSTOMER.DELETE), (req, res, next) => {
  return removeStudent(req.params.id, req.user)
    .then(result => res.status(200).json(result))
    .catch(next);
});

student.get("/configure", isAuthenticated(),
  (req, res, next) => {
    return getStudentConfigure(req.user.companyId)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

student.post("/configure", isAuthenticated(),
  (req, res, next) => {
    return saveStudentConfigure(req.user.companyId, req.body)
      .then(() => res.status(200).json({ ok: 1 }))
      .catch(next);
  });

export function initWebStudentController(app) {
  app.use("/api/student", student);
}
