import Debt from './debt';
import DebtDetail from './debt-detail';
import DebtSubjectBalance from "./debt-subject-balance";

export const initDebtModel = sequelize => ({
  DebtSubjectBalance: DebtSubjectBalance.init(sequelize),
  Debt: Debt.init(sequelize),
  DebtDetail: DebtDetail.init(sequelize)
});
