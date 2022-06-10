import express from "express";
import { isAuthenticated } from "../middleware/permission";
import { addEmailQueue } from "../../service/email/company-email.service";
import { API_PATH } from "./constants";

const emailRouter = express.Router();

emailRouter.post("/", isAuthenticated(), async (req, res, next) => {
  try {
    const emails = req.body;
    const rs = { success: [], fail: [] };
    for (let i = 0; i < emails.length; i += 1) {
      const email = emails[i];
      try {
        // eslint-disable-next-line no-await-in-loop
        const newEmail = await addEmailQueue({
          ...email,
          message: email.content,
          cc: email.cc ? email.cc.join(",") : "",
          bcc: email.bcc ? email.bcc.join(",") : ""
        }, req.user.companyId, req.user.id);
        rs.success.push({ id: newEmail.id });
      } catch (e) {
        console.error(e);
        rs.fail.push({ id: email.id, error: e.message });
      }
    }
    return res.status(200).json(rs);
  } catch (e1) {
    return next(e1);
  }
});

export function initEmailController(app) {
  app.use(`${API_PATH}/email`, emailRouter);
}
