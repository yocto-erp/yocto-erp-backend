import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export default class Shop extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(250) },
        address: { type: DataTypes.STRING(250) },
        phone: { type: DataTypes.STRING(20) },
        companyId: { type: DataTypes.BIGINT },
        createdDate: { type: DataTypes.DATE },
        createdById: { type: DataTypes.BIGINT },
        lastModifiedDate: { type: DataTypes.DATE },
        lastModifiedById: { type: DataTypes.BIGINT },
        totalUser: { type: DataTypes.INTEGER }
      },
      {
        tableName: "shop",
        modelName: "shop",
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "createdById", as: "createdBy" });
    this.belongsToMany(models.User, {
      through: models.UserShop,
      foreignKey: "shopId",
      otherKey: "userId",
      as: "users"
    });
    this.belongsTo(models.Company, { foreignKey: "companyId", as: "company" });
  }
}
