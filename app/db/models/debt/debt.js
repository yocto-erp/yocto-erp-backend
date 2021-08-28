import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class Debt extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        personId: { type: DataTypes.BIGINT },
        relateCompanyId: { type: DataTypes.BIGINT },
        companyId: { type: DataTypes.BIGINT },
        amount: { type: DataTypes.DECIMAL(12, 2) },
        lastUpdated: { type: DataTypes.DATE },
        lastUpdatedById: { type: DataTypes.BIGINT },
        createdDate: { type: DataTypes.DATE },
        createdById: { type: DataTypes.BIGINT },
        type: { type: DataTypes.INTEGER },
        remark: { type: DataTypes.TEXT }
      },
      {
        tableName: 'debt',
        modelName: 'debt',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.Person, {
      foreignKey: 'personId',
      as: 'person'
    });
  }
}
