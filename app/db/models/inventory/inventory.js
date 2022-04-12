import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export const INVENTORY_TYPE = {
  OUT: 1,
  IN: 2
  // Goods Issue = OUT
  // Goods Receipt = IN
};

export const INVENTORY_PURPOSE = {
  SALE: 1,
  PURCHASE: 2
};

export default class Inventory extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(250) },
        warehouseId: { type: DataTypes.BIGINT },
        type: { type: DataTypes.TINYINT },
        processedDate: { type: DataTypes.DATE },
        companyId: { type: DataTypes.BIGINT },
        totalProduct: { type: DataTypes.INTEGER },
        remark: { type: DataTypes.TEXT },
        createdDate: { type: DataTypes.DATE },
        createdById: { type: DataTypes.BIGINT },
        lastModifiedDate: { type: DataTypes.DATE },
        lastModifiedById: { type: DataTypes.BIGINT }
      },
      {
        tableName: "inventory",
        modelName: "inventory",
        timestamps: false,
        sequelize, ...opts
      });
  }


  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "createdById", as: "createdBy" });
    this.belongsTo(models.User, { foreignKey: "lastModifiedById", as: "lastModifiedBy" });
    this.hasMany(models.InventoryDetail, {
      foreignKey: "inventoryId",
      as: "details"
    });
    this.belongsTo(models.WareHouse, { foreignKey: "warehouseId", as: "warehouse" });
    this.hasMany(models.TaggingItem, {
      foreignKey: "itemId",
      as: "taggingItems"
    });
  }

}
