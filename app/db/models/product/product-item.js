import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export default class ProductItem extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        productId: { type: DataTypes.BIGINT, primaryKey: true },
        itemType: { type: DataTypes.INTEGER, primaryKey: true },
        itemId: { type: DataTypes.BIGINT, primaryKey: true }
      },
      {
        tableName: "product_item",
        modelName: "productItem",
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
  }
}
