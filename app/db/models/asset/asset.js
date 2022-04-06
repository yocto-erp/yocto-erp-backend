import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export const ASSET_TYPE = {
  FILE: 1,
  FOLDER: 2
};

export const ASSET_SYNC_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  SUCCESS: 2,
  FAIL: 3
};

export default class Asset extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(250) },
        size: { type: DataTypes.INTEGER },
        mimeType: { type: DataTypes.STRING(50) },
        type: { type: DataTypes.TINYINT },
        parentId: { type: DataTypes.BIGINT },
        fileId: { type: DataTypes.STRING(64) },
        companyId: { type: DataTypes.BIGINT },
        createdById: { type: DataTypes.BIGINT },
        createdDate: { type: DataTypes.DATE },
        source: {
          type: DataTypes.VIRTUAL,
          get() {
            return "server";
          }
        },
        syncStatus: {
          type: DataTypes.TINYINT
        },
        lastSynced: {
          type: DataTypes.DATE
        },
        lastModifiedDate: {
          type: DataTypes.DATE
        },
        ipfsId: {
          type: DataTypes.BIGINT
        },
        systemStatus: {
          type: DataTypes.TINYINT
        }
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
    this.belongsTo(models.AssetIpfs, {
      as: "ipfs",
      foreignKey: "ipfsId"
    });
    this.belongsToMany(models.Product, {
      through: models.ProductAsset,
      foreignKey: "assetId",
      otherKey: "productId",
      as: "products"
    });
  }
}
