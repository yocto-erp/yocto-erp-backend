import db from '../../db/models';
import { DEBT_TYPE } from '../../db/models/debt/debt';

export function createDebtBalance(user, subjectId, type, amount, transaction) {
  return db.DebtSubjectBalance.create({
    subjectId,
    companyId: user.companyId,
    credit: DEBT_TYPE.TO_PAY_DEBT === Number(type) || DEBT_TYPE.PAID_DEBT === Number(type) ? amount :0,
    debit: DEBT_TYPE.RECEIVABLES === Number(type) || DEBT_TYPE.RECOVERY_PUBLIC_DEBT === Number(type) ? amount :0,
    lastModifiedDate: new Date()
  }, {transaction})
}

export function updateDebtBalance(user, type, amount, checkDebtSubjectBalance, transaction) {
  switch (Number(type)) {
    case DEBT_TYPE.RECEIVABLES:
     checkDebtSubjectBalance.debit += amount;
     break;
    case DEBT_TYPE.RECOVERY_PUBLIC_DEBT:
      checkDebtSubjectBalance.debit -= amount;
      break;
    case DEBT_TYPE.TO_PAY_DEBT:
      checkDebtSubjectBalance.credit += amount;
      break;
    case DEBT_TYPE.PAID_DEBT:
      checkDebtSubjectBalance.credit -= amount;
      break;
    default:
      return 0;
  }
  checkDebtSubjectBalance.lastModifiedDate = new Date();
  checkDebtSubjectBalance.companyId = user.companyId;
  return checkDebtSubjectBalance.save({transaction});
}


export async function updateDebtBalanceWhenDeleteDebt(user, checkDebt, transaction) {
  const checkDebtSubjectBalance = await db.DebtSubjectBalance.findOne({
    where: {
      companyId: user.companyId,
      subjectId: checkDebt.subjectId
    }
  });

  switch (Number(checkDebt.type)) {
    case DEBT_TYPE.RECEIVABLES:
      checkDebtSubjectBalance.debit -= checkDebt.amount;
      break;
    case DEBT_TYPE.RECOVERY_PUBLIC_DEBT:
      checkDebtSubjectBalance.debit += checkDebt.amount;
      break;
    case DEBT_TYPE.TO_PAY_DEBT:
      checkDebtSubjectBalance.credit -= checkDebt.amount;
      break;
    case DEBT_TYPE.PAID_DEBT:
      checkDebtSubjectBalance.credit += checkDebt.amount;
      break;
    default:
      return 0;
  }
  checkDebtSubjectBalance.lastModifiedDate = new Date();
  checkDebtSubjectBalance.companyId = user.companyId;
  return checkDebtSubjectBalance.save({transaction});
}
