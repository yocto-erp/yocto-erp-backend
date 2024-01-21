import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class PaymentRequestPartner extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        createdDate: { type: DataTypes.DATE },
        requestData: { type: DataTypes.JSON },
        response: { type: DataTypes.JSON },
        confirmData: { type: DataTypes.JSON },
        confirmedDate: { type: DataTypes.JSON },
        confirmFromIP: { type: DataTypes.STRING(100) },
        paymentRequestId: { type: DataTypes.INTEGER },
        partnerId: { type: DataTypes.STRING(64) }
      },
      {
        tableName: 'payment_request_partner',
        modelName: 'paymentRequestPartner',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.PaymentRequest, { foreignKey: 'paymentRequestId', as: 'paymentRequest' });
  }
}
