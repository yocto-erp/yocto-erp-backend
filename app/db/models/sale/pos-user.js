import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class PosUser extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        posId: {type: DataTypes.BIGINT, primaryKey: true},
        userId: {type: DataTypes.BIGINT, primaryKey: true}
      },
      {
        tableName: 'pos_user',
        modelName: 'posUser',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.POS, {
      foreignKey: 'posId',
      as: 'pos'
    });
    this.belongsTo(models.User, {foreignKey: 'userId', as: 'user'});
  }
}
