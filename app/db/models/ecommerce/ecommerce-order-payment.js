/**
 * This table using for automatic payment online
 */
import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export default class EcommerceOrderPayment extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        ecommerceOrderId: { type: DataTypes.BIGINT, primaryKey: true },
        status: { type: DataTypes.TINYINT({ length: 4 }) },
        userSubmittedDate: { type: DataTypes.DATE },
        userRemark: { type: DataTypes.TEXT },
        partnerTransactionId: { type: DataTypes.STRING(64) },
        paymentMethodId: { type: DataTypes.BIGINT },
        remark: { type: DataTypes.TEXT },
        setPaidById: { type: DataTypes.INTEGER },
        setPaidDate: { type: DataTypes.DATE }
      },
      {
        tableName: "ecommerce_order_payment",
        modelName: "ecommerceOrderPayment",
        timestamps: false,
        sequelize, ...opts
      });
  }
}
