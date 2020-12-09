import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class CostPurpose extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        costId: {type: DataTypes.BIGINT, primaryKey: true},
        purposeId: {type: DataTypes.INTEGER, primaryKey: true},
        relativeId: {type: DataTypes.BIGINT}

      },
      {
        tableName: 'cost_purpose',
        modelName: 'costPurpose',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate (models) {
    this.belongsTo(models.Cost,{
      foreignKey: 'costId',
      as: 'costPurpose'
    })
  }
}
