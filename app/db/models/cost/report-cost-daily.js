import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class ReportCostDaily extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        reportDate: {type: DataTypes.DATE, primaryKey: true},
        companyId: {type: DataTypes.BIGINT, primaryKey: true},
        receipt: {type: DataTypes.DECIMAL(18, 2)},
        payment: {type: DataTypes.DECIMAL(18, 2)},
        lastUpdated: {type: DataTypes.DATE}
      },
      {
        tableName: 'report_cost_daily',
        modelName: 'reportCostDaily',
        timestamps: false,
        sequelize, ...opts
      })
  }
}
