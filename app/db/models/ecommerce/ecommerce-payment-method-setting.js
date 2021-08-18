import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class EcommercePaymentMethodSetting extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        companyId: { type: DataTypes.BIGINT, primaryKey: true },
        name: { type: DataTypes.STRING(100) },
        paymentMethodId: { type: DataTypes.INTEGER },
        setting: { type: DataTypes.TEXT }
      },
      {
        tableName: 'ecommerce_payment_method_setting',
        modelName: 'ecommercePaymentMethodSetting',
        timestamps: false,
        sequelize, ...opts
      });
  }
}
