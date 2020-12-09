import express from 'express';
import fs from "fs";
import {ASSET_STORE_FOLDER, getAssetByUUID} from '../../service/asset/asset.service';

const image = express.Router();

image.get('/:uuid', async (req, res, next) => {
  try {
    const asset = await getAssetByUUID(req.params.uuid);
    const s = fs.createReadStream(`${ASSET_STORE_FOLDER}/${asset.fileId}`);
    s.on('open', function onOpen() {
      res.set('Content-Type', asset.type || 'application/octet-stream');
      s.pipe(res);
    });
    s.on('error', function onError() {
      res.set('Content-Type', 'text/plain');
      res.status(404).end('Not found');
    });
  } catch (e) {
    next(e);
  }
});

export function initWebAssetController(app) {
  app.use('/api/image', image);
}
