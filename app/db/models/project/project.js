import Sequelize from "sequelize";
import { TAGGING_TYPE } from "../tagging/tagging-item-type";
import { ASSET_ITEM_TYPE } from "../asset/asset-item";

const { DataTypes } = Sequelize;

export default class Project extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        companyId: { type: DataTypes.BIGINT },
        name: { type: DataTypes.STRING(250) },
        remark: { type: DataTypes.TEXT },
        subjectId: { type: DataTypes.BIGINT },
        status: { type: DataTypes.TINYINT },
        startDate: { type: DataTypes.DATE },
        finishDate: { type: DataTypes.DATE },
        progress: { type: DataTypes.DECIMAL(6, 2) },
        createdById: { type: DataTypes.INTEGER },
        createdDate: { type: DataTypes.DATE },
        lastModifiedDate: { type: DataTypes.DATE },
        lastModifiedById: { type: DataTypes.BIGINT }
      },
      {
        tableName: "project",
        modelName: "project",
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "createdById", as: "createdBy" });
    this.belongsTo(models.User, { foreignKey: "lastModifiedById", as: "lastModifiedBy" });
    this.belongsToMany(models.Asset, {
      through: {
        model: models.AssetItem,
        scope: {
          assetItemType: ASSET_ITEM_TYPE.PROJECT
        }
      },
      foreignKey: "itemId",
      otherKey: "assetId",
      as: "assets"
    });
    this.belongsToMany(models.Tagging, {
      through: {
        model: models.TaggingItem,
        scope: {
          itemType: TAGGING_TYPE.PROJECT
        }
      },
      foreignKey: "itemId",
      otherKey: "taggingId",
      as: "tagging"
    });
    this.belongsTo(models.Subject, { foreignKey: "subjectId", as: "provider" });
    this.hasMany(models.AssetItem, {
      foreignKey: "itemId",
      as: "assetItems",
      scope: { assetItemType: ASSET_ITEM_TYPE.PROJECT }
    });
  }
}
