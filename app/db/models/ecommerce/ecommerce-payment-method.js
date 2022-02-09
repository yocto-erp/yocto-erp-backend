import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export const ECOMMERCE_PAYMENT_METHOD = {
  CASH: 1,
  BANK: 2
};

export default class EcommercePaymentMethod extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(250) }
      },
      {
        tableName: 'ecommerce_payment_method',
        modelName: 'ecommercePaymentMethod',
        timestamps: false,
        sequelize, ...opts
      });
  }
}
