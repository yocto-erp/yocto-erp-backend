import { INVENTORY_TYPE } from "../../db/models/inventory/inventory";
import db from "../../db/models";
import { updateItemTags } from "../tagging/tagging.service";
import { TAGGING_TYPE } from "../../db/models/tagging/tagging-item-type";
import { addTaggingQueue } from "../../queue/tagging.queue";
import { getInventoryItem, mergeListUpdateInventory, updateInventory } from "./inventory-in.service";
import { auditAction } from "../audit/audit.service";
import { PERMISSION } from "../../db/models/acl/acl-action";

export async function createInventory(user, inventoryType, form, transaction) {
  const { details, warehouseId, name, remark, purposeId, relativeId, tagging } = form;

  const inventory = await db.Inventory.create({
    name,
    warehouseId,
    type: inventoryType,
    processedDate: new Date(),
    companyId: user.companyId,
    totalProduct: details.length,
    remark: remark,
    createdDate: new Date(),
    createdById: user.id
  }, { transaction });
  await db.InventoryDetail.bulkCreate(details.map((t, index) => ({
    inventoryId: inventory.id,
    inventoryDetailId: index + 1,
    productId: t.productId,
    unitId: t.unitId,
    quantity: t.quantity,
    remark: t.remark,
    serialCode: t.serialCode
  })), { transaction });
  if (purposeId > 0 && relativeId > 0) {
    await db.InventoryPurpose.create({
      inventoryId: inventory.id,
      purposeId: purposeId,
      relativeId: relativeId
    }, { transaction });
  }
  let listUpdateTags = [];
  if (tagging && tagging.length) {
    await updateItemTags({
      id: inventory.id,
      type: Number(inventoryType) === INVENTORY_TYPE.OUT ? TAGGING_TYPE.INVENTORY_GOOD_ISSUE : TAGGING_TYPE.INVENTORY_GOOD_RECEIPT,
      transaction,
      newTags: tagging
    });
    listUpdateTags = [...new Set(((tagging || []).map(t => t.id)))];
  }
  return {
    inventory, listUpdateTags
  };
}

export async function createInventoryOut(user, createForm) {
  const transaction = await db.sequelize.transaction();
  try {
    const listInventoryUpdate = mergeListUpdateInventory(createForm.details, null);
    await updateInventory(user.companyId, createForm.warehouseId, user.id, listInventoryUpdate, transaction);
    const rs = await createInventory(user, INVENTORY_TYPE.OUT, createForm, transaction);
    await transaction.commit();
    if (rs.listUpdateTags.length) {
      addTaggingQueue(rs.listUpdateTags);
    }

    return rs.inventory;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function updateInventoryOut(user, inventoryId, updateForm) {
  const inventoryOld = await getInventoryItem(user, inventoryId);
  const listUpdateDetails = mergeListUpdateInventory(updateForm.details, inventoryOld.details);
  console.log("Update Inventory Out", JSON.stringify(listUpdateDetails));
  const transaction = await db.sequelize.transaction();
  try {
    await updateInventory(user.companyId, updateForm.warehouseId, user.id, listUpdateDetails, transaction);

    inventoryOld.name = updateForm.name;
    inventoryOld.warehouseId = updateForm.warehouseId;
    inventoryOld.totalProduct = updateForm.details.length;
    inventoryOld.remark = updateForm.remark;
    inventoryOld.lastModifiedDate = new Date();
    inventoryOld.lastModifiedById = user.id;
    await inventoryOld.save({ transaction });

    if (updateForm.details && updateForm.details.length) {
      // delete inventory detail old
      await db.InventoryDetail.destroy(
        {
          where: { inventoryId: inventoryId }
        }, { transaction }
      );
      // create inventory detail
      await db.InventoryDetail.bulkCreate(updateForm.details.map((t, index) => ({
        inventoryId: inventoryId,
        inventoryDetailId: index + 1,
        productId: t.productId,
        unitId: t.unitId,
        quantity: t.quantity,
        remark: t.remark,
        serialCode: t.serialCode
      })), { transaction });
    }

    if (updateForm.purposeId && updateForm.relativeId) {
      await db.InventoryPurpose.update({
        relativeId: updateForm.relativeId
      }, {
        where: { inventoryId: inventoryId, purposeId: updateForm.purposeId }
      }, { transaction });
    }
    let listUpdateTags = [];

    if (updateForm.tagging && updateForm.tagging.length) {
      await updateItemTags({
        id: inventoryId,
        type: TAGGING_TYPE.INVENTORY_GOOD_ISSUE,
        transaction,
        newTags: updateForm.tagging
      });
      listUpdateTags = [...new Set([...((updateForm.tagging || []).map(t => t.id)),
        ...((inventoryOld.taggingItems || []).map(t => t.taggingId))])];
    }

    await transaction.commit();
    auditAction({
      actionId: PERMISSION.INVENTORY.GOODS_ISSUE.UPDATE,
      user,
      relativeId: String(inventoryId)
    }).then();
    if (listUpdateTags.length) {
      addTaggingQueue(listUpdateTags);
    }
    return inventoryOld;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function removeInventoryOut(user, inventoryId) {
  const existedInventory = await getInventoryItem(user, inventoryId);
  const listUpdateDetails = mergeListUpdateInventory(null, existedInventory.details);
  const transaction = await db.sequelize.transaction();
  try {
    await updateInventory(user.companyId, existedInventory.warehouseId, user.id, listUpdateDetails, transaction);
    await db.InventoryDetail.destroy(
      {
        where: { inventoryId: inventoryId }
      }, { transaction }
    );
    await db.InventoryPurpose.destroy({
      where: { inventoryId: inventoryId }
    }, { transaction });

    let listUpdateTags = [];

    if (existedInventory.taggingItems && existedInventory.taggingItems.length) {
      await db.TaggingItem.destroy({
        where: {
          itemType: TAGGING_TYPE.INVENTORY_GOOD_ISSUE,
          itemId: existedInventory.id
        },
        transaction
      });
      listUpdateTags = [...new Set(((existedInventory.taggingItems || []).map(t => t.taggingId)))];
    }

    await existedInventory.destroy({ transaction });

    await transaction.commit();
    if (listUpdateTags.length) {
      addTaggingQueue(listUpdateTags);
    }
    return existedInventory;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
