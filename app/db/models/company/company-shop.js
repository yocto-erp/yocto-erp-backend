import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class CompanyShop extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        companyId: {type: DataTypes.BIGINT, primaryKey: true},
        shopId: {type: DataTypes.BIGINT, primaryKey: true}
      },
      {
        tableName: 'company_shop',
        modelName: 'companyShop',
        timestamps: false,
        sequelize, ...opts
      })
  }
}
