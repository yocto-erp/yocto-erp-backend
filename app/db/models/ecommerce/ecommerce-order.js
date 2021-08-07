import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class EcommerceOrder extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        orderId: { type: DataTypes.BIGINT, primaryKey: true },
        customerOrderId: { type: DataTypes.STRING(64) },
        customerId: { type: DataTypes.BIGINT },
        remark: { type: DataTypes.TEXT },
        userAgent: { type: DataTypes.TEXT },
        confirmCode: { type: DataTypes.STRING(10) },
        confirmedDate: { type: DataTypes.DATE },
        isConfirmed: { type: DataTypes.BOOLEAN }
      },
      {
        tableName: 'ecommerce_order',
        modelName: 'ecommerceOrder',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    });
    this.hasOne(models.EcommerceOrderPayment, {
      foreignKey: 'ecommerceOrderId',
      sourceKey: 'orderId',
      as: 'payment'
    });
    this.hasOne(models.EcommerceOrderShipping, {
      foreignKey: 'ecommerceOrderId',
      sourceKey: 'orderId',
      as: 'shipping'
    });
  }
}
