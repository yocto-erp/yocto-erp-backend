import db from '../../db/models';

export function createInventoryPurpose(inventoryId, purposeId, relativeId, transaction) {
  return db.InventoryPurpose.create({
    inventoryId: inventoryId,
    purposeId: purposeId,
    relativeId: relativeId
  }, { transaction });
}

export function updateInventoryPurpose(inventoryId, purposeId, relativeId, transaction) {
  return db.InventoryPurpose.update({
    purposeId: purposeId,
    relativeId: relativeId
  }, {
    where: { inventoryId: inventoryId }
  }, { transaction });
}

export function removeInventoryPurpose(inventoryId, transaction) {
  return db.InventoryPurpose.destroy({
    where: { inventoryId: inventoryId }
  }, { transaction });
}
