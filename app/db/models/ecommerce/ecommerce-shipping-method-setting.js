import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class EcommerceShippingMethodSetting extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        companyId: { type: DataTypes.BIGINT, primaryKey: true },
        name: { type: DataTypes.STRING(100) },
        typeId: { type: DataTypes.INTEGER },
        fee: { type: DataTypes.DECIMAL(10,2)},
        feeType: { type: DataTypes.TINYINT},
        lastUpdatedById: { type: DataTypes.BIGINT},
        lastUpdatedDate: { type: DataTypes.DATE}
      },
      {
        tableName: 'ecommerce_payment_method_setting',
        modelName: 'ecommercePaymentMethodSetting',
        timestamps: false,
        sequelize, ...opts
      });
  }
}
