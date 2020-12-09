import db from '../../db/models';

export function createCostPurpose(costId, purposeId, relativeId, transaction) {
  return db.CostPurpose.create({
    costId: costId,
    purposeId: purposeId,
    relativeId: relativeId
  }, { transaction });
}

export function updateCostPurpose(costId, purposeId, relativeId, transaction) {
  return db.CostPurpose.update({
    purposeId: purposeId,
    relativeId: relativeId
  }, {
    where: {
      costId: costId
    }
  }, { transaction });
}

export function removeCostPurpose(costId, transaction) {
  return db.CostPurpose.destroy(
    {
      where: { costId: costId }
    }, { transaction });
}
