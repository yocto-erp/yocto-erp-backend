import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export const ASSET_ITEM_TYPE = {
  COST: 1,
  PRODUCT: 2
};

export default class AssetItem extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        assetId: { type: DataTypes.BIGINT, primaryKey: true },
        itemId: { type: DataTypes.STRING(250) },
        assetItemType: { type: DataTypes.INTEGER },
        priority: { type: DataTypes.INTEGER }
      },
      {
        tableName: "asset",
        modelName: "asset",
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
