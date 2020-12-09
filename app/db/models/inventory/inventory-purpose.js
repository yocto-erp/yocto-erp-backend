import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class InventoryPurpose extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        inventoryId: {type: DataTypes.BIGINT, primaryKey: true},
        purposeId: {type: DataTypes.INTEGER, primaryKey: true},
        relativeId: {type: DataTypes.BIGINT}
      },
      {
        tableName: 'inventory_purpose',
        modelName: 'inventoryPurpose',
        timestamps: false,
        sequelize, ...opts
      })
  }
}
