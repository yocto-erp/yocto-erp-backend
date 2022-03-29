import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class OrderDetailTax extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        orderId: {type: DataTypes.BIGINT, primaryKey: true},
        orderDetailId: {type: DataTypes.INTEGER, primaryKey: true},
        taxId: {type: DataTypes.BIGINT},
        amount: {type: DataTypes.DECIMAL(14, 2)}
      },
      {
        tableName: 'order_detail_tax',
        modelName: 'orderDetailTax',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.Order, {foreignKey: 'orderId', as: 'order'});
  }
}
