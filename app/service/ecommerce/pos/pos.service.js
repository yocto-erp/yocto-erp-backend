/**
 * https://app.diagrams.net/#G1Op3bnV1xPZlSXDoSozpIdOnH3tpbu4iz
 * {
 *   {
      name: `Order ${index}`,
      customer: {},
      products: [],
      address: '',
    }
 */
import db from '../../../db/models';
import { DEBT_PURPOSE, DEBT_TYPE } from '../../../db/models/constants';

async function createDebt(creator, { customerId, relateCompanyId, amount, posOrderId }, transaction) {
  const debt = await db.Debt.create({
    personId: customerId,
    relateCompanyId: relateCompanyId,
    companyId: creator.companyId,
    amount,
    createdDate: new Date(),
    createdById: creator.id,
    type: DEBT_TYPE.CREDIT
  }, { transaction });
  await db.DebtDetail.create({
    debtId: debt.id,
    relateId: posOrderId,
    purposeType: DEBT_PURPOSE.POS_ORDER
  }, { transaction });
  return debt;
}

export function posPurchase(user, form) {
  const { customer, company, products, address, name, isDebt, clientPay, isShipping } = form;

}
