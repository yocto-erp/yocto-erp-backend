import {stat} from "fs";
import {SYSTEM_CONFIG} from "../../config/system";

export const checkFileExisted = (url) => new Promise((resolve, reject) => {
  stat(url, (err, stats) => {
    if (err) {
      reject(err)
    }
    resolve(stats)
  })
})

export const filterFileExisted = async (listAssets) => {
  const files = [];
  const checkFilePromise = [];
  for (let i = 0; i < listAssets.length; i += 1) {
    checkFilePromise.push(checkFileExisted(`${SYSTEM_CONFIG.UPLOAD_FOLDER}/${listAssets[i]}`)
      .then(() => {
        files.push(`${SYSTEM_CONFIG.UPLOAD_FOLDER}/${listAssets[i]}`)
      }).catch(e => {
        // TODO: what we can do if the file is not existed on hard disk, but still on DB, should we delete it.
        console.log(e)
      })
    )
  }
  await Promise.all(checkFilePromise)
  return files
}
