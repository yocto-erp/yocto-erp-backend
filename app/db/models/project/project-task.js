import Sequelize from "sequelize";
import { ASSET_ITEM_TYPE } from "../asset/asset-item";

const { DataTypes } = Sequelize;

export default class ProjectTask extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        projectId: { type: DataTypes.BIGINT, primaryKey: true },
        name: { type: DataTypes.STRING(250) },
        remark: { type: DataTypes.TEXT },
        startDate: { type: DataTypes.DATE },
        finishDate: { type: DataTypes.DATE },
        createdById: { type: DataTypes.INTEGER },
        createdDate: { type: DataTypes.DATE },
        lastModifiedDate: { type: DataTypes.DATE },
        lastModifiedById: { type: DataTypes.BIGINT }
      },
      {
        tableName: "project_task",
        modelName: "projectTask",
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
  }
}
