/**
 * Using QUEUE for process inventory summary, to make sure the order, in case large traffic we can use bull queue or
 * rabbitmq queue.
 */
import queue from 'fastq';
import db from '../db/models';
import {INVENTORY_TYPE} from "../db/models/inventory/inventory";
import {eventLog} from "../config/winston";


const INVENTORY_ACTION_TYPE = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}

async function processProductSerial({inventoryType, type, inventorySummaryId, serial, quantity, transaction}) {
  let inventorySummarySerial = await db.InventorySummarySerial.findOne({
    where: {
      inventorySummaryId, serialCode: serial
    }
  }, {transaction});
  if (!inventorySummarySerial) {
    inventorySummarySerial = db.InventorySummarySerial.build({
      inventorySummaryId, serialCode: serial,
      quantity: 0
    });
  }
  if ((type === INVENTORY_ACTION_TYPE.REMOVE && inventoryType === INVENTORY_TYPE.OUT) ||
    (type === INVENTORY_ACTION_TYPE.ADD && inventoryType === INVENTORY_TYPE.IN)) {
    inventorySummarySerial.quantity += quantity;
  } else {
    inventorySummarySerial.quantity -= quantity;
  }
  return inventorySummarySerial.save({transaction});
}

async function processProduct({
                                type, inventoryType, warehouseId, productId, quantity, companyId, updatedById,
                                serials, baseUnit, transaction
                              }) {
  let inventorySummary = await db.InventorySummary.findOne({
    where: {
      companyId,
      productId,
      unitId: baseUnit.id,
      warehouseId
    }
  }, {transaction});
  if (!inventorySummary) {
    inventorySummary = db.InventorySummary.build({
      companyId,
      productId,
      unitId: baseUnit.id,
      warehouseId,
      quantity: 0
    });
  }
  if ((type === INVENTORY_ACTION_TYPE.REMOVE && inventoryType === INVENTORY_TYPE.OUT) ||
    (type === INVENTORY_ACTION_TYPE.ADD && inventoryType === INVENTORY_TYPE.IN)) {
    inventorySummary.quantity += quantity;
  } else {
    inventorySummary.quantity -= quantity;
  }
  inventorySummary.lastModifiedDate = new Date();
  inventorySummary.lastModifiedById = updatedById;
  inventorySummary = await inventorySummary.save({transaction});
  if (serials && serials.length) {
    for (let i = 0; i < serials.length; i += 1) {
      const {serial, quantity: serialQuantity} = serials[i];
      // eslint-disable-next-line no-await-in-loop
      await processProductSerial({
        serial,
        quantity: serialQuantity,
        inventorySummaryId: inventorySummary.id,
        inventoryType,
        type,
        transaction
      });
    }
  }
}

async function preProcessProducts(details) {
  const products = {};
  for (let i = 0; i < details.length; i += 1) {
    const {productId, quantity, unitId, serialCode} = details[i];
    if (!products[`id${productId}`]) {
      // eslint-disable-next-line no-await-in-loop
      const baseUnit = await db.ProductUnit.findOne({
        where: {
          productId,
          rate: 1
        }
      });
      products[`id${productId}`] = {productId, quantity: 0, serials: [], baseUnit};
    }
    const temp = products[`id${productId}`];
    // eslint-disable-next-line no-await-in-loop
    const unit = await db.ProductUnit.findOne({
      where: {
        productId, id: unitId
      }
    });
    temp.quantity += quantity * unit.rate;
    temp.serials.push({serial: serialCode, quantity: quantity * unit.rate});
  }
  return products;
}

/**
 * Process Inventory In/Out and update to Inventory Summary.
 * @param type: Action Type, add or remove inventory
 * @param inventory
 * @param cb
 */
async function worker({type, inventory}, cb) {

  const transaction = await db.sequelize.transaction();
  try {
    const {details, warehouseId, lastModifiedById, createdById, type: inventoryType, companyId} = inventory

    const products = await preProcessProducts(details);
    console.log(products);
    const keys = Object.keys(products);
    for (let i = 0; i < keys.length; i += 1) {
      console.log(products[keys[i]]);
      const {productId, quantity, unitId, serials, baseUnit} = products[keys[i]];
      // eslint-disable-next-line no-await-in-loop
      await processProduct({
        type,
        updatedById: lastModifiedById || createdById,
        quantity,
        baseUnit,
        unitId,
        companyId,
        serials,
        productId,
        inventoryType,
        warehouseId,
        transaction
      });
    }

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    eventLog.error(e.message, e);
  }
  cb(null, true);
}

export const InventoryQueue = queue(worker, 1);

export const queueInventoryIn = (inventory) => InventoryQueue.push({type: INVENTORY_ACTION_TYPE.ADD, inventory}, () => {
});

export const queueInventoryOut = (inventory) => InventoryQueue.push({
  type: INVENTORY_ACTION_TYPE.REMOVE,
  inventory
}, () => {
});
