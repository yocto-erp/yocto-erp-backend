import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const DEBT_TYPE = {
  RECEIVABLES: 1, // Khách hàng nợ
  TO_PAY_DEBT: 2, // Công ty nợ
  RECOVERY_PUBLIC_DEBT: 3, // Thu nợ khách hàng
  PAID_DEBT: 4 // Công ty trả nợ
}

export default class Debt extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        subjectId: {type: DataTypes.BIGINT},
        companyId: {type: DataTypes.BIGINT},
        amount: {type: DataTypes.DECIMAL(12, 2)},
        createdDate: {type: DataTypes.DATE},
        createdById: {type: DataTypes.BIGINT},
        type: {type: DataTypes.INTEGER},
        remark: {type: DataTypes.TEXT},
        settleDebtId: {type: DataTypes.BIGINT}
      },
      {
        tableName: 'debt',
        modelName: 'debt',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.Subject, {
      foreignKey: 'subjectId',
      as: 'subject'
    });
    this.hasMany(models.DebtDetail, {
      foreignKey: 'debtId',
      as: 'details'
    })
  }
}
