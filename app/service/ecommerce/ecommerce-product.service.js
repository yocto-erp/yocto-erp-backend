import db from "../../db/models";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { hasText } from "../../util/string.util";
import { updateItemTags } from "../tagging/tagging.service";
import { TAGGING_TYPE } from "../../db/models/tagging/tagging-item-type";
import { ASSET_ITEM_TYPE } from "../../db/models/asset/asset-item";
import { auditAction } from "../audit/audit.service";
import { PERMISSION } from "../../db/models/acl/acl-action";
import { addTaggingQueue } from "../../queue/tagging.queue";

const { Op } = db.Sequelize;

export async function listECommerceProducts(user, { search }, paging) {
  const where = { companyId: user.companyId };
  if (hasText(search)) {
    where.webDisplayName = {
      [Op.like]: `%${search}%`
    };
  }
  return db.EcommerceProduct.findAndCountAll({
    where,
    include: [
      { model: db.Product, as: "product" },
      {
        model: db.Asset, as: "thumbnail", include: [
          { model: db.AssetIpfs, as: "ipfs" }
        ]
      },
      { model: db.Tagging, as: "tagging" },
      { model: db.TaxSet, as: "taxSet" },
      { model: db.User, as: "lastModifiedBy" },
      { model: db.ProductUnit, as: "unit", where: { productId: { [Op.col]: "ecommerceProduct.productId" } } }
    ],
    ...paging,
    group: ["id"]
  }).then(async (resp) => {
    return ({
      count: resp.count.length,
      rows: resp.rows
    });
  });
}

export async function createEcommerceProduct(user, formData) {
  const {
    product,
    unit,
    webDisplayName,
    shortName,
    price,
    remark,
    taxSet,
    otherParams,
    enableWarehouse,
    assets,
    tagging
  } = formData;
  const transaction = await db.sequelize.transaction();
  try {
    const newItem = await db.EcommerceProduct.create({
      productId: product.id,
      unitId: unit.id,
      companyId: user.companyId,
      webDisplayName,
      shortName,
      price,
      remark,
      taxSetId: taxSet?.id,
      otherParams,
      lastModifiedById: user.id,
      enableWarehouse: enableWarehouse,
      lastModifiedDate: new Date(),
      thumbnailId: assets && assets.length ? assets[0].id : null
    }, { transaction });

    if (tagging && tagging.length) {
      await updateItemTags({
        id: newItem.id,
        type: TAGGING_TYPE.ECOMMERCE_PRODUCT,
        transaction,
        newTags: tagging
      });
    }
    if (assets && assets.length) {
      await db.AssetItem.bulkCreate(assets.map((t, i) => ({
        itemId: newItem.id,
        assetId: t.id,
        assetItemType: ASSET_ITEM_TYPE.ECOMMERCE_PRODUCT,
        priority: i + 1
      })), { transaction });
    }
    await transaction.commit();

    auditAction({
      actionId: PERMISSION.ECOMMERCE.PRODUCT.CREATE,
      user,
      relativeId: String(newItem.id)
    }).then();
    if (tagging && tagging.length) {
      addTaggingQueue([...new Set(tagging.map(t => t.id))]);
    }
    return newItem;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }

}

export async function getEcommerceProduct(user, id) {
  const item = await db.EcommerceProduct.findOne({
    where: {
      id, companyId: user.companyId
    },
    include: [
      {
        model: db.AssetItem,
        as: "assetItems",
        include: [{ model: db.Asset, as: "asset", include: [{ model: db.AssetIpfs, as: "ipfs" }] }]
      },
      { model: db.Product, as: "product" },
      { model: db.Tax, as: "taxes" },
      { model: db.TaxSet, as: "taxSet" },
      { model: db.ProductUnit, as: "unit", where: { productId: { [Op.col]: "ecommerceProduct.productId" } } },
      { model: db.Tagging, as: "tagging" }
    ],
    order: [[{ model: db.AssetItem, as: "assetItems" }, "priority", "asc"]]
  });
  if (!item) {
    throw badRequest("ecommerceProduct", FIELD_ERROR.INVALID, "Invalid Ecommerce Product");
  }
  return item;
}

export async function updateEcommerceProduct(user, id, formData) {
  const existed = await getEcommerceProduct(user, id);

  const {
    product,
    unit,
    webDisplayName,
    shortName,
    price,
    taxSet,
    remark,
    otherParams,
    enableWarehouse,
    tagging,
    assets
  } = formData;

  const transaction = await db.sequelize.transaction();
  try {
    existed.productId = product.id;
    existed.unitId = unit.id;
    existed.webDisplayName = webDisplayName;
    existed.shortName = shortName;
    existed.taxSetId = taxSet?.id;
    existed.price = price;
    existed.remark = remark;
    existed.otherParams = otherParams;
    existed.lastModifiedById = user.id;
    existed.lastModifiedDate = new Date();
    existed.enableWarehouse = enableWarehouse;
    existed.thumbnailId = assets && assets.length ? assets[0].id : null;
    if (existed.assetItems && existed.assetItems.length) {
      await db.AssetItem.destroy({
        where: {
          itemId: existed.id,
          assetItemType: ASSET_ITEM_TYPE.ECOMMERCE_PRODUCT
        }
      }, { transaction });
    }
    if (assets && assets.length) {
      await db.AssetItem.bulkCreate(
        assets.map((t, i) => {
          return {
            assetId: t.id,
            assetItemType: ASSET_ITEM_TYPE.ECOMMERCE_PRODUCT,
            itemId: existed.id,
            priority: i + 1
          };
        }),
        { transaction }
      );
    }

    let listUpdateTags = [];
    if ((tagging && tagging.length) || (existed.tagging && existed.tagging.length)) {
      await updateItemTags({
        id: existed.id,
        type: TAGGING_TYPE.ECOMMERCE_PRODUCT,
        transaction,
        newTags: tagging
      });

      listUpdateTags = [...new Set([...((tagging || []).map(t => t.id)),
        ...((existed.tagging || []).map(t => t.id))])];
    }
    await existed.save({ transaction });
    await transaction.commit();
    auditAction({
      actionId: PERMISSION.ECOMMERCE.PRODUCT.UPDATE,
      user,
      relativeId: String(existed.id)
    }).then();
    if (listUpdateTags.length) {
      addTaggingQueue(listUpdateTags);
    }
    return existed;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function removeEcommerceProduct(user, id) {
  const existed = await getEcommerceProduct(user, id);
  const transaction = await db.sequelize.transaction();
  try {
    await existed.destroy({ transaction });
    if (existed.assetItems && existed.assetItems.length) {
      await db.AssetItem.destroy({
        where: {
          assetItemType: ASSET_ITEM_TYPE.ECOMMERCE_PRODUCT,
          itemId: existed.id
        }
      }, { transaction });
    }
    if (existed.tagging && existed.tagging.length) {
      await db.TaggingItem.destroy({
        where: {
          itemType: TAGGING_TYPE.ECOMMERCE_PRODUCT,
          itemId: existed.id
        }
      }, { transaction });
    }
    transaction.commit();
    auditAction({
      actionId: PERMISSION.ECOMMERCE.PRODUCT.DELETE,
      user,
      relativeId: String(existed.id),
      remark: `Delete ecommerce product ${existed.webDisplayName}`
    }).then();
    if (existed.tagging && existed.tagging.length) {
      addTaggingQueue(existed.tagging.map(t => t.id));
    }
    return existed;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}
