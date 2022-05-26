import db from "../../db/models";
import User from "../../db/models/user/user";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { updateItemTags } from "../tagging/tagging.service";
import { TAGGING_TYPE } from "../../db/models/tagging/tagging-item-type";
import { addTaggingQueue } from "../../queue/tagging.queue";
import { auditAction } from "../audit/audit.service";
import { PERMISSION } from "../../db/models/acl/acl-action";
import { isArray, isArrayHasLength } from "../../util/func.util";
import { hasText } from "../../util/string.util";
import { DEFAULT_INCLUDE_USER_ATTRS } from "../../db/models/constants";
import { ASSET_ITEM_TYPE } from "../../db/models/asset/asset-item";

const { Op } = db.Sequelize;

export function listProject(user, query, { order, offset, limit }) {
  const { tagging, search, provider } = query;
  const where = { companyId: user.companyId };
  if (hasText(search)) {
    where[Op.or] = [
      {
        name: {
          [Op.like]: `%${search}%`
        }
      }
    ];
  }
  if (provider && provider.id) {
    where.subjectId = provider.id;
  }
  const whereTagging = {};
  let isTaggingRequired = false;
  if (tagging && tagging.id) {
    whereTagging.id = {
      [Op.in]: isArray(tagging.id) ? tagging.id : [tagging.id]
    };
    isTaggingRequired = true;
  }
  return db.Project.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "createdBy",
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      },
      {
        model: User,
        as: "lastModifiedBy",
        attributes: DEFAULT_INCLUDE_USER_ATTRS
      },
      {
        model: db.Tagging,
        required: isTaggingRequired,
        as: "tagging",
        where: whereTagging
      }
    ],
    order,
    offset,
    limit,
    group: ["id"]
  }).then(async (resp) => {
    return ({
      count: resp.count.length,
      rows: resp.rows
    });
  });
}

export async function getProject(user, pId) {
  const item = await db.Project.findOne({
    where: {
      id: pId,
      companyId: user.companyId
    },
    include: [
      {
        model: db.AssetItem,
        as: "assetItems",
        include: [{ model: db.Asset, as: "asset", include: [{ model: db.AssetIpfs, as: "ipfs" }] }]
      },
      { model: db.Tagging, as: "tagging" },
      { model: db.Subject, as: "provider" }
    ],
    order: [[{ model: db.AssetItem, as: "assetItems" }, "priority", "asc"]]
  });
  if (!item) {
    throw badRequest("project", FIELD_ERROR.INVALID, "Project not found");
  }
  return item;
}

export async function createProject(user, createForm) {
  const transaction = await db.sequelize.transaction();

  try {
    const project = await db.Project.create({
        name: createForm.name,
        remark: createForm.remark,
        companyId: user.companyId,
        createdById: user.id,
        createdDate: new Date(),
        subjectId: createForm.subject?.id,
        status: createForm.status,
        startDate: createForm.startDate ? new Date(createForm.startDate) : null,
        finishDate: createForm.startDate ? new Date(createForm.startDate) : null,
        progress: createForm.progress
      },
      { transaction }
    );

    if (isArrayHasLength(createForm.assets)) {
      await db.AssetItem.bulkCreate(createForm.assets.map((t, i) => ({
        itemId: project.id,
        assetId: t.id,
        assetItemType: ASSET_ITEM_TYPE.PROJECT,
        priority: i + 1
      })), { transaction });
    }

    if (isArrayHasLength(createForm.tagging)) {
      await updateItemTags({
        id: project.id,
        type: TAGGING_TYPE.PROJECT,
        transaction,
        newTags: createForm.tagging
      });
    }

    await transaction.commit();

    auditAction({
      actionId: PERMISSION.PROJECT.CREATE,
      subject: createForm.subject,
      name: createForm.name,
      remark: createForm.remark,
      user,
      relativeId: String(project.id)
    }).then();

    if (isArrayHasLength(createForm.tagging)) {
      addTaggingQueue(createForm.tagging.map((t) => t.id));
    }

    return project;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function updateProject(pId, user, updateForm) {
  const existed = await getProject(user, pId);

  const transaction = await db.sequelize.transaction();
  try {
    await existed.update(
      {
        name: updateForm.name,
        remark: updateForm.remark,
        lastModifiedDate: new Date(),
        lastModifiedById: user.id,
        subjectId: updateForm.subject?.id,
        status: updateForm.status,
        startDate: updateForm.startDate ? new Date(updateForm.startDate) : null,
        finishDate: updateForm.startDate ? new Date(updateForm.startDate) : null,
        progress: updateForm.progress
      },
      transaction
    );

    await db.AssetItem.destroy({
      where: {
        itemId: existed.id,
        assetItemType: ASSET_ITEM_TYPE.PROJECT
      }
    }, { transaction });

    if (isArrayHasLength(updateForm.assets)) {
      await db.AssetItem.bulkCreate(updateForm.assets.map((t, i) => ({
        itemId: existed.id,
        assetId: t.id,
        assetItemType: ASSET_ITEM_TYPE.PROJECT,
        priority: i + 1
      })), { transaction });
    }

    let listUpdateTags = [];

    if (isArrayHasLength(updateForm.tagging) || isArrayHasLength(existed.tagging)) {
      await updateItemTags({
        id: pId,
        type: TAGGING_TYPE.PROJECT,
        transaction,
        newTags: updateForm.tagging
      });
      listUpdateTags = [...new Set([...((updateForm.tagging || []).map(t => t.id)),
        ...((existed.tagging || []).map(t => t.id))])];
    }

    await transaction.commit();

    if (listUpdateTags.length) {
      addTaggingQueue(listUpdateTags);
    }
    auditAction({
      actionId: PERMISSION.PROJECT.UPDATE,
      subject: updateForm.subject,
      name: updateForm.name, remark: updateForm.remark,
      user,
      relativeId: String(pId)
    }).then();

    return existed;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function removeProject(user, productId) {
  const existed = await getProject(user, productId);

  const transaction = await db.sequelize.transaction();
  try {
    if (isArrayHasLength(existed.assets)) {
      await db.AssetItem.destroy({
        where: {
          itemId: existed.id,
          assetItemType: ASSET_ITEM_TYPE.PROJECT
        }
      }, { transaction });
    }
    if (isArrayHasLength(existed.tagging)) {
      await db.TaggingItem.destroy({
        where: {
          itemId: existed.id,
          itemType: TAGGING_TYPE.PROJECT
        }
      }, { transaction });
    }
    await existed.destroy({ transaction });
    await transaction.commit();
    auditAction({
      actionId: PERMISSION.PROJECT.DELETE,
      user,
      subject: existed.provider,
      name: existed.name,
      remark: existed.remark,
      relativeId: String(existed.id)
    }).then();

    if (isArrayHasLength(existed.tagging)) {
      addTaggingQueue(existed.tagging.map(t => t.id));
    }
    return existed;
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
