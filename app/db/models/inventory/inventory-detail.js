import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class InventoryDetail extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        inventoryId: {type: DataTypes.BIGINT, primaryKey: true},
        inventoryDetailId: {type: DataTypes.INTEGER, primaryKey: true},
        productId: {type: DataTypes.INTEGER},
        quantity: {type: DataTypes.DECIMAL(14, 2)},
        remark: {type: DataTypes.TEXT},
        unitId: {type: DataTypes.INTEGER},
        serialCode: {type: DataTypes.STRING(64)}
      },
      {
        tableName: 'inventory_detail',
        modelName: 'inventoryDetail',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.Product, {foreignKey: 'productId', as: 'product'});
    this.belongsTo(models.ProductUnit, {foreignKey: 'unitId', as: 'unit'});
  }
}
