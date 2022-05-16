import db from "../../db/models";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { updateItemTags } from "../tagging/tagging.service";
import { TAGGING_TYPE } from "../../db/models/tagging/tagging-item-type";
import { auditAction } from "../audit/audit.service";
import { PERMISSION } from "../../db/models/acl/acl-action";
import { addTaggingQueue } from "../../queue/tagging.queue";
import { hasText } from "../../util/string.util";
import { isArray, isArrayHasLength } from "../../util/func.util";
import { DEFAULT_INCLUDE_TAGGING_ATTRS, DEFAULT_INCLUDE_USER_ATTRS } from "../../db/models/constants";
import { ASSET_ITEM_TYPE } from "../../db/models/asset/asset-item";

const { Op } = db.Sequelize;

export async function listProvider(query, user, { order, offset, limit }) {
  const { tagging, search } = query;
  const where = { companyId: user.companyId };
  const whereTagging = {};
  let isTaggingRequired = false;
  if (hasText(search)) {
    where[Op.or] = [
      {
        "$subject.gsm$": {
          [Op.like]: `%${search}%`
        }
      },
      {
        "$subject.name$": {
          [Op.like]: `%${search}%`
        }
      },
      {
        "$subject.email$": {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }

  if (tagging && tagging.id) {
    whereTagging.id = {
      [Op.in]: isArray(tagging.id) ? tagging.id : [tagging.id]
    };
    isTaggingRequired = true;
  }
  return db.Provider.findAndCountAll({
    order,
    where,
    include: [
      { model: db.User, as: "createdBy", attributes: DEFAULT_INCLUDE_USER_ATTRS },
      {
        model: db.User,
        as: "approvedBy", attributes: DEFAULT_INCLUDE_USER_ATTRS
      },
      {
        model: db.Subject, as: "subject",
        required: true,
        include: [
          {
            model: db.Tagging, as: "tagging",
            required: isTaggingRequired,
            where: whereTagging, attributes: DEFAULT_INCLUDE_TAGGING_ATTRS
          },
          { model: db.Person, as: "person" },
          { model: db.Company, as: "company" }
        ]
      }
    ],
    offset,
    limit,
    group: ["id"]
  }).then((resp) => {
    return ({
      count: resp.count.length,
      rows: resp.rows
    });
  });
}

export async function createProvider(user, createForm) {
  const {
    name,
    remark,
    rating,
    subject,
    assets,
    tagging,
    contractStartDate,
    contractEndDate,
    status,
    products
  } = createForm;
  const transaction = await db.sequelize.transaction();

  try {
    const newProvider = await db.Provider.create({
      companyId: user.companyId,
      name, remark,
      rating,
      createdDate: new Date(),
      subjectId: subject.id,
      createdById: user.id,
      status,
      contractStartDate,
      contractEndDate
    }, { transaction });

    if (isArrayHasLength(assets)) {
      await db.AssetItem.bulkCreate(
        assets.map((t, i) => {
          return {
            assetId: t.id,
            assetItemType: ASSET_ITEM_TYPE.PROVIDER,
            itemId: newProvider.id,
            priority: i + 1
          };
        }),
        { transaction }
      );
    }

    if (isArrayHasLength(tagging)) {
      await updateItemTags({
        id: newProvider.id,
        type: TAGGING_TYPE.PROVIDER,
        transaction,
        newTags: tagging
      });
    }

    if (isArrayHasLength(products)) {
      await db.ProviderProduct.bulkCreate(products.map(p => ({
        providerId: newProvider.id,
        productId: p.id
      })), { transaction });
    }

    await transaction.commit();
    auditAction({
      actionId: PERMISSION.PROVIDER.CREATE,
      name,
      user, subject,
      relativeId: String(newProvider.id)
    }).then();
    if (createForm.tagging && createForm.tagging.length) {
      addTaggingQueue([...new Set(createForm.tagging.map(t => t.id))]);
    }
    return newProvider;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

export async function getProvider(cId, user) {
  const item = await db.Provider.findOne({
    where: {
      id: cId,
      companyId: user.companyId
    },
    include: [
      {
        model: db.Asset,
        as: "assets",
        through: { attributes: [] },
        include: [
          { model: db.AssetIpfs, as: "ipfs" }
        ]
      },
      {
        model: db.User,
        as: "approvedBy"
      },
      {
        model: db.Subject, as: "subject", include: [
          {
            model: db.Person, as: "person"
          },
          {
            model: db.Company, as: "company"
          }
        ]
      },
      { model: db.Tagging, as: "tagging" },
      { model: db.Product, as: "products" }
    ]
  });
  if (!item) {
    throw badRequest("cost", FIELD_ERROR.INVALID, "Provider not found");
  }
  return item;
}

export async function updateProvider(cId, user, updateForm) {
  const existed = await getProvider(cId, user);
  const {
    name,
    remark,
    rating,
    subject,
    assets,
    tagging,
    contractStartDate,
    contractEndDate,
    status,
    products
  } = updateForm;
  const transaction = await db.sequelize.transaction();
  try {
    await existed.update({
      name,
      remark,
      subjectId: subject?.id,
      rating,
      contractStartDate, contractEndDate, status,
      lastModifiedDate: new Date(),
      lastModifiedById: user.id
    }, transaction);

    if (isArrayHasLength(existed.assets)) {
      await db.AssetItem.destroy({
        where: {
          itemId: existed.id,
          assetItemType: ASSET_ITEM_TYPE.PROVIDER
        }
      }, { transaction });
    }
    if (isArrayHasLength(assets)) {
      await db.AssetItem.bulkCreate(
        assets.map((t, i) => {
          return {
            assetId: t.id,
            assetItemType: ASSET_ITEM_TYPE.PROVIDER,
            itemId: existed.id,
            priority: i + 1
          };
        }),
        { transaction }
      );
    }

    await db.ProviderProduct.destroy({
      where: {
        providerId: existed.id
      }
    }, { transaction });

    if (isArrayHasLength(products)) {
      await db.ProviderProduct.bulkCreate(products.map(p => ({
        providerId: existed.id,
        productId: p.id
      })), { transaction });
    }

    let listUpdateTags = [];
    if (isArrayHasLength(tagging) || isArrayHasLength(existed.tagging)) {
      await updateItemTags({
        id: cId,
        type: TAGGING_TYPE.PROVIDER,
        transaction,
        newTags: tagging
      });

      listUpdateTags = [...new Set([...((tagging || []).map(t => t.id)),
        ...((existed.tagging || []).map(t => t.id))])];
    }

    await transaction.commit();
    auditAction({
      actionId: PERMISSION.PROVIDER.UPDATE,
      name,
      user, subject,
      relativeId: String(cId)
    }).then();
    if (listUpdateTags.length) {
      addTaggingQueue(listUpdateTags);
    }
    return existed;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function removeProvider(cId, user) {
  const existed = await getProvider(cId, user);
  const transaction = await db.sequelize.transaction();
  try {
    if (isArrayHasLength(existed.assets)) {
      await db.AssetItem.destroy({
        where: {
          assetItemType: ASSET_ITEM_TYPE.PROVIDER,
          itemId: existed.id
        }
      }, { transaction });
    }

    await existed.destroy({ transaction });
    await transaction.commit();
    return existed;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function approveProvider(user, id, { approve }) {
  const existed = await getProvider(id, user);
  existed.isApproved = approve;
  existed.approvedDate = new Date();
  existed.approvedById = user.id;
  existed.save();
  return existed;
}
