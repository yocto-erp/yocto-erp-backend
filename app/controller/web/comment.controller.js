import express from "express";
import { hasPermission } from "../middleware/permission";
import { PERMISSION } from "../../db/models/acl/acl-action";
import { pagingParse } from "../middleware/paging.middleware";
import { API_PATH } from "./constants";
import { addComment, listComment, removeComment } from "../../service/comment/comment.service";
import { commentValidator } from "../middleware/validators/comment.validator";

const router = express.Router();

router.get("/:id(\\d+)/:purpose(\\d+)", [hasPermission(PERMISSION.COMMENT.READ),
    pagingParse([{ column: "id", dir: "desc" }])],
  (req, res, next) => {
    return listComment(req.user, req.params.purpose, req.params.id, req.paging)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.post("/:id(\\d+)/:purpose(\\d+)", [hasPermission(PERMISSION.COMMENT.CREATE), commentValidator],
  (req, res, next) => {
    return addComment(req.user, req.params.purpose, req.params.id, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.delete("/:id(\\d+)/:purpose(\\d+)/:cid(\\d+)", [hasPermission(PERMISSION.COMMENT.CREATE), commentValidator],
  (req, res, next) => {
    return removeComment(req.user, req.params.purpose, req.params.id, req.params.cid)
      .then(result => res.status(200).json(result))
      .catch(next);
  });


export function initWebCommentController(app) {
  app.use(`${API_PATH}/comment`, router);
}
