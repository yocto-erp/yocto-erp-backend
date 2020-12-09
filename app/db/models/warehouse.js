import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class WareHouse extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(250)},
        address: {type: DataTypes.TEXT},
        companyId: {type: DataTypes.BIGINT},
        createdById: {type: DataTypes.INTEGER},
        createdDate: {type: DataTypes.DATE},
        lastModifiedDate: {type: DataTypes.DATE},
        lastModifiedById: {type: DataTypes.BIGINT}
      },
      {
        tableName: 'warehouse',
        modelName: 'warehouse',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'createdById', as: 'createdBy'});
    this.belongsTo(models.User, {foreignKey: 'lastModifiedById', as: 'lastModifiedBy'});
  }
}
