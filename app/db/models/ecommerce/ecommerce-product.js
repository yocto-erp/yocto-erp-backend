import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class EcommerceProduct extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        productId: { type: DataTypes.INTEGER },
        unitId: { type: DataTypes.INTEGER },
        companyId: { type: DataTypes.BIGINT },
        webDisplayName: { type: DataTypes.STRING(250) },
        shortName: { type: DataTypes.STRING(64) },
        price: { type: DataTypes.DECIMAL(12, 2) },
        description: { type: DataTypes.TEXT },
        otherParams: { type: DataTypes.JSON },
        isWarehouse: { type: DataTypes.BOOLEAN },
        fromWarehouseId: { type: DataTypes.BIGINT },
        lastUpdatedById: { type: DataTypes.BIGINT },
        lastUpdatedDate: { type: DataTypes.DATE }
      },
      {
        tableName: 'ecommerce_product',
        modelName: 'ecommerceProduct',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'lastUpdatedById',
      as: 'lastUpdatedBy'
    });
    this.belongsTo(models.WareHouse, {
      foreignKey: 'fromWarehouseId',
      as: 'warehouse'
    });
    this.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
    this.belongsTo(models.ProductUnit, {
      foreignKey: 'unitId',
      as: 'unit'
    });
  }
}
