import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class UserShop extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        userId: {type: DataTypes.BIGINT, primaryKey: true},
        shopId: {type: DataTypes.BIGINT, primaryKey: true}
      },
      {
        tableName: 'user_shop',
        modelName: 'userShop',
        timestamps: false,
        sequelize, ...opts
      })
  }
}
