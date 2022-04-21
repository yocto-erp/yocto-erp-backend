import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { SYSTEM_CONFIG } from "../../config/system";

const storage = multer.diskStorage({
  destination: function dest(req, file, cb) {
    cb(null, SYSTEM_CONFIG.UPLOAD_FOLDER);
  },
  filename: function filename(req, file, cb) {
    cb(null, uuidv4());
  }
});

export const handleMultiUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5242880
  }
});

export function storeFileFromBase64(baseImage) {
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );
  const fileType = baseImage.substring("data:".length, baseImage.indexOf("/"));
  const regex = new RegExp(`^data:${fileType}/${ext};base64,`, "gi");
  const base64Data = baseImage.replace(regex, "");
  const filename = uuidv4();

  fs.writeFileSync(`${SYSTEM_CONFIG.UPLOAD_FOLDER}/${filename}`, base64Data, "base64");

  return filename;
}
