import db from "../../db/models";
import User from "../../db/models/user/user";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { taggingMapping, updateItemTags } from "../tagging/tagging.service";
import { TAGGING_TYPE } from "../../db/models/tagging/tagging-item-type";
import { addTaggingQueue } from "../../queue/tagging.queue";
import { auditAction } from "../audit/audit.service";
import { PERMISSION } from "../../db/models/acl/acl-action";
import { isArray, isArrayHasLength } from "../../util/func.util";
import { hasText } from "../../util/string.util";
import ProductAsset from "../../db/models/product/product-asset";

const { Op } = db.Sequelize;

export function listProduct(user, query, { order, offset, limit }) {
  console.log(query);
  const { tagging, search } = query;
  const where = { companyId: user.companyId };
  if (hasText(search)) {
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
  const whereTagging = {
    itemType: TAGGING_TYPE.PRODUCT
  };
  let isTaggingRequired = false;
  if (tagging && tagging.id) {
    whereTagging.taggingId = {
      [Op.in]: isArray(tagging.id) ? tagging.id : [tagging.id]
    };
    isTaggingRequired = true;
  }
  return db.Product.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "createdBy",
        attributes: ["id", "displayName", "email"]
      },
      {
        model: User,
        as: "lastModifiedBy",
        attributes: ["id", "displayName", "email"]
      },
      {
        model: db.TaggingItem,
        required: isTaggingRequired,
        as: "taggingItems",
        where: whereTagging,
        include: [
          { model: db.Tagging, as: "tagging" }
        ]
      }
    ],
    order,
    offset,
    limit,
    group: ["id"]
  }).then(async (resp) => {
    return ({
      count: resp.count.length,
      rows: resp.rows.map(item => taggingMapping(item.get({ plain: true })))
    });
  });
}

export const mappingProduct = (p) => {
  const t = p.get({ plain: true });
  return {
    ...t,
    assets: t.productAssets.filter(pI => pI.asset !== null).map(pI => pI.asset)
  };
};

export async function getProduct(user, pId) {
  const product = await db.Product.findOne({
    where: {
      id: pId,
      companyId: user.companyId
    },
    include: [
      {
        model: db.ProductAsset,
        as: "productAssets",
        include: [{ model: db.Asset, as: "asset", include: [{ model: db.AssetIpfs, as: "ipfs" }] }]
      },
      {
        model: db.ProductUnit,
        as: "units",
        attributes: ["id", "name", "rate"]
      },
      { model: db.Tagging, as: "tagging" }
    ],
    order: [[{ model: db.ProductAsset, as: "productAssets" }, "priority", "asc"]]
  });
  if (!product) {
    throw badRequest("product", FIELD_ERROR.INVALID, "product not found");
  }
  return product;
}

export async function createProduct(user, createForm) {
  if (
    hasText(createForm.productDocumentId)
  ) {
    const checkProductDocument = await db.Product.findOne({
      where: {
        productDocumentId: createForm.productDocumentId
      }
    });
    if (checkProductDocument) {
      throw badRequest(
        "product",
        FIELD_ERROR.EXISTED,
        "productDocumentId existed!"
      );
    }
  }
  const transaction = await db.sequelize.transaction();

  try {
    let thumbnailFileId = null;
    if (createForm.assets && createForm.assets.length) {
      thumbnailFileId = createForm.assets[0].fileId;
    }
    const product = await db.Product.create(
      {
        name: createForm.name,
        remark: createForm.remark,
        priceBaseUnit: createForm.priceBaseUnit,
        productDocumentId: createForm.productDocumentId,
        companyId: user.companyId,
        thumbnail: thumbnailFileId,
        createdById: user.id,
        createdDate: new Date()
      },
      { transaction }
    );

    if (createForm.assets && createForm.assets.length) {
      await ProductAsset.bulkCreate(
        createForm.assets.map((t, i) => {
          return {
            assetId: t.id,
            productId: product.id,
            priority: i
          };
        }),
        { transaction }
      );
    }

    if (createForm.units && createForm.units.length) {
      await db.ProductUnit.bulkCreate(createForm.units.map((result, index) => {
        return {
          id: index + 1,
          productId: product.id,
          name: result.name.trim(),
          rate: result.rate
        };
      }), { transaction });
    }

    if (createForm.tagging && createForm.tagging.length) {
      await updateItemTags({
        id: product.id,
        type: TAGGING_TYPE.PRODUCT,
        transaction,
        newTags: createForm.tagging
      });
    }

    await transaction.commit();

    auditAction({
      actionId: PERMISSION.PRODUCT.CREATE,
      user,
      relativeId: String(product.id)
    }).then();

    if (createForm.tagging && createForm.tagging.length) {
      addTaggingQueue(createForm.tagging.map((t) => t.id));
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
        productDocumentId: updateForm.productDocumentId,
        id: {
          [Op.ne]: pId
        }
      }
    });

    if (checkProductDocument) {
      throw badRequest(
        "product",
        FIELD_ERROR.EXISTED,
        "productDocumentId existed!"
      );
    }
  }

  const existedProduct = await getProduct(user, pId);
  if (!existedProduct) {
    throw badRequest("product", FIELD_ERROR.INVALID, "Product not found");
  }

  const transaction = await db.sequelize.transaction();
  try {
    let newThumbnailId = existedProduct.thumbnail;
    if (updateForm.assets && updateForm.assets.length && updateForm.assets[0].fileId !== newThumbnailId) {
      newThumbnailId = updateForm.assets[0].fileId;
    }
    await existedProduct.update(
      {
        name: updateForm.name.trim(),
        remark: updateForm.remark.trim(),
        priceBaseUnit: updateForm.priceBaseUnit,
        productDocumentId: updateForm.productDocumentId,
        thumbnail: newThumbnailId,
        lastModifiedDate: new Date(),
        lastModifiedById: user.id
      },
      transaction
    );

    await db.ProductAsset.destroy({
      where: {
        productId: existedProduct.id
      }
    }, { transaction });

    if (updateForm.assets && updateForm.assets.length) {
      await ProductAsset.bulkCreate(
        updateForm.assets.map((t, i) => {
          return {
            assetId: t.id,
            productId: existedProduct.id,
            priority: i
          };
        }),
        { transaction }
      );
    }

    if (updateForm.units && updateForm.units.length) {
      await db.ProductUnit.destroy(
        {
          where: {
            productId: existedProduct.id
          }
        }, { transaction }
      );
      await db.ProductUnit.bulkCreate(updateForm.units.map((result, index) => {
        return {
          id: index + 1,
          productId: existedProduct.id,
          name: result.name,
          rate: result.rate
        };
      }), { transaction });
    }

    let listUpdateTags = [];

    if (isArrayHasLength(updateForm.tagging) || isArrayHasLength(existedProduct.tagging)) {
      await updateItemTags({
        id: pId,
        type: TAGGING_TYPE.PRODUCT,
        transaction,
        newTags: updateForm.tagging
      });
      listUpdateTags = [...new Set([...((updateForm.tagging || []).map(t => t.id)),
        ...((existedProduct.tagging || []).map(t => t.id))])];
    }

    await transaction.commit();

    if (listUpdateTags.length) {
      console.log("Update Product Tagging", listUpdateTags);
      addTaggingQueue(listUpdateTags);
    }
    auditAction({
      actionId: PERMISSION.PRODUCT.UPDATE,
      user,
      relativeId: String(pId)
    }).then();

    return existedProduct;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function removeProduct(user, productId) {
  const checkProduct = await getProduct(user, productId);
  if (!checkProduct) {
    throw badRequest("product", FIELD_ERROR.INVALID, "product not found");
  }
  const transaction = await db.sequelize.transaction();
  try {
    if (checkProduct.assets && checkProduct.assets.length) {
      await db.ProductAsset.destroy({
        where: {
          productId: checkProduct.id
        }
      }, { transaction });
    }
    await db.ProductUnit.destroy(
      {
        where: {
          productId: checkProduct.id
        }
      }, { transaction }
    );
    await checkProduct.destroy({ transaction });
    await transaction.commit();
    auditAction({
      actionId: PERMISSION.PRODUCT.DELETE,
      user,
      relativeId: String(checkProduct.id)
    }).then();
    if (checkProduct.tagging && checkProduct.tagging.length) {
      addTaggingQueue(checkProduct.tagging.map(t => t.id));
    }
    return checkProduct;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function getAssets(user, productId) {
  return db.Product.findOne({
    where: {
      id: productId, companyId: user.companyId
    },
    include: [
      {
        model: db.ProductAsset, as: "productAssets", include: [
          { model: db.Asset, as: "asset", include: [{ model: db.AssetIpfs, as: "ipfs" }] }
        ]
      }
    ],
    order: [[{ model: db.ProductAsset, as: "productAssets" }, "priority", "asc"]]
  }).then(t => t.productAssets.map(pa => pa.asset));
}
