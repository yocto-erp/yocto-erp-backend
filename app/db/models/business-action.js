import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const BUSINESS_ACTION = {
  PURCHASE_ORDER: 1,
  SALE_ORDER: 2,
  WAREHOUSE_GOOD_RECEIPT: 3,
  WAREHOUSE_GOOD_ISSUE: 4,
  RECEIPT_VOUCHER: 5,
  PAYMENT_VOUCHER: 6
}

export default class BusinessAction extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(150)}
      },
      {
        tableName: 'business_action',
        modelName: 'businessAction',
        timestamps: false,
        sequelize, ...opts
      })
  }
}
