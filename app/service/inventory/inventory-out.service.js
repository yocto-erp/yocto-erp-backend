import {INVENTORY_TYPE} from "../../db/models/inventory/inventory";
import db from "../../db/models";
import {updateItemTags} from "../tagging/tagging.service";
import {TAGGING_TYPE} from "../../db/models/tagging/tagging-item-type";
import {updateInventoryPurpose} from "./inventory-purpose.service";
import {addTaggingQueue} from "../../queue/tagging.queue";
import {getInventoryItem, mergeListUpdateInventory, updateInventory} from "./inventory-in.service";

export async function createInventoryOut(user, createForm) {
  const listInventoryUpdate = mergeListUpdateInventory(createForm.details, null);
  console.log('Substract Inventory', listInventoryUpdate);
  const transaction = await db.sequelize.transaction();
  try {
    await updateInventory(user.companyId, createForm.warehouseId, user.id, listInventoryUpdate, transaction);
    const inventory = await db.Inventory.create({
      name: createForm.name,
      warehouseId: createForm.warehouseId,
      type: INVENTORY_TYPE.OUT,
      processedDate: new Date(),
      companyId: user.companyId,
      totalProduct: createForm.details.length,
      remark: createForm.remark,
      createdDate: new Date(),
      createdById: user.id
    }, {transaction});

    await db.InventoryDetail.bulkCreate(createForm.details.map((t, index) => ({
      inventoryId: inventory.id,
      inventoryDetailId: index + 1,
      productId: t.productId,
      unitId: t.unitId,
      quantity: t.quantity,
      remark: t.remark,
      serialCode: t.serialCode
    })), {transaction})

    if (createForm.purposeId > 0 && createForm.relativeId > 0) {
      await db.InventoryPurpose.create({
        inventoryId: inventory.id,
        purposeId: createForm.purposeId,
        relativeId: createForm.relativeId
      }, {transaction})
    }
    let listUpdateTags = []
    if (createForm.tagging && createForm.tagging.length) {
      await updateItemTags({
        id: inventory.id,
        type: TAGGING_TYPE.INVENTORY_GOOD_ISSUE,
        transaction,
        newTags: createForm.tagging
      })
      listUpdateTags = [...new Set(((createForm.tagging || []).map(t => t.id)))];
    }

    await transaction.commit();
    if (listUpdateTags.length) {
      addTaggingQueue(listUpdateTags);
    }

    return inventory;
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    throw error;
  }
}

export async function updateInventoryOut(user, inventoryId, updateForm) {
  const inventoryOld = await getInventoryItem(user, inventoryId)
  const listUpdateDetails = mergeListUpdateInventory(updateForm.details, inventoryOld.details);
  console.log('Update Inventory Out', JSON.stringify(listUpdateDetails))
  const transaction = await db.sequelize.transaction();
  try {
    await updateInventory(user.companyId, updateForm.warehouseId, user.id, listUpdateDetails, transaction)

    inventoryOld.name = updateForm.name;
    inventoryOld.warehouseId = updateForm.warehouseId;
    inventoryOld.totalProduct = updateForm.details.length;
    inventoryOld.remark = updateForm.remark;
    inventoryOld.lastModifiedDate = new Date();
    inventoryOld.lastModifiedById = user.id;
    await inventoryOld.save({transaction})

    if (updateForm.details && updateForm.details.length) {
      // delete inventory detail old
      await db.InventoryDetail.destroy(
        {
          where: {inventoryId: inventoryId}
        }, {transaction}
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
      })), {transaction});
    }

    if (updateForm.purposeId && updateForm.purposeId.length && updateForm.relativeId && updateForm.relativeId.length) {
      await updateInventoryPurpose(inventoryOld.id, updateForm.purposeId, updateForm.relativeId, transaction);
    }
    let listUpdateTags = []

    if (updateForm.tagging && updateForm.tagging.length) {
      await updateItemTags({
        id: inventoryId,
        type: TAGGING_TYPE.INVENTORY_GOOD_ISSUE,
        transaction,
        newTags: updateForm.tagging
      })
      listUpdateTags = [...new Set([...((updateForm.tagging || []).map(t => t.id)),
        ...((inventoryOld.taggingItems || []).map(t => t.taggingId))])]
    }

    await transaction.commit();
    console.log("Update Inventory Tagging", listUpdateTags)
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
  const listUpdateDetails = mergeListUpdateInventory(null, existedInventory.details)
  const transaction = await db.sequelize.transaction();
  try {
    await updateInventory(user.companyId, existedInventory.warehouseId, user.id, listUpdateDetails, transaction)
    await db.InventoryDetail.destroy(
      {
        where: {inventoryId: inventoryId}
      }, {transaction}
    )
    await db.InventoryPurpose.destroy({
      where: {inventoryId: inventoryId}
    }, {transaction})

    let listUpdateTags = []

    if (existedInventory.taggingItems && existedInventory.taggingItems.length) {
      await db.TaggingItem.destroy({
        where: {
          itemType: TAGGING_TYPE.INVENTORY_GOOD_ISSUE,
          itemId: existedInventory.id
        },
        transaction
      })
      listUpdateTags = [...new Set(((existedInventory.taggingItems || []).map(t => t.taggingId)))]
    }

    await existedInventory.destroy({transaction});

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
