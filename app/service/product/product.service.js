import db from '../../db/models';
import User from '../../db/models/user/user';
import { badRequest, FIELD_ERROR } from '../../config/error';
import {
  createProductAsset,
  generateProductThumbnail,
  mergeAssets,
  removeProductAssets,
  updateProductAssets
} from '../asset/asset.service';
import { createProductUnit, removeProductUnit } from './product-unit.service';
import { updateItemTags } from '../tagging/tagging.service';
import { TAGGING_TYPE } from '../../db/models/tagging/tagging-item-type';
import { addTaggingQueue } from '../../queue/tagging.queue';
import { auditAction } from '../audit/audit.service';
import { PERMISSION } from '../../db/models/acl/acl-action';
import { isArray } from '../../util/func.util';

const { Op } = db.Sequelize;

const mapping = (item) => ({
  ...item,
  tagging: item.taggingItems.map((t) => t.tagging),
  assets: item.productAssets?.map((t) => t.asset)
});

function getProductTagging(productId) {
  return db.TaggingItem.findAll({
    where: {
      itemId: productId,
      itemType: TAGGING_TYPE.PRODUCT
    },
    include: [{ model: db.Tagging, as: 'tagging' }]
  }).then((list) => list.map((t) => t.tagging));
}

export function listProduct(user, query, { order, offset, limit }) {
  console.log(query);
  const { tagging, search } = query;
  const where = { companyId: user.companyId };
  if (search && search.length) {
    where[Op.or] = [
      {
        name: {
          [Op.like]: `%${search}%`
        }
      },
      {
        productDocumentId: {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }
  const whereTagging = {};
  let isTaggingRequired = false;
  if (tagging && tagging.id) {
    whereTagging.taggingId = {
      [Op.in]: isArray(tagging.id)  ? tagging.id : [tagging.id]
    };
    isTaggingRequired = true;
  }
  return db.Product.findAndCountAll({
    attributes: ['id', 'name', 'remark', 'thumbnail', 'createdDate'],
    where,
    include: [
      {
        model: User,
        as: 'createdBy',
        attributes: ['id', 'displayName', 'email']
      },
      {
        model: User,
        as: 'lastModifiedBy',
        attributes: ['id', 'displayName', 'email']
      },
      {
        model: db.TaggingItem,
        required: isTaggingRequired,
        as: 'taggingItems',
        where: whereTagging
      }
    ],
    order,
    offset,
    limit,
    group: ['id']
  }).then(async (resp) => {
    const newRows = [];
    for (let i = 0; i < resp.rows.length; i += 1) {
      const item = resp.rows[i];
      newRows.push({
        ...item.get({plain: true}),
        // eslint-disable-next-line no-await-in-loop
        tagging: await getProductTagging(item.id)
      });
    }
    return ({
      count: resp.count.length,
      rows: newRows
    });
  });
}

export function products(user, query, order, offset, limit) {
  const { search } = query;
  const where = { companyId: user.companyId };
  if (search && search.length) {
    where[Op.or] = [
      {
        name: {
          [Op.like]: `%${search}%`
        }
      },
      {
        productDocumentId: {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }
  return db.Product.findAndCountAll({
    order,
    where,
    include: [
      {
        model: User,
        as: 'createdBy',
        attributes: ['id', 'displayName', 'email']
      },
      {
        model: User,
        as: 'lastModifiedBy',
        attributes: ['id', 'displayName', 'email']
      }
    ],
    offset,
    limit
  }).then(async (resp) => {
    const newRows = [];
    for (let i = 0; i < resp.rows.length; i += 1) {
      const item = resp.rows[i];
      newRows.push({
        ...item.get({ plain: true }),
        // eslint-disable-next-line no-await-in-loop
        tagging: await getProductTagging(item.id),
        assets: item.productAssets?.map((t) => t.asset)
      });
    }
    return ({
      ...resp,
      rows: newRows
    });
  });
}

export async function getProduct(user, pId) {
  const product = await db.Product.findOne({
    where: {
      id: pId,
      companyId: user.companyId
    },
    include: [
      {
        model: db.ProductAsset,
        as: 'productAssets',
        include: [{ model: db.Asset, as: 'asset' }]
      },
      {
        model: db.ProductUnit,
        as: 'units',
        attributes: ['id', 'name', 'rate']
      },
      {
        model: db.TaggingItem,
        as: 'taggingItems',
        required: false,
        where: {
          itemType: {
            [Op.in]: [TAGGING_TYPE.PRODUCT]
          }
        },
        include: [{ model: db.Tagging, as: 'tagging' }]
      }
    ],
    order: [
      [{ model: db.ProductAsset, as: 'productAssets' }, 'priority', 'asc']
    ]
  });
  if (!product) {
    throw badRequest('product', FIELD_ERROR.INVALID, 'product not found');
  }
  return mapping(product.get({ plain: true }));
}

export async function createProduct(user, createForm) {
  if (
    createForm.productDocumentId.length &&
    createForm.productDocumentId?.trim()
  ) {
    const checkProductDocument = await db.Product.findOne({
      where: {
        productDocumentId: createForm.productDocumentId.trim()
      }
    });
    if (checkProductDocument) {
      throw badRequest(
        'product',
        FIELD_ERROR.EXISTED,
        'productDocumentId existed!'
      );
    }
  }
  let productAssets = [];
  const transaction = await db.sequelize.transaction();

  try {
    const product = await db.Product.create(
      {
        name: createForm.name?.trim(),
        remark: createForm.remark?.trim(),
        priceBaseUnit: createForm.priceBaseUnit,
        productDocumentId: createForm.productDocumentId?.trim(),
        companyId: user.companyId,
        createdById: user.id,
        createdDate: new Date()
      },
      { transaction }
    );

    if (createForm.assets && createForm.assets.length) {
      productAssets = await createProductAsset(
        product.id,
        user.companyId,
        createForm.assets,
        transaction
      );
    }

    if (createForm.units && createForm.units.length) {
      await createProductUnit(product.id, createForm.units, transaction);
    }

    if (createForm.tagging && createForm.tagging.length) {
      await updateItemTags({
        id: product.id,
        type: TAGGING_TYPE.PRODUCT,
        transaction,
        newTags: createForm.tagging
      });
      addTaggingQueue(createForm.tagging.map((t) => t.id));
    }

    await transaction.commit();

    auditAction({
      actionId: PERMISSION.PRODUCT.CREATE,
      user,
      relativeId: String(product.id)
    }).then();

    if (productAssets.length) {
      generateProductThumbnail(product.id, productAssets[0].fileId, '').then();
    }

    return product;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function updateProduct(pId, user, updateForm) {
  if (
    updateForm.productDocumentId.length &&
    updateForm.productDocumentId?.trim()
  ) {
    const checkProductDocument = await db.Product.findOne({
      where: {
        productDocumentId: updateForm.productDocumentId.trim()
      }
    });

    if (checkProductDocument && checkProductDocument.id !== +pId) {
      throw badRequest(
        'product',
        FIELD_ERROR.EXISTED,
        'productDocumentId existed!'
      );
    }
  }

  const existedProduct = await db.Product.findByPk(pId, {
    include: [
      { model: db.Asset, as: 'assets' },
      {
        model: db.TaggingItem,
        as: 'taggingItems',
        required: false,
        where: {
          itemType: {
            [Op.in]: [TAGGING_TYPE.PRODUCT]
          }
        },
        include: [{ model: db.Tagging, as: 'tagging' }]
      }
    ]
  });
  if (!existedProduct) {
    throw badRequest('product', FIELD_ERROR.INVALID, 'product not found');
  }

  const transaction = await db.sequelize.transaction();
  try {
    await existedProduct.update(
      {
        name: updateForm.name.trim(),
        remark: updateForm.remark.trim(),
        priceBaseUnit: updateForm.priceBaseUnit,
        productDocumentId: updateForm.productDocumentId?.trim(),
        lastModifiedDate: new Date(),
        lastModifiedById: user.id
      },
      transaction
    );

    const listMerge = await mergeAssets(
      existedProduct.assets,
      updateForm.assets,
      user.companyId,
      transaction
    );
    await updateProductAssets(listMerge, pId, transaction);

    if (updateForm.units && updateForm.units.length) {
      await removeProductUnit(existedProduct.id, transaction);
      await createProductUnit(existedProduct.id, updateForm.units, transaction);
    }

    if (
      (updateForm.tagging && updateForm.tagging.length) ||
      (existedProduct.taggingItems && existedProduct.taggingItems.length)
    ) {
      await updateItemTags({
        id: pId,
        type: TAGGING_TYPE.PRODUCT,
        transaction,
        newTags: updateForm.tagging
      });

      addTaggingQueue([
        ...(updateForm.tagging || []).map((t) => t.id),
        ...(existedProduct.taggingItems || []).map((t) => t.taggingId)
      ]);
    }

    await transaction.commit();

    auditAction({
      actionId: PERMISSION.PRODUCT.UPDATE,
      user,
      relativeId: String(pId)
    }).then();

    generateProductThumbnail(existedProduct.id).then();

    return existedProduct;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function removeProduct(productId) {
  const checkProduct = await db.Product.findByPk(productId, {
    include: [{ model: db.Asset, as: 'assets' }]
  });
  if (!checkProduct) {
    throw badRequest('product', FIELD_ERROR.INVALID, 'product not found');
  }
  const transaction = await db.sequelize.transaction();
  try {
    if (checkProduct.assets && checkProduct.assets.length) {
      await removeProductAssets(checkProduct, transaction);
    }
    await removeProductUnit(checkProduct.id, transaction);
    const product = db.Product.destroy(
      {
        where: { id: checkProduct.id }
      },
      { transaction }
    );
    await transaction.commit();
    return product;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function getAssets(productId) {
  return db.ProductAsset.findAll({
    where: {
      productId
    },
    include: [{ model: db.Asset, as: 'asset' }],
    order: [['priority', 'asc']]
  });
}
