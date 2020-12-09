import EventEmitter from 'events';
import { eventLog } from '../config/winston';
import db from '../db/models';
import { INVENTORY_TYPE } from '../db/models/inventory/inventory';


export const INVENTORY_EVENT = Object.freeze({
  CREATE: 'inventory:create_inventory_summary',
  UPDATE: 'inventory:update_inventory_summary',
  DELETE: 'inventory:delete_inventory_summary'
});
export const inventoryEmitter = new EventEmitter();


export async function unitBaseAndSumQuantity(productId, unitId, quantity, transaction) {
  const opts = {};
  if (transaction) {
    opts.transaction = transaction;
  }
  const unitBase = await db.ProductUnit.findOne({
    where: {
      productId,
      rate: 1
    }, opts
  });

  const unitOfProduct = await db.ProductUnit.findOne({
    where: {
      id: unitId,
      productId
    }, opts
  });
  return {
    quantity: unitOfProduct.rate * quantity,
    unitBaseId: unitBase.id
  };
}


export async function createInventorySummary(inventory) {
  const transaction = await db.sequelize.transaction();
  try {
    const inventoryDetails = await db.InventoryDetail.findAll({
      where: {
        inventoryId: inventory.id
      }, transaction
    });
    if (inventoryDetails && inventoryDetails.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const i of inventoryDetails) {
        // eslint-disable-next-line no-await-in-loop
        const {quantity, unitBaseId} = await unitBaseAndSumQuantity(i.productId, i.unitId, i.quantity, transaction);
        // eslint-disable-next-line no-await-in-loop
        const checkInventorySummary = await db.InventorySummary.findOne({
          where: {
            productId: i.productId
          }, transaction
        });

        if (checkInventorySummary) {
          if (inventory.type === INVENTORY_TYPE.IN) {
            checkInventorySummary.quantity = Number(checkInventorySummary.quantity) + Number(quantity);
          } else {
            checkInventorySummary.quantity = Number(checkInventorySummary.quantity) - Number(quantity);
          }

          // eslint-disable-next-line no-await-in-loop
          await checkInventorySummary.update({
            unitId: unitBaseId,
            quantity: checkInventorySummary.quantity,
            warehouseId: inventory.warehouseId,
            companyId: inventory.companyId,
            lastModifiedDate: new Date(),
            lastModifiedById: inventory.createdById
          }, transaction);

        } else if (!checkInventorySummary && inventory.type === INVENTORY_TYPE.IN) {
          // eslint-disable-next-line no-await-in-loop
          await db.InventorySummary.create({
            productId: i.productId,
            unitId: unitBaseId,
            quantity: quantity,
            warehouseId: inventory.warehouseId,
            companyId: inventory.companyId,
            lastModifiedDate: new Date(),
            lastModifiedById: inventory.createdById
          }, {transaction});
        }
      }
    }
    await transaction.commit();
  } catch (error) {
    eventLog.error(error);
    await transaction.rollback();
    throw error;
  }
}

inventoryEmitter.on(INVENTORY_EVENT.CREATE, (inventory) => {
  eventLog.info(`Event inventory:create_inventory_summary ${JSON.stringify(inventory)}`);
  setImmediate(async () => {
    await createInventorySummary(inventory);
  });
});

export async function updateInventorySummaryOld({inventoryOld}) {
  const transaction = await db.sequelize.transaction();
  try {
    if (inventoryOld.details && inventoryOld.details.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const i of inventoryOld.details) {
        // eslint-disable-next-line no-await-in-loop
        const {quantity} = await unitBaseAndSumQuantity(i.productId, i.unitId, i.quantity, transaction);
        // eslint-disable-next-line no-await-in-loop
        const checkInventorySummary = await db.InventorySummary.findOne({
          where: {
            productId: i.productId
          }, transaction
        });
        if (checkInventorySummary) {
          if (inventoryOld.type === INVENTORY_TYPE.IN) {
            checkInventorySummary.quantity = Number(checkInventorySummary.quantity) - Number(quantity);
          } else {
            checkInventorySummary.quantity = Number(checkInventorySummary.quantity) + Number(quantity);
          }
          // eslint-disable-next-line no-await-in-loop
          await checkInventorySummary.update({
            quantity: checkInventorySummary.quantity,
            lastModifiedDate: new Date()
          }, transaction);
        }
      }
    }
    await transaction.commit();
  } catch (error) {
    eventLog.error(error);
    await transaction.rollback();
    throw error;
  }
}

export async function updateInventorySummaryNew({inventoryNew}) {
  const transaction = await db.sequelize.transaction();
  try {
    if (inventoryNew.details && inventoryNew.details.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const i of inventoryNew.details) {
        // eslint-disable-next-line no-await-in-loop
        const {quantity, unitBaseId} = await unitBaseAndSumQuantity(i.productId, i.unitId, i.quantity, transaction);
        // eslint-disable-next-line no-await-in-loop
        const checkInventorySummary = await db.InventorySummary.findOne({
          where: {
            productId: i.productId
          }, transaction
        });

        if (checkInventorySummary) {
          if (inventoryNew.type === INVENTORY_TYPE.IN) {
            checkInventorySummary.quantity = Number(checkInventorySummary.quantity) + Number(quantity);
          } else {
            checkInventorySummary.quantity = Number(checkInventorySummary.quantity) - Number(quantity);
          }

          // eslint-disable-next-line no-await-in-loop
          await checkInventorySummary.update({
            unitId: unitBaseId,
            quantity: checkInventorySummary.quantity,
            warehouseId: inventoryNew.warehouseId,
            companyId: inventoryNew.companyId,
            lastModifiedDate: new Date(),
            lastModifiedById: inventoryNew.createdById
          }, transaction);

        } else if (!checkInventorySummary && inventoryNew.type === INVENTORY_TYPE.IN) {
          // eslint-disable-next-line no-await-in-loop
          await db.InventorySummary.create({
            productId: i.productId,
            unitId: unitBaseId,
            quantity: quantity,
            warehouseId: inventoryNew.warehouseId,
            companyId: inventoryNew.companyId,
            lastModifiedDate: new Date(),
            lastModifiedById: inventoryNew.createdById
          }, {transaction});
        }
      }
    }
    await transaction.commit();
  } catch (error) {
    eventLog.error(error);
    await transaction.rollback();
    throw error;
  }
}

inventoryEmitter.on(INVENTORY_EVENT.UPDATE, ({inventoryOld, inventoryNew}) => {
  eventLog.info(`Event inventory:update_inventory_summary ${JSON.stringify({inventoryOld, inventoryNew})}`);
  setImmediate(async () => {
    await updateInventorySummaryOld({inventoryOld});
    await updateInventorySummaryNew({inventoryNew});
  });
});

export async function deleteInventorySummary(inventory) {
  const transaction = await db.sequelize.transaction();
  try {
    if (inventory.details && inventory.details.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const i of inventory.details) {
        // eslint-disable-next-line no-await-in-loop
        const {quantity} = await unitBaseAndSumQuantity(i.productId, i.unitId, i.quantity, transaction);
        // eslint-disable-next-line no-await-in-loop
        const checkInventorySummary = await db.InventorySummary.findOne({
          where: {
            productId: i.productId
          }, transaction
        });

        if (checkInventorySummary) {
          if (inventory.type === INVENTORY_TYPE.IN) {
            checkInventorySummary.quantity = Number(checkInventorySummary.quantity) - Number(quantity);
          } else {
            checkInventorySummary.quantity = Number(checkInventorySummary.quantity) + Number(quantity);
          }
          // eslint-disable-next-line no-await-in-loop
          await checkInventorySummary.update({
            quantity: checkInventorySummary.quantity,
            lastModifiedDate: new Date()
          }, transaction);
        }
      }
    }
    await transaction.commit();
  } catch (error) {
    eventLog.error(error);
    await transaction.rollback();
    throw error;
  }
}

inventoryEmitter.on(INVENTORY_EVENT.DELETE, (inventory) => {
  eventLog.info(`Event inventory:delete_inventory_summary ${JSON.stringify(inventory)}`);
  setImmediate(async () => {
    await deleteInventorySummary(inventory);
  });
});
