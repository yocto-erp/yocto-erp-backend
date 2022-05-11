import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export const TAGGING_TYPE = {
  PURCHASE_ORDER: 1,
  SALE_ORDER: 2,
  INVENTORY_GOOD_RECEIPT: 3,
  INVENTORY_GOOD_ISSUE: 4,
  RECEIPT_VOUCHER: 5,
  PAYMENT_VOUCHER: 6,
  PERSON: 7,
  COMPANY: 8,
  PRODUCT: 9,
  SUBJECT: 10, // Can be customer, provider, ....
  ECOMMERCE_PRODUCT: 11,
  DEBT: 12,
  PROVIDER: 13,
  OTHER: 100
};

export default class TaggingItemType extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        name: { type: DataTypes.STRING(150) }
      },
      {
        tableName: "tagging_item_type",
        modelName: "taggingItemType",
        timestamps: false,
        sequelize, ...opts
      });
  }
}
