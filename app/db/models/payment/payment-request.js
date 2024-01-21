import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export const PaymentRequestStatus = {
  PENDING: 1,
  CONFIRMED: 2,
  REJECTED: 3
};

export const PaymentRequestSource = {
  PUBLIC_REGISTER: 1,
  OTHER: 1000
};

export default class PaymentRequest extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        companyId: { type: DataTypes.BIGINT },
        publicId: { type: DataTypes.STRING(64) },
        name: { type: DataTypes.STRING(250) },
        remark: { type: DataTypes.TEXT },
        createdById: { type: DataTypes.BIGINT },
        createdDate: { type: DataTypes.DATE },
        status: { type: DataTypes.TINYINT },
        lastConfirmedDate: { type: DataTypes.DATE },
        ip: { type: DataTypes.STRING(100) },
        userAgent: { type: DataTypes.TEXT },
        totalAmount: { type: DataTypes.DECIMAL(14, 2) },
        paymentMethodId: { type: DataTypes.INTEGER },
        source: { type: DataTypes.INTEGER }
      },
      {
        tableName: 'payment_request',
        modelName: 'paymentRequest',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.PaymentMethodSetting, { foreignKey: 'paymentMethodId', as: 'paymentMethod' });
  }
}
