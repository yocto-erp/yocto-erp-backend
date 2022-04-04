import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const DEBT_PURPOSE_TYPE = {
  SALE: 1,
  PURCHASE: 2,
  STUDENT_FEE: 3,
  OTHER: 100
}

export default class DebtDetail extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        debtId: {type: DataTypes.BIGINT, primaryKey: true},
        relateId: {type: DataTypes.BIGINT, primaryKey: true},
        purposeType: {type: DataTypes.INTEGER, primaryKey: true},
        remark: {type: DataTypes.TEXT}
      },
      {
        tableName: 'debt_detail',
        modelName: 'debtDetail',
        timestamps: false,
        sequelize, ...opts
      });
  }
}
