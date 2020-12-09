import {v4 as uuidv4} from 'uuid';
import _ from 'lodash';
import fs from 'fs';
import db from '../../db/models';
import ProductAsset from '../../db/models/product/product-asset';
import {badRequest, FIELD_ERROR} from '../../config/error';
import CostAsset from '../../db/models/cost/cost-asset';

const {Op} = db.Sequelize;

export const ASSET_STORE_FOLDER = './uploads';
export const ASSET_STORE_FOLDER_TEST = './uploadsTest';

if (!fs.existsSync(`${ASSET_STORE_FOLDER}/`)) {
  fs.mkdirSync(`${ASSET_STORE_FOLDER}/`);
}

if (!fs.existsSync(`${ASSET_STORE_FOLDER_TEST}/`)) {
  fs.mkdirSync(`${ASSET_STORE_FOLDER_TEST}/`);
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

  if (process.env.NODE_ENV !== 'test') {
    fs.writeFileSync(`${ASSET_STORE_FOLDER}/${filename}`, base64Data, 'base64');
  } else {
    fs.writeFileSync(
      `${ASSET_STORE_FOLDER_TEST}/${filename}`,
      base64Data,
      'base64'
    );
  }
  return filename;
}

export function deleteFile(fileId) {
  let folder = ASSET_STORE_FOLDER;
  if (process.env.NODE_ENV === 'test') {
    folder = ASSET_STORE_FOLDER_TEST;
  }

  if (fs.existsSync(`${folder}/${fileId}`)) {
    fs.unlinkSync(
      `${folder}/${fileId}`
    );
  }
}

export async function mergeAssets(oldFormAssets, newFormAsset, companyId) {
  const listMergeAssets = [];
  if (newFormAsset && newFormAsset.length) {
    for (let i = 0; i < newFormAsset.length; i += 1) {
      if (!newFormAsset[i].fileId) {
        // eslint-disable-next-line no-await-in-loop
        const fileId = await storeFileFromBase64(newFormAsset[i].data);
        listMergeAssets.push({
          name: newFormAsset[i].name,
          type: newFormAsset[i].type,
          size: newFormAsset[i].size,
          fileId: fileId,
          companyId: companyId,
          createdDate: new Date()
        });
      } else {
        _.remove(oldFormAssets, val => val.fileId === newFormAsset[i].fileId);
      }
    }
  }
  if (oldFormAssets && oldFormAssets.length) {
    for (let j = 0; j < oldFormAssets.length; j += 1) {
      // eslint-disable-next-line no-await-in-loop
      await deleteFile(oldFormAssets[j].fileId);
    }
  }
  return listMergeAssets;
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
      type: assetsForm[i].type,
      size: assetsForm[i].size,
      fileId: fileId,
      companyId: companyId,
      createdDate: new Date()
    });
  }
  const assetModels = await db.Asset.bulkCreate(assets, {transaction});
  return ProductAsset.bulkCreate(
    assetModels.map((t) => {
      return {
        assetId: t.id,
        productId: productId
      };
    }),
    {transaction}
  );
}

export async function updateProductAssets(arrayDelete, arrayCreate, productId, transaction) {
  if (arrayCreate && arrayCreate.length) {
    const assetModels = await db.Asset.bulkCreate(arrayCreate, {transaction});
    await ProductAsset.bulkCreate(
      assetModels.map((t) => {
        return {
          assetId: t.id,
          productId: productId
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

    await db.ProductAsset.destroy({
      where: {
        productId: productId,
        assetId: {
          [Op.in]: assetId
        }
      }
    }, {transaction});
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
      type: assetsForm[i].type,
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

