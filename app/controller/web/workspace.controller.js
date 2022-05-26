import express from "express";
import { isAuthenticated } from "../middleware/permission";
import { pagingParse } from "../middleware/paging.middleware";
import { API_PATH } from "./constants";
import { companyValidator } from "../middleware/validators/company.validator";
import { createWorkSpace, listWorkSpace } from "../../service/workspace.service";

const router = express.Router();

router.get("/", [isAuthenticated(),
    pagingParse([{ column: "companyId", dir: "asc" }])],
  (req, res, next) => {
    return listWorkSpace(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.post("/", [isAuthenticated(), companyValidator],
  (req, res, next) => {
    return createWorkSpace(req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

export function initWebWorkspaceController(app) {
  app.use(`${API_PATH}/workspace`, router);
}
