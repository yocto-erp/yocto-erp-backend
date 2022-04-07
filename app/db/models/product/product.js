import Sequelize from "sequelize";
import { TAGGING_TYPE } from "../tagging/tagging-item-type";

const { DataTypes } = Sequelize;

export default class Product extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(250) },
        thumbnail: { type: DataTypes.TEXT },
        priceBaseUnit: { type: DataTypes.DECIMAL(16, 2) },
        remark: { type: DataTypes.TEXT },
        companyId: { type: DataTypes.BIGINT },
        createdById: { type: DataTypes.INTEGER },
        productDocumentId: { type: DataTypes.STRING },
        createdDate: { type: DataTypes.DATE },
        lastModifiedDate: { type: DataTypes.DATE },
        lastModifiedById: { type: DataTypes.BIGINT }
      },
      {
        tableName: "product",
        modelName: "product",
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "createdById", as: "createdBy" });
    this.belongsTo(models.User, { foreignKey: "lastModifiedById", as: "lastModifiedBy" });
    this.belongsToMany(models.Asset, {
      through: { model: models.ProductAsset },
      foreignKey: "productId",
      otherKey: "assetId",
      as: "assets"
    });
    this.hasMany(models.ProductUnit, { foreignKey: "productId", as: "units" });
    this.hasMany(models.TaggingItem, {
      foreignKey: "itemId",
      as: "taggingItems"
    });
    this.belongsToMany(models.Tagging, {
      through: {
        model: models.TaggingItem,
        scope: {
          itemType: TAGGING_TYPE.PRODUCT
        }
      },
      foreignKey: "itemId",
      otherKey: "taggingId",
      as: "tagging"
    });
    this.hasMany(models.ProductAsset, { foreignKey: "productId", as: "productAssets" });
  }
}
