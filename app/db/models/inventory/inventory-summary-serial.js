import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class InventorySummarySerial extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        inventorySummaryId: {type: DataTypes.BIGINT, primaryKey: true},
        serialCode: {type: DataTypes.STRING(64), primaryKey: true},
        quantity: {type: DataTypes.INTEGER}
      },
      {
        tableName: 'inventory_summary_serial',
        modelName: 'inventorySummarySerial',
        timestamps: false,
        sequelize, ...opts
      })
  }
}
