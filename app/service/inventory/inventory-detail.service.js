import db from '../../db/models';

export async function createInventoryDetail(inventoryId, inventoryDetailsForm, transaction) {
  const inventoryDetails = [];
  const inventorySerials = [];

  for (let index = 0; index < inventoryDetailsForm.length; index += 1) {
    const result = inventoryDetailsForm[index];
    inventoryDetails.push({
      inventoryId: inventoryId,
      inventoryDetailId: index + 1,
      productId: result.productId,
      unitId: result.unitId,
      quantity: result.quantity,
      remark: result.remark,
      serialCode: result.serialCode
    });
  }

  const details = await db.InventoryDetail.bulkCreate(inventoryDetails, {transaction});

  if (inventorySerials.length) {
    await db.InventoryDetailSerial.bulkCreate(inventorySerials, {transaction});
  }

  return details;
}

export function removeInventoryDetail(inventoryId, transaction) {
  return db.InventoryDetail.destroy(
    {
      where: {inventoryId: inventoryId}
    }, {transaction}
  );
}
