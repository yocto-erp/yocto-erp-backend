import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export default class EcommerceOrderDetail extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        ecommerceOrderId: { type: DataTypes.BIGINT, primaryKey: true },
        detailId: { type: DataTypes.INTEGER, primaryKey: true },
        ecommerceProductId: { type: DataTypes.BIGINT }
      },
      {
        tableName: "ecommerce_order_detail",
        modelName: "ecommerceOrderDetail",
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.EcommerceOrder, {
      foreignKey: "ecommerceOrderId",
      as: "ecommerceOrder"
    });
    this.hasOne(models.OrderDetail, {
      foreignKey: "orderId",
      sourceKey: "ecommerceOrderId",
      as: "detail"
    });
    this.hasOne(models.EcommerceOrderShipping, {
      foreignKey: "ecommerceOrderId",
      sourceKey: "orderId",
      as: "shipping"
    });
  }
}
