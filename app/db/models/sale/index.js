import POS from "./pos";
import PosUser from "./pos-user";

export const initSaleModel = sequelize => ({
  POS: POS.init(sequelize),
  PosUser: PosUser.init(sequelize)
});
