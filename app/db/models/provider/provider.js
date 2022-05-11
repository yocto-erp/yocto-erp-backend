import Sequelize from "sequelize";
import { TAGGING_TYPE } from "../tagging/tagging-item-type";
import { ASSET_ITEM_TYPE } from "../asset/asset-item";

const { DataTypes } = Sequelize;

export const PROVIDER_STATUS = {
  PENDING: 1,
  PROCESSING: 2,
  DONE: 3,
  CANCEL: 4
};

export default class Provider extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        companyId: { type: DataTypes.BIGINT },
        name: { type: DataTypes.STRING },
        remark: { type: DataTypes.TEXT },
        rating: { type: DataTypes.INTEGER },
        subjectId: { type: DataTypes.BIGINT },
        createdDate: { type: DataTypes.DATE },
        createdById: { type: DataTypes.BIGINT },
        lastModifiedDate: { type: DataTypes.DATE },
        lastModifiedById: { type: DataTypes.BIGINT },
        status: { type: DataTypes.INTEGER },
        approvedDate: { type: DataTypes.DATE },
        approvedById: { type: DataTypes.BIGINT },
        contractStartDate: { type: DataTypes.DATE },
        contractEndDate: { type: DataTypes.DATE }
      },
      {
        tableName: "provider",
        modelName: "provider",
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "createdById", as: "createdBy" });
    this.belongsTo(models.User, { foreignKey: "lastModifiedById", as: "lastModifiedBy" });
    this.belongsTo(models.Subject, { foreignKey: "subjectId", as: "subject" });
    this.belongsToMany(models.Asset, {
      through: {
        model: models.AssetItem,
        scope: {
          itemType: ASSET_ITEM_TYPE.PROVIDER
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
          itemType: TAGGING_TYPE.PROVIDER
        }
      },
      foreignKey: "itemId",
      as: "tagging"
    });
    this.belongsToMany(models.Product, {
      through: {
        model: models.ProviderProduct
      },
      foreignKey: "providerId",
      otherKey: "productId",
      as: "products"
    });
  }
}
