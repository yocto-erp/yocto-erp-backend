import express from "express";

import { isAuthenticated } from "../../middleware/permission";

import {
  COMPANY_CONFIGURE_KEY,
  getCompanyConfigure, saveCompanyConfigure
} from "../../../service/configuration/configuration.service";
import { SALE_API_PATH } from "./constants";

const router = express.Router();

router.get("/", isAuthenticated(),
  (req, res, next) => {
    return getCompanyConfigure(req.user.companyId, COMPANY_CONFIGURE_KEY.SALE)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.post("/", isAuthenticated(),
  (req, res, next) => {
    return saveCompanyConfigure(req.user.companyId, COMPANY_CONFIGURE_KEY.SALE, req.body)
      .then(() => res.status(200).json({ ok: 1 }))
      .catch(next);
  });

export function initWebSaleSettingController(app) {
  app.use(`${SALE_API_PATH}/configure`, router);
}
