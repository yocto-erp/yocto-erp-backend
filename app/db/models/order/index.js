import Order from "./order";
import OrderDetail from "./order-detail";
import OrderDetailTax from "./order-detail-tax";

export const initOrderModel = sequelize => ({
  Order: Order.init(sequelize),
  OrderDetail: OrderDetail.init(sequelize),
  OrderDetailTax: OrderDetailTax.init(sequelize)
});

