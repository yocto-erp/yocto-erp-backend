import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class EcommerceProduct extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        productId: {type: DataTypes.BIGINT},
        unitId: {type: DataTypes.INTEGER},
        companyId: {type: DataTypes.BIGINT},
        webDisplayName: {type: DataTypes.STRING(250)},
        shortName: {type: DataTypes.STRING(64)},
        price: {type: DataTypes.DECIMAL(12, 2)},
        remark: {type: DataTypes.TEXT},
        otherParams: {type: DataTypes.JSON},
        lastModifiedById: {type: DataTypes.BIGINT},
        lastModifiedDate: {type: DataTypes.DATE},
        taxSetId: {type: DataTypes.BIGINT}
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
      foreignKey: 'lastModifiedById',
      as: 'lastModifiedBy'
    });
    this.belongsToMany(models.Tax, {
      through: models.TaxSetDetail,
      foreignKey: 'taxSetId',
      otherKey: 'taxId',
      as: 'taxes'
    });
    this.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
    this.belongsTo(models.TaxSet, {
      foreignKey: 'taxSetId',
      as: 'taxSet'
    });
    this.belongsTo(models.ProductUnit, {
      foreignKey: 'unitId',
      as: 'unit'
    });
  }
}
