import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class InventoryDetailSerial extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        inventoryId: {type: DataTypes.BIGINT, primaryKey: true},
        inventoryDetailId: {type: DataTypes.INTEGER, primaryKey: true},
        serialCode: {type: DataTypes.STRING(64), primaryKey: true},
        quantity: {type: DataTypes.INTEGER}
      },
      {
        tableName: 'inventory_detail_serial',
        modelName: 'inventoryDetailSerial',
        timestamps: false,
        sequelize, ...opts
      })
  }
}
