import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class UserCompany extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        userId: {type: DataTypes.BIGINT, primaryKey: true},
        companyId: {type: DataTypes.BIGINT, primaryKey: true}
      },
      {
        tableName: 'user_company',
        modelName: 'userCompany',
        timestamps: false,
        sequelize, ...opts
      })
  }
}
