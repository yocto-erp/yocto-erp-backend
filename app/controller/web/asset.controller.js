import express from "express";
import fs from "fs";
import {
  ASSET_STORE_FOLDER,
  createAssetFolder,
  getAssetByUUID,
  listAsset, removeAssets,
  storeFiles
} from "../../service/asset/asset.service";
import { hasPermission } from "../middleware/permission";
import { PERMISSION } from "../../db/models/acl/acl-action";
import { pagingParse } from "../middleware/paging.middleware";
import { handleMultiUpload } from "../../service/file/storage.service";

const imageRouter = express.Router();

imageRouter.get("/", [hasPermission(PERMISSION.ASSET.READ),
    pagingParse([{ column: "type", dir: "desc" }, { column: "name", dir: "asc" }])],
  (req, res, next) => {
    return listAsset(req.user, req.query, req.paging)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

imageRouter.post("/", hasPermission(PERMISSION.ASSET.CREATE),
  (req, res, next) => {
    return createAssetFolder(req.user, req.body)
      .then(result => res.status(200).json(result))
      .catch(next);
  });

imageRouter.post("/upload", hasPermission(PERMISSION.ASSET.CREATE),
  handleMultiUpload.array("files", 3),
  (req, res, next) => {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    storeFiles(req.user, req.files[0], req.body.parentId).then(result => res.status(200).json(result))
      .catch(next);
  });

imageRouter.get("/:uuid", async (req, res, next) => {
  try {
    const asset = await getAssetByUUID(req.params.uuid);
    const s = fs.createReadStream(`${ASSET_STORE_FOLDER}/${asset.fileId}`);
    s.on("open", function onOpen() {
      res.set("Content-Type", asset.type || "application/octet-stream");
      s.pipe(res);
    });
    s.on("error", function onError() {
      res.set("Content-Type", "text/plain");
      res.status(404).end("Not found");
    });
  } catch (e) {
    next(e);
  }
});

imageRouter.delete("/:ids", hasPermission(PERMISSION.ASSET.DELETE), (req, res, next) => {
  return removeAssets(req.user, req.params.ids)
    .then(result => res.status(200).json({ total: result }))
    .catch(next);
});

export function initWebAssetController(app) {
  app.use("/api/image", imageRouter);
}
