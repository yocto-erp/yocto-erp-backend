import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export const ASSET_ITEM_TYPE = {
  COST: 1,
  PRODUCT: 2,
  ECOMMERCE_PRODUCT: 3,
  PROVIDER: 4
};

export default class AssetItem extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        assetId: { type: DataTypes.BIGINT, primaryKey: true },
        itemId: { type: DataTypes.BIGINT, primaryKey: true },
        assetItemType: { type: DataTypes.INTEGER, primaryKey: true },
        priority: { type: DataTypes.INTEGER }
      },
      {
        tableName: "asset_item",
        modelName: "asset_item",
        timestamps: false,
        sequelize,
        ...opts
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Asset, {
      as: "asset",
      foreignKey: "assetId"
    });
  }
}
