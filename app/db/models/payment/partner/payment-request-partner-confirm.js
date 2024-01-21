import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class PaymentRequestPartnerConfirm extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        paymentRequestId: { type: DataTypes.INTEGER },
        confirmedData: { type: DataTypes.JSON },
        confirmedDate: { type: DataTypes.JSON },
        confirmFromIP: { type: DataTypes.STRING(100) }
      },
      {
        tableName: 'payment_request_partner_confirm',
        modelName: 'paymentRequestPartnerConfirm',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.PaymentRequestPartner, { foreignKey: 'paymentRequestParnterId', as: 'paymentRequestPartner' });
  }
}
