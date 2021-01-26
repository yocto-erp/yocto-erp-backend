import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class Tagging extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        label: {type: DataTypes.STRING(10)},
        color: {type: DataTypes.STRING(128)},
        companyId: {type: DataTypes.BIGINT},
        total: {type: DataTypes.INTEGER},
        createdById: {type: DataTypes.BIGINT},
        lastUpdatedDate: {type: DataTypes.DATE}
      },
      {
        tableName: 'tagging',
        modelName: 'tagging',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'createdById', as: 'createdBy'});
  }
}
