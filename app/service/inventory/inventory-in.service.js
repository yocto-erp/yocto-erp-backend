import {INVENTORY_TYPE} from "../../db/models/inventory/inventory";
import db from "../../db/models";
import {updateItemTags} from "../tagging/tagging.service";
import {TAGGING_TYPE} from "../../db/models/tagging/tagging-item-type";
import {hasText} from "../../util/string.util";
import {badRequest, FIELD_ERROR} from "../../config/error";
import {updateInventoryPurpose} from "./inventory-purpose.service";
import {addTaggingQueue} from "../../queue/tagging.queue";

const {Op} = db.Sequelize;

/**
 * Subtract Old and Plus New
 * @param removeDetails list detail product need to remove from inventory
 * @param addDetails list detail product need to add to inventory
 */
function mergeListUpdateInventory(removeDetails, addDetails) {
  const rs = [];
  if (removeDetails && removeDetails.length) {
    for (let i = 0; i < removeDetails.length; i += 1) {
      const {productId, unitId, quantity, serialCode} = removeDetails[i];
      let existItem = rs.find(t => t.productId === productId && t.unitId === unitId);
      if (!existItem) {
        existItem = {
          productId, unitId, serials: [], quantity: 0
        }
        rs.push(existItem)
      }
      existItem.quantity -= quantity;
      if (hasText(serialCode)) {
        let existedSerial = existItem.serials.find(t => t.serial === serialCode);
        if (!existedSerial) {
          existedSerial = {serial: serialCode, quantity: 0}
          existItem.serials.push(existedSerial)
        }
        existedSerial.quantity -= quantity;
      }
    }
  }
  if (addDetails && addDetails.length) {
    for (let i = 0; i < addDetails.length; i += 1) {
      const {productId, unitId, quantity, serialCode} = addDetails[i];
      let existItem = rs.find(t => t.productId === productId && t.unitId === unitId);
      if (!existItem) {
        existItem = {
          productId, unitId, serials: [], quantity: 0
        }
        rs.push(existItem)
      }
      existItem.quantity += quantity;
      if (hasText(serialCode)) {
        let existedSerial = existItem.serials.find(t => t.serial === serialCode);
        if (!existedSerial) {
          existedSerial = {serial: serialCode, quantity: 0}
          existItem.serials.push(existedSerial)
        }
        existedSerial.quantity += quantity;
      }
    }
  }

  return rs;
}

async function updateInventory(companyId, warehouseId, userId, listUpdateDetails, transaction) {
  for (let i = 0; i < listUpdateDetails.length; i += 1) {
    const {productId, unitId, quantity, serials} = listUpdateDetails[i];
    if (quantity !== 0 || serials.find(s => s.quantity !== 0)) {
      // eslint-disable-next-line no-await-in-loop
      let inventorySummary = await db.InventorySummary.findOne({
        where: {
          companyId: companyId,
          productId,
          unitId,
          warehouseId: warehouseId
        }
      }, {transaction});
      if (!inventorySummary) {
        inventorySummary = db.InventorySummary.build({
          companyId,
          productId,
          unitId,
          warehouseId,
          quantity: 0
        });
      }
      inventorySummary.quantity += quantity;
      // TODO: check if quantity negative then throw exception
      inventorySummary.lastModifiedDate = new Date();
      inventorySummary.lastModifiedById = userId;
      // eslint-disable-next-line no-await-in-loop
      inventorySummary = await inventorySummary.save({transaction});
      if (serials.length) {
        for (let j = 0; j < serials.length; j += 1) {
          const {serial, quantity: qty} = serials[j];
          // eslint-disable-next-line no-await-in-loop
          let inventorySerial = await db.InventorySummarySerial.findOne({
            where: {
              inventorySummaryId: inventorySummary.id,
              serialCode: serial
            }
          })
          if (!inventorySerial) {
            inventorySerial = db.InventorySummarySerial.build({
              inventorySummaryId: inventorySummary.id,
              serialCode: serial, quantity: 0
            })
          }
          inventorySerial.quantity += qty;
          // TODO: Check if quantity negative then throw exception
          inventorySerial.save({transaction})
        }
      }
    }
  }
}

export async function createInventoryIn(user, createForm) {
  const listInventoryUpdate = mergeListUpdateInventory(null, createForm.details);
  console.log('Add Inventory', listInventoryUpdate);
  const transaction = await db.sequelize.transaction();
  try {
    await updateInventory(user.companyId, createForm.warehouseId, user.id, listInventoryUpdate, transaction);
    const inventory = await db.Inventory.create({
      name: createForm.name,
      warehouseId: createForm.warehouseId,
      type: INVENTORY_TYPE.IN,
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
        type: TAGGING_TYPE.INVENTORY_GOOD_RECEIPT,
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

export async function getInventoryItem(user, inventoryId) {
  const inventory = await db.Inventory.findOne({
    where: {
      [Op.and]: [
        {id: inventoryId},
        {companyId: user.companyId}
      ]
    }, include: [
      {model: db.WareHouse, as: 'warehouse'},
      {
        model: db.InventoryDetail, as: 'details',
        include: [
          {model: db.Product, as: 'product', attributes: ['id', 'name', 'remark']},
          {
            model: db.ProductUnit, as: 'unit',
            required: false,
            where: {
              productId: {
                [Op.eq]: db.Sequelize.col('details.productId')
              }
            }
          }
        ]
      },
      {
        model: db.TaggingItem, as: 'taggingItems',
        required: false,
        where: {
          itemType: {
            [Op.in]: [TAGGING_TYPE.INVENTORY_GOOD_ISSUE, TAGGING_TYPE.INVENTORY_GOOD_RECEIPT]
          }
        },
        include: [
          {model: db.Tagging, as: 'tagging'}
        ]
      }
    ]
  });
  if (!inventory) {
    throw badRequest('inventory', FIELD_ERROR.INVALID, 'Inventory not found');
  }

  return inventory;
}

export async function updateInventoryIn(user, inventoryId, updateForm) {
  const inventoryOld = await getInventoryItem(user, inventoryId)
  const listUpdateDetails = mergeListUpdateInventory(inventoryOld.details, updateForm.details);
  console.log('Update Inventory', JSON.stringify(listUpdateDetails))
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
        type: TAGGING_TYPE.INVENTORY_GOOD_RECEIPT,
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

export async function removeInventoryIn(user, inventoryId) {
  const existedInventory = await getInventoryItem(user, inventoryId);
  const listUpdateDetails = mergeListUpdateInventory(existedInventory.details, null)
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
          itemType: TAGGING_TYPE.INVENTORY_GOOD_RECEIPT,
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
