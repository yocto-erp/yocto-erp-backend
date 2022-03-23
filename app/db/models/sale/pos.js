import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class POS extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        companyId: {type: DataTypes.BIGINT},
        name: {type: DataTypes.STRING(250)},
        remark: {type: DataTypes.TEXT},
        shopId: {type: DataTypes.BIGINT},
        warehouseId: {type: DataTypes.BIGINT},
        lastModifiedById: {type: DataTypes.BIGINT},
        lastModifiedDate: {type: DataTypes.DATE},
        totalUser: {type: DataTypes.INTEGER}
      },
      {
        tableName: 'pos',
        modelName: 'pos',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.Shop, {
      foreignKey: 'shopId',
      as: 'shop'
    });
    this.belongsTo(models.User, {foreignKey: 'lastModifiedById', as: 'lastModifiedBy'});
    this.belongsTo(models.WareHouse, {
      foreignKey: 'warehouseId',
      as: 'warehouse'
    });
  }
}
