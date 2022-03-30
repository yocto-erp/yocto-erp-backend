import {v4 as uuidv4} from 'uuid';
import _ from 'lodash';
import fs from 'fs';
import md5 from 'md5';
import sharp from 'sharp';
import db from '../../db/models';
import ProductAsset from '../../db/models/product/product-asset';
import {badRequest, FIELD_ERROR} from '../../config/error';
import CostAsset from '../../db/models/cost/cost-asset';
import {SYSTEM_CONFIG} from '../../config/system';
import {ASSET_TYPE} from "../../db/models/asset";
import {hasText} from "../../util/string.util";

const {Op} = db.Sequelize;

export const ASSET_STORE_FOLDER = SYSTEM_CONFIG.UPLOAD_FOLDER;

export async function listAsset(user, {parentId, search}, paging) {
  const where = {
    companyId: user.companyId
  }
  if (hasText(parentId)) {
    where.parentId = parentId
  }
  if (hasText(search)) {
    where.name = {
      [Op.like]: `%${search}%`
    }
  }
  return db.Asset.findAndCountAll({
    where,
    ...paging
  })
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
  })
}

export async function storeFileFromBase64(baseImage) {
  const ext = baseImage.substring(
    baseImage.indexOf('/') + 1,
    baseImage.indexOf(';base64')
  );
  const fileType = baseImage.substring('data:'.length, baseImage.indexOf('/'));
  const regex = new RegExp(`^data:${fileType}/${ext};base64,`, 'gi');
  const base64Data = baseImage.replace(regex, '');
  const filename = uuidv4();

  fs.writeFileSync(`${ASSET_STORE_FOLDER}/${filename}`, base64Data, 'base64');

  return filename;
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

export async function mergeAssets(oldFormAssets, newFormAsset, companyId, transaction) {
  console.log(oldFormAssets);
  const listMergeAssets = [];
  if (newFormAsset && newFormAsset.length) {
    for (let i = 0; i < newFormAsset.length; i += 1) {
      const {fileId, data, id, name, type, size} = newFormAsset[i];
      let newAssetId = id;
      if (!fileId) {
        /**
         * New Upload File
         * @type {*|string}
         */
          // eslint-disable-next-line no-await-in-loop
        const newAsset = await db.Asset.create({
            name,
            mimeType: type,
            type: ASSET_TYPE.FILE,
            size,
            // eslint-disable-next-line no-await-in-loop
            fileId: await storeFileFromBase64(data),
            companyId: companyId,
            createdDate: new Date()
          });
        newAssetId = newAsset.id;
      } else {
        /**
         * File existed on server, now we remove file from old list
         */
        _.remove(oldFormAssets, val => val.fileId === fileId);
      }
      listMergeAssets.push({
        assetId: newAssetId,
        priority: i
      });
    }
  }
  if (oldFormAssets && oldFormAssets.length) {
    for (let j = 0; j < oldFormAssets.length; j += 1) {
      // eslint-disable-next-line no-await-in-loop
      await deleteFile(oldFormAssets[j].fileId);
      // eslint-disable-next-line no-await-in-loop
      await oldFormAssets[j].destroy({transaction});
    }
    // oldFormAssets.destroy({ transaction });
  }
  return listMergeAssets;
}

export async function generateProductThumbnail(productId) {
  const asset = await db.ProductAsset.findOne({
    where: {
      productId
    },
    include: [
      {model: db.Asset, as: 'asset', required: true}
    ],
    order: [['priority', 'asc']],
    limit: 1
  });

  const product = await db.Product.findByPk(productId);
  if (asset && product) {
    const {fileId} = asset.asset;
    const filename = md5(`${productId}_${fileId}`);
    console.log('generateProductThumbnail', productId, fileId, product.thumbnail);
    const newThumbnailUrl = `${filename}.png`;
    if (newThumbnailUrl !== product.thumbnail) {
      deletePublicFile(product.thumbnail);
      sharp(`${ASSET_STORE_FOLDER}/${fileId}`)
        .resize(200, 200, {
          fit: sharp.fit.contain,
          background: {r: 0, g: 0, b: 0, alpha: 0}
        })
        .toFile(`${SYSTEM_CONFIG.PUBLIC_FOLDER}/${newThumbnailUrl}`)
        .then(async () => {
          product.thumbnail = newThumbnailUrl;
          await product.save();
        });
    }
  }
}

export async function createProductAsset(
  productId,
  companyId,
  assetsForm,
  transaction
) {
  const assets = [];
  for (let i = 0; i < assetsForm.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const fileId = await storeFileFromBase64(assetsForm[i].data);
    assets.push({
      name: assetsForm[i].name,
      mimeType: assetsForm[i].type,
      type: ASSET_TYPE.FILE,
      size: assetsForm[i].size,
      fileId: fileId,
      companyId: companyId,
      createdDate: new Date()
    });
  }
  const assetModels = await db.Asset.bulkCreate(assets, {transaction});
  await ProductAsset.bulkCreate(
    assetModels.map((t, i) => {
      return {
        assetId: t.id,
        productId: productId,
        priority: i
      };
    }),
    {transaction}
  );
  return assetModels;
}

export async function updateProductAssets(newAssets, productId, transaction) {
  await db.ProductAsset.destroy({
    where: {
      productId: productId
    }
  }, {transaction});
  if (newAssets && newAssets.length) {
    await ProductAsset.bulkCreate(
      newAssets.map((t) => {
        return {
          ...t,
          productId: productId
        };
      }),
      {transaction}
    );
  }
}

export async function removeProductAssets(product, transaction) {
  for (let j = 0; j < product.assets.length; j += 1) {
    // eslint-disable-next-line no-await-in-loop
    await deleteFile(product.assets[j].fileId);
  }
  const assetId = await product.assets.map(result => result.id);
  await db.Asset.destroy({
    where: {id: {[Op.in]: assetId}}
  }, {transaction});

  return db.ProductAsset.destroy({
    where: {
      productId: product.id,
      assetId: {
        [Op.in]: assetId
      }
    }
  }, {transaction});
}

export async function getAssetByUUID(uuid) {
  const asset = await db.Asset.findOne({
    attributes: ['fileId'],
    where: {
      fileId: uuid
    }
  });
  if (!asset) {
    throw badRequest('image', FIELD_ERROR.INVALID, 'image not found');
  }

  return asset;
}

export async function createCostAsset(
  costId,
  companyId,
  assetsForm,
  transaction
) {
  const assets = [];
  for (let i = 0; i < assetsForm.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const fileId = await storeFileFromBase64(assetsForm[i].data);
    assets.push({
      name: assetsForm[i].name,
      mimeType: assetsForm[i].type,
      type: ASSET_TYPE.FILE,
      size: assetsForm[i].size,
      fileId: fileId,
      companyId: companyId,
      createdDate: new Date()
    });
  }
  const assetModels = await db.Asset.bulkCreate(assets, {transaction});
  return CostAsset.bulkCreate(
    assetModels.map((t) => {
      return {
        assetId: t.id,
        costId: costId
      };
    }),
    {transaction}
  );
}

export async function updateCostAssets(arrayDelete, arrayCreate, costId, transaction) {
  if (arrayCreate && arrayCreate.length) {
    const assetModels = await db.Asset.bulkCreate(arrayCreate, {transaction});
    await CostAsset.bulkCreate(
      assetModels.map((t) => {
        return {
          assetId: t.id,
          costId: costId
        };
      }),
      {transaction}
    );
  }

  if (arrayDelete && arrayDelete.length) {
    const assetId = await arrayDelete.map(result => result.id);
    await db.Asset.destroy({
      where: {id: {[Op.in]: assetId}}
    }, {transaction});

    await db.CostAsset.destroy({
      where: {
        costId: costId,
        assetId: {
          [Op.in]: assetId
        }
      }
    }, {transaction});
  }
}

export async function removeCostAssets(cost, transaction) {
  for (let j = 0; j < cost.assets.length; j += 1) {
    // eslint-disable-next-line no-await-in-loop
    await deleteFile(cost.assets[j].fileId);
  }
  const assetId = await cost.assets.map(result => result.id);
  await db.Asset.destroy({
    where: {id: {[Op.in]: assetId}}
  }, {transaction});

  return db.CostAsset.destroy({
    where: {
      costId: cost.id,
      assetId: {
        [Op.in]: assetId
      }
    }
  }, {transaction});
}

