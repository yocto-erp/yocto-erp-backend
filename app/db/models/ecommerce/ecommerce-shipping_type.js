import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class EcommerceShoppingType extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(250) }
      },
      {
        tableName: 'ecommerce_shopping_type',
        modelName: 'ecommerceShoppingType',
        timestamps: false,
        sequelize, ...opts
      });
  }
}
