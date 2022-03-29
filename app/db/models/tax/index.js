import Tax from "./Tax";
import TaxSet from "./TaxSet";
import TaxSetDetail from "./TaxSetDetail";

export const initTaxModel = sequelize => ({
  Tax: Tax.init(sequelize),
  TaxSet: TaxSet.init(sequelize),
  TaxSetDetail: TaxSetDetail.init(sequelize)
});
