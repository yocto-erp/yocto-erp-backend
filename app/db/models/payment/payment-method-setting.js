import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export const PAYMENT_METHOD_TYPE = {
  CASH: 1,
  BANK: 2,
  PAYOS: 3
};

export default class PaymentMethodSetting extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        companyId: { type: DataTypes.BIGINT },
        name: { type: DataTypes.STRING(100) },
        paymentTypeId: { type: DataTypes.INTEGER },
        setting: { type: DataTypes.JSON },
        createdById: { type: DataTypes.BIGINT },
        createdDate: { type: DataTypes.DATE },
        lastModifiedDate: { type: DataTypes.DATE },
        lastModifiedById: { type: DataTypes.BIGINT }
      },
      {
        tableName: 'payment_method_setting',
        modelName: 'paymentMethodSetting',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'createdById', as: 'createdBy' });
  }
}
