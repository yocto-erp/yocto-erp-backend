import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class CostAsset extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        assetId: {type: DataTypes.BIGINT, primaryKey: true},
        costId: {type: DataTypes.BIGINT, primaryKey: true}
      },
      {
        tableName: 'cost_asset',
        modelName: 'costAsset',
        timestamps: false,
        sequelize, ...opts
      })
  }
}
