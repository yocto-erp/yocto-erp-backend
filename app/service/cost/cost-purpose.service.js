import db from '../../db/models';

export function removeCostPurpose(costId, transaction) {
  return db.CostPurpose.destroy(
    {
      where: { costId: costId }
    }, { transaction });
}
