import EcommerceProduct from './ecommerce-product';
import EcommerceOrder from './ecommerce-order';
import EcommerceOrderPayment from './ecommerce-order-payment';
import EcommerceOrderShipping from './ecommerce-order-shipping';
import EcommercePaymentMethod from './ecommerce-payment-method';
import EcommercePaymentMethodSetting from './ecommerce-payment-method-setting';

export const initEcommerceModel = sequelize => ({
  EcommerceProduct: EcommerceProduct.init(sequelize),
  EcommerceOrder: EcommerceOrder.init(sequelize),
  EcommerceOrderPayment: EcommerceOrderPayment.init(sequelize),
  EcommerceOrderShipping: EcommerceOrderShipping.init(sequelize),
  EcommercePaymentMethod: EcommercePaymentMethod.init(sequelize),
  EcommercePaymentMethodSetting: EcommercePaymentMethodSetting.init(sequelize)
});
