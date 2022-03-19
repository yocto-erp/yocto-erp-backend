import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const PAYMENT_TYPE = {
  CASH: 1,
  BANK: 2
};

export default class PaymentType extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.INTEGER, primaryKey: true},
        name: {type: DataTypes.STRING(250)}
      },
      {
        tableName: 'payment_type',
        modelName: 'paymentType',
        timestamps: false,
        sequelize, ...opts
      });
  }
}
