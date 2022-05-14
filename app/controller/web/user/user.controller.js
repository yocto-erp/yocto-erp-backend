import express from "express";
import { pagingParse } from "../../middleware/paging.middleware";
import { hasPermission } from "../../middleware/permission";
import { PERMISSION } from "../../../db/models/acl/acl-action";
import {
  confirmInvitation, editUser,
  getUser,
  inviteUser,
  removeUser, resendInvite,
  users,
  verifyInvite
} from "../../../service/user/user.service";
import { getOrigin } from "../../../util/request.util";

const user = express.Router();

user.get("/", hasPermission(PERMISSION.USER.READ),
  pagingParse({ column: "id", dir: "asc" }),
  (req, res, next) => {
    return users(req.user, req.query, req.paging.order, req.paging.offset, req.paging.size)
      .then(result => res.status(200).json(result)).catch(next);
  });

user.get("/:id(\\d+)", hasPermission(PERMISSION.USER.READ), (req, res, next) => {
  return getUser(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

user.post("/", hasPermission(PERMISSION.USER.CREATE), (req, res, next) => {
  const origin = getOrigin(req);
  return inviteUser(origin, req.user, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

user.post("/:id(\\d+)", hasPermission(PERMISSION.USER.UPDATE), (req, res, next) => {
  return editUser(req.user, req.params.id, req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

user.post("/:id(\\d+)/invite/resend", hasPermission(PERMISSION.USER.UPDATE), (req, res, next) => {
  const origin = getOrigin(req);
  return resendInvite(req.user, req.params.id, origin)
    .then(result => res.status(200).json(result)).catch(next);
});

user.get("/invite/verify", (req, res, next) => {
  return verifyInvite(req.query)
    .then(result => res.status(200).json(result)).catch(next);
});

user.post("/invite/verify", (req, res, next) => {
  return confirmInvitation(req.body)
    .then(result => res.status(200).json(result)).catch(next);
});

user.delete("/:id(\\d+)", hasPermission(PERMISSION.USER.DELETE), (req, res, next) => {
  return removeUser(req.user, req.params.id)
    .then(result => res.status(200).json(result))
    .catch(next);
});

export function initWebUserController(app) {
  app.use("/api/user", user);
}
