import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class DebtDetail extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        debtId: { type: DataTypes.BIGINT, primaryKey: true },
        relateId: { type: DataTypes.BIGINT, primaryKey: true },
        purposeType: { type: DataTypes.INTEGER, primaryKey: true },
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
