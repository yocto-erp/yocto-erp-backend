import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

/**
 * This COST_PURPOSE define never change it value, only add new
 */
export const COST_PURPOSE = {
  ORDER: 1,
  DEBT: 2,
  SALE: 3,
  STUDENT_FEE: 4,
  REGISTER_FORM: 5
};

export default class CostPurpose extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        costId: { type: DataTypes.BIGINT, primaryKey: true },
        purposeId: { type: DataTypes.INTEGER },
        relativeId: { type: DataTypes.BIGINT }
      },
      {
        tableName: 'cost_purpose',
        modelName: 'costPurpose',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.Cost, {
      foreignKey: 'costId',
      as: 'costPurpose'
    });
  }
}
