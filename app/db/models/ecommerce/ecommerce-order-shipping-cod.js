import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class DebtDetail extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        shipping: { type: DataTypes.BIGINT, primaryKey: true },
        shippingMethod: { type: DataTypes.INTEGER, primaryKey: true }
      },
      {
        tableName: 'ecommerce_order_shipping_cod',
        modelName: 'ecommerceOrderShippingCod',
        timestamps: false,
        sequelize, ...opts
      });
  }
}
