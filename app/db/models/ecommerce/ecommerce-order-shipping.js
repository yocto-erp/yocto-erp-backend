/**
 * Reference: https://www.selecthub.com/inventory-management/best-shipping-software/
 */
import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export default class EcommerceOrderShipping extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        ecommerceOrderId: { type: DataTypes.BIGINT, primaryKey: true },
        shippingTypeId: { type: DataTypes.INTEGER },
        status: { type: DataTypes.TINYINT() },
        shippedDate: { type: DataTypes.DATE },
        receivedDate: { type: DataTypes.DATE },
        lastUpdatedById: { type: DataTypes.BIGINT },
        lastUpdatedDate: { type: DataTypes.DATE },
        remark: { type: DataTypes.TEXT },
        address: { type: DataTypes.STRING(250) },
        postcode: { type: DataTypes.STRING(64) },
        country: { type: DataTypes.STRING(150) },
        city: { type: DataTypes.STRING(150) },
        lng: { type: DataTypes.FLOAT(10, 6) },
        lat: { type: DataTypes.FLOAT(10, 6) }
      },
      {
        tableName: "ecommerce_order_shipping",
        modelName: "ecommerceOrderShipping",
        timestamps: false,
        sequelize, ...opts
      });
  }
}
