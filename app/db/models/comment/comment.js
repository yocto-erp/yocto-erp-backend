import Sequelize from "sequelize";
import { ASSET_ITEM_TYPE } from "../asset/asset-item";

const { DataTypes } = Sequelize;

export const COMMENT_PURPOSE = {
  PROVIDER: 1
};

export default class Comment extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        companyId: { type: DataTypes.BIGINT },
        message: { type: DataTypes.TEXT },
        createdDate: { type: DataTypes.DATE },
        createdById: { type: DataTypes.BIGINT },
        relativeType: { type: DataTypes.INTEGER },
        relativeId: { type: DataTypes.BIGINT }
      },
      {
        tableName: "comment",
        modelName: "comment",
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "createdById",
      as: "createdBy"
    });
    this.belongsToMany(models.Asset, {
      through: {
        model: models.AssetItem,
        scope: {
          assetItemType: ASSET_ITEM_TYPE.COMMENT
        }
      },
      foreignKey: "itemId",
      otherKey: "assetId",
      as: "assets"
    });
  }
}
