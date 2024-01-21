import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class FormRegisterPayment extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        formRegisterId: { type: DataTypes.INTEGER, primaryKey: true },
        paymentRequestId: { type: DataTypes.INTEGER, primaryKey: true }
      },
      {
        tableName: 'form_register_payment',
        modelName: 'formRegisterPayment',
        timestamps: false,
        sequelize, ...opts
      });
  }
}
