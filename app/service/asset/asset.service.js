import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import md5 from "md5";
import sharp from "sharp";
import { QueryTypes } from "sequelize";
import db from "../../db/models";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { SYSTEM_CONFIG } from "../../config/system";
import { ASSET_TYPE } from "../../db/models/asset/asset";
import { hasText } from "../../util/string.util";
import { isImageMimeType } from "../../util/image.util";
import { SYSTEM_STATUS } from "../../db/models/constants";

const { Op } = db.Sequelize;

export const ASSET_STORE_FOLDER = SYSTEM_CONFIG.UPLOAD_FOLDER;

export async function listAsset(user, { parentId, search }, { offset, limit, order }) {
  const where = {
    companyId: user.companyId,
    parentId: null,
    systemStatus: SYSTEM_STATUS.NORMAL
  };
  if (hasText(parentId)) {
    where.parentId = parentId;
  }
  if (hasText(search)) {
    where.name = {
      [Op.like]: `%${search}%`
    };
  }
  console.log("listAsset", offset, limit, order);
  return db.Asset.findAndCountAll({
    where,
    order,
    offset,
    limit,
    include: [
      { model: db.AssetIpfs, as: "ipfs" }
    ]
  });
}

export function createAssetFolder(user, form) {
  return db.Asset.create({
    name: form.name,
    size: 0,
    fileId: uuidv4(),
    type: ASSET_TYPE.FOLDER,
    parentId: form.parentId || null,
    companyId: user.companyId,
    createdById: user.id,
    createdDate: new Date()
  });
}

/**
 * Generate thumbnail view after upload, only genereate for image file now
 * {
 *   originalname, size, mimetype, filename: filename store on harddisk
 * }
 * @param file: file after multer process
 * @returns {Promise<void>}
 */
async function generatePreview(file) {
  if (isImageMimeType(file.mimetype)) {
    sharp(`${ASSET_STORE_FOLDER}/${file.filename}`)
      .flatten()
      .resize(200, 200, {
        fit: sharp.fit.contain,
        position: "centre",
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(`${SYSTEM_CONFIG.PUBLIC_FOLDER}/thumbnail/${file.filename}.png`).then(() => {
    }, (err) => {
      console.log("thumbnail error", err);
    });
  } else {
    console.log("File no need generate preview", file);
  }
}

export async function storeFiles(user, form, parentId) {
  const rs = await db.Asset.create({
    name: form.originalname,
    size: form.size,
    fileId: form.filename,
    type: ASSET_TYPE.FILE,
    mimeType: form.mimetype,
    parentId: parentId || null,
    companyId: user.companyId,
    createdById: user.id,
    createdDate: new Date()
  });
  generatePreview(form).then();
  return rs;
}

export function deletePublicFile(filename) {
  const folder = SYSTEM_CONFIG.UPLOAD_FOLDER;

  if (fs.existsSync(`${folder}/${filename}`)) {
    fs.unlinkSync(
      `${folder}/${filename}`
    );
  }
}

export function deleteFile(fileId) {
  const folder = ASSET_STORE_FOLDER;

  if (fs.existsSync(`${folder}/${fileId}`)) {
    fs.unlinkSync(
      `${folder}/${fileId}`
    );
  }
}

export async function generateProductThumbnail(productId) {
  const asset = await db.ProductAsset.findOne({
    where: {
      productId
    },
    include: [
      { model: db.Asset, as: "asset", required: true }
    ],
    order: [["priority", "asc"]],
    limit: 1
  });

  const product = await db.Product.findByPk(productId);
  if (asset && product) {
    const { fileId } = asset.asset;
    const filename = md5(`${productId}_${fileId}`);
    console.log("generateProductThumbnail", productId, fileId, product.thumbnail);
    const newThumbnailUrl = `${filename}.png`;
    if (newThumbnailUrl !== product.thumbnail) {
      deletePublicFile(product.thumbnail);
      sharp(`${ASSET_STORE_FOLDER}/${fileId}`)
        .resize(200, 200, {
          fit: sharp.fit.contain,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(`${SYSTEM_CONFIG.PUBLIC_FOLDER}/${newThumbnailUrl}`)
        .then(async () => {
          product.thumbnail = newThumbnailUrl;
          await product.save();
        });
    }
  }
}

export async function getAssetByUUID(uuid) {
  const asset = await db.Asset.findOne({
    attributes: ["fileId"],
    where: {
      fileId: uuid,
      systemStatus: SYSTEM_STATUS.NORMAL
    }
  });
  if (!asset) {
    throw badRequest("image", FIELD_ERROR.INVALID, "image not found");
  }

  return asset;
}

export async function removeAssets(user, ids) {
  const listId = ids.split(",").map(t => Number(t));
  const assets = await db.Asset.findAll({
    where: {
      id: {
        [Op.in]: listId
      },
      companyId: user.companyId,
      systemStatus: SYSTEM_STATUS.NORMAL
    }
  });

  let totalFile = 0;
  const transaction = await db.sequelize.transaction();

  try {
    for (let i = 0; i < assets.length; i += 1) {
      const asset = assets[i];
      if (asset.type === ASSET_TYPE.FOLDER) {
        // eslint-disable-next-line no-await-in-loop
        const rs = await db.sequelize.query(`with recursive cte (id, name, fileId, parentId) as (
          select     id,
                     name,
                     fileId, parentId
          from       asset
          where      parentId = ${asset.id}
          union all
            select     p.id,
                       p.name,
                       p.fileId, p.parentId
            from       asset p
          inner join cte
                  on p.parentId = cte.id
        )
        UPDATE asset
        SET systemStatus = ${SYSTEM_STATUS.DELETED},
            lastModifiedDate = now()
            WHERE id IN (select id from cte);`,
          { type: QueryTypes.BULKUPDATE }, { transaction });
        console.log("rs: ", rs);
        totalFile += rs;
      }
      asset.systemStatus = SYSTEM_STATUS.DELETED;
      asset.lastModifiedDate = new Date();
      totalFile += 1;
      // eslint-disable-next-line no-await-in-loop
      await asset.save({ transaction });
    }

    await transaction.commit();
    return totalFile;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

