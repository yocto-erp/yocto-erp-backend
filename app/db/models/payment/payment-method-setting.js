import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class PaymentMethodSetting extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        companyId: {type: DataTypes.BIGINT},
        name: {type: DataTypes.STRING(100)},
        paymentTypeId: {type: DataTypes.INTEGER},
        setting: {type: DataTypes.TEXT}
      },
      {
        tableName: 'payment_method_setting',
        modelName: 'paymentMethodSetting',
        timestamps: false,
        sequelize, ...opts
      });
  }
}
