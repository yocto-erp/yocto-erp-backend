import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export default class DebtSubjectBalance extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        subjectId: { type: DataTypes.BIGINT, primaryKey: true },
        companyId: { type: DataTypes.BIGINT },
        credit: { type: DataTypes.DECIMAL(12, 2) },
        debit: { type: DataTypes.DECIMAL(12, 2) },
        lastModifiedDate: { type: DataTypes.DATE }
      },
      {
        tableName: "debt_subject_balance",
        modelName: "debtSubjectBalance",
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.Subject, {
      foreignKey: "subjectId",
      as: "subject"
    });
  }
}
