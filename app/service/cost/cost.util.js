import db from '../../db/models';
import { isArrayHasLength } from '../../util/func.util';
import { updateItemTags } from '../tagging/tagging.service';
import { COST_TYPE } from '../../db/models/cost/cost';
import { TAGGING_TYPE } from '../../db/models/tagging/tagging-item-type';

export async function createCost({
                                   name,
                                   remark,
                                   type,
                                   paymentMethodId,
                                   subjectId,
                                   amount,
                                   assets,
                                   purposeId,
                                   companyId, userId,
                                   relativeId,
                                   tagging
                                 }, transaction) {
  const cost = await db.Cost.create({
    name,
    remark,
    companyId,
    type,
    paymentMethodId,
    subjectId,
    processedDate: new Date(),
    amount,
    createdById: userId,
    createdDate: new Date()
  }, { transaction });

  if (isArrayHasLength(assets)) {
    await db.CostAsset.bulkCreate(assets.map(t => ({
      costId: cost.id,
      assetId: t.id
    })), { transaction });
  }

  if (purposeId && relativeId) {
    await db.CostPurpose.create({
      costId: cost.id,
      purposeId,
      relativeId
    }, { transaction });
  }
  if (isArrayHasLength(tagging)) {
    await updateItemTags({
      id: cost.id,
      type: Number(type) === COST_TYPE.RECEIPT ? TAGGING_TYPE.RECEIPT_VOUCHER : TAGGING_TYPE.PAYMENT_VOUCHER,
      transaction,
      newTags: tagging
    });
  }
  return cost;
}
