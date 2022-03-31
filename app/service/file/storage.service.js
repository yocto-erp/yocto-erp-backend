import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import {SYSTEM_CONFIG} from "../../config/system";

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
