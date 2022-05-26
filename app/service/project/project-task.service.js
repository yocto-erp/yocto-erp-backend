import db from "../../db/models";
import User from "../../db/models/user/user";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { auditAction } from "../audit/audit.service";
import { PERMISSION } from "../../db/models/acl/acl-action";
import { isArrayHasLength } from "../../util/func.util";
import { hasText } from "../../util/string.util";
import { DEFAULT_INCLUDE_USER_ATTRS } from "../../db/models/constants";
import { ASSET_ITEM_TYPE } from "../../db/models/asset/asset-item";

export function listProjectTask(user, projectId) {
  const where = { companyId: user.companyId, projectId };

  return db.ProjectTask.findAll({
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
        model: db.AssetItem,
        as: "assetItems",
        include: [{ model: db.Asset, as: "asset", include: [{ model: db.AssetIpfs, as: "ipfs" }] }]
      }
    ],
    order: [[{ model: db.AssetItem, as: "assetItems" }, "priority", "asc"]],
    group: ["id"]
  });
}

export async function getProjectTask(user, pId, taskId) {
  const item = await db.ProjectTask.findOne({
    where: {
      id: taskId,
      projectId: pId
    },
    include: [
      {
        model: db.AssetItem,
        as: "assetItems",
        include: [{ model: db.Asset, as: "asset", include: [{ model: db.AssetIpfs, as: "ipfs" }] }]
      }
    ],
    order: [[{ model: db.AssetItem, as: "assetItems" }, "priority", "asc"]]
  });
  if (!item) {
    throw badRequest("projectTask", FIELD_ERROR.INVALID, "Project Task not found");
  }
  return item;
}

export const getNextProjectTaskId = async (projectId) => {
  const max = await db.ProjectTask.max("id", {
    where: {
      projectId
    }
  });
  return max || 1;
};

export async function createProjectTask(user, createForm) {
  const transaction = await db.sequelize.transaction();

  try {
    const newId = await getNextProjectTaskId(createForm.projectId);
    const newProjectTask = await db.ProjectTask.create({
        id: newId,
        projectId: createForm.projectId,
        name: createForm.name,
        remark: createForm.remark,
        startDate: hasText(createForm.startDate) ? new Date(createForm.startDate) : null,
        finishDate: hasText(createForm.finishDate) ? new Date(createForm.finishDate) : null,
        createdById: user.companyId,
        createdDate: new Date()
      },
      { transaction }
    );

    if (isArrayHasLength(createForm.assets)) {
      await db.AssetItem.bulkCreate(createForm.assets.map((t, i) => ({
        itemId: newId,
        assetId: t.id,
        assetItemType: ASSET_ITEM_TYPE.PROJECT_TASK,
        priority: i + 1
      })), { transaction });
    }

    await transaction.commit();

    auditAction({
      actionId: PERMISSION.PROJECT_TASK.CREATE,
      name: createForm.name,
      remark: createForm.remark,
      user,
      relativeId: String(newId)
    }).then();

    return newProjectTask;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function updateProjectTask(user, projectId, pId, updateForm) {
  const existed = await getProjectTask(user, projectId, pId);

  const transaction = await db.sequelize.transaction();
  try {
    await existed.update({
        name: updateForm.name,
        remark: updateForm.remark,
        lastModifiedDate: new Date(),
        lastModifiedById: user.id,
        startDate: updateForm.startDate ? new Date(updateForm.startDate) : null,
        finishDate: updateForm.startDate ? new Date(updateForm.startDate) : null
      },
      { transaction }
    );

    await db.AssetItem.destroy({
      where: {
        itemId: existed.id,
        assetItemType: ASSET_ITEM_TYPE.PROJECT_TASK
      }
    }, { transaction });

    if (isArrayHasLength(updateForm.assets)) {
      await db.AssetItem.bulkCreate(updateForm.assets.map((t, i) => ({
        itemId: existed.id,
        assetId: t.id,
        assetItemType: ASSET_ITEM_TYPE.PROJECT_TASK,
        priority: i + 1
      })), { transaction });
    }

    await transaction.commit();

    auditAction({
      actionId: PERMISSION.PROJECT_TASK.UPDATE,
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

export async function removeProjectTask(user, projectId, taskId) {
  const existed = await getProjectTask(user, projectId, taskId);

  const transaction = await db.sequelize.transaction();
  try {
    if (isArrayHasLength(existed.assets)) {
      await db.AssetItem.destroy({
        where: {
          itemId: existed.id,
          assetItemType: ASSET_ITEM_TYPE.PROJECT_TASK
        }
      }, { transaction });
    }
    await existed.destroy({ transaction });
    await transaction.commit();
    auditAction({
      actionId: PERMISSION.PROJECT_TASK.DELETE,
      user,
      name: existed.name,
      remark: existed.remark,
      relativeId: String(existed.id)
    }).then();

    return existed;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
