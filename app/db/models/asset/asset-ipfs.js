import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export default class AssetIpfs extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        carId: { type: DataTypes.STRING(256) },
        lastModifiedDate: { type: DataTypes.DATE },
        totalPinned: { type: DataTypes.INTEGER },
        totalDeal: { type: DataTypes.INTEGER },
        lastUpdatedStatus: { type: DataTypes.DATE }
      },
      {
        tableName: "asset_ipfs",
        modelName: "asset_ipfs",
        timestamps: false,
        sequelize, ...opts
      });
  }
}
