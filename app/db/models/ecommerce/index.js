import EcommerceProduct from './ecommerce-product';
import EcommerceOrder from './ecommerce-order';
import EcommerceOrderPayment from './ecommerce-order-payment';
import EcommerceOrderShipping from './ecommerce-order-shipping';

export const initEcommerceModel = sequelize => ({
  EcommerceProduct: EcommerceProduct.init(sequelize),
  EcommerceOrder: EcommerceOrder.init(sequelize),
  EcommerceOrderPayment: EcommerceOrderPayment.init(sequelize),
  EcommerceOrderShipping: EcommerceOrderShipping.init(sequelize)
});
