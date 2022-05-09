import express from "express";
import { isAuthenticated } from "../../middleware/permission";
import { handleMultiUpload } from "../../../service/file/storage.service";
import { getUserProfile, updateUserProfile } from "../../../service/user/member.service";

const router = express.Router();

router.get("/profile", isAuthenticated(),
  (req, res, next) => {
    return getUserProfile(req.user)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

router.post("/profile", [isAuthenticated(), handleMultiUpload.single("avatar")],
  (req, res, next) => {
    return updateUserProfile(req.user, req.body, req.file)
      .then(result => res.status(200).json(result))
      .catch(next);
  });


export function initWebMemberController(app) {
  app.use("/api/member", router);
}
