import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export default class ProviderProduct extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        providerId: { type: DataTypes.BIGINT, primaryKey: true },
        productId: { type: DataTypes.BIGINT, primaryKey: true }
      },
      {
        tableName: "provider",
        modelName: "providerProduct",
        timestamps: false,
        sequelize, ...opts
      });
  }
}
