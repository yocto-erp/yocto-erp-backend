import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class OrderDetail extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        orderId: {type: DataTypes.BIGINT, primaryKey: true},
        orderDetailId: {type: DataTypes.INTEGER, primaryKey: true},
        productId: {type: DataTypes.BIGINT},
        productUnitId: {type: DataTypes.INTEGER},
        quantity: {type: DataTypes.INTEGER},
        price: {type: DataTypes.DECIMAL(14,2)},
        remark: {type: DataTypes.TEXT}
      },
      {
        tableName: 'order_detail',
        modelName: 'orderDetail',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate (models) {
    this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    this.belongsTo(models.ProductUnit, { foreignKey: 'productUnitId',  as: 'unit' });
  }
}
