import Sequelize from "sequelize";
import { SYSTEM_STATUS } from "../constants";

const { DataTypes } = Sequelize;

export default class CostAsset extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        assetId: { type: DataTypes.BIGINT, primaryKey: true },
        costId: { type: DataTypes.BIGINT, primaryKey: true }
      },
      {
        tableName: "cost_asset",
        modelName: "costAsset",
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.Asset, {
      foreignKey: "assetId", as: "asset", scope: {
        systemStatus: SYSTEM_STATUS.NORMAL
      }
    });
  }
}
