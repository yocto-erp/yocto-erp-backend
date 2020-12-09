import multer from 'multer';
import fs from 'fs';
import appConf from '../../config/application';
import db from '../../db/models';
import {appLog} from '../../config/winston';



export const handleSingleUpload = multer({
  dest: appConf.fileUploadDir,
  limits: {
    fileSize: 5242880
  }
}).single('file');

export const publicUploadHandler = multer({
  dest: appConf.emailFileUploadDir,
  limits: {
    fileSize: 5242880
  }
}).single('file');

export async function deleteFile(fileUploadId, {transaction}) {
  const fileUpload = await db.FileUpload.findByPk(fileUploadId, {transaction});
  if (fileUpload) {
    fs.unlink(`${appConf.fileUploadDir}/${fileUpload.filename}`, (err) => {
      if (err) {
        appLog.error(err.message, err);
      }
    });
    return fileUpload.destroy({transaction});
  }
  return null;
}
