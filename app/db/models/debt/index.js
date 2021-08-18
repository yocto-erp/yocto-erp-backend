import Debt from './debt';
import DebtDetail from './debt-detail';

export const initDebtModel = sequelize => ({
  Debt: Debt.init(sequelize),
  DebtDetail: DebtDetail.init(sequelize)
});
