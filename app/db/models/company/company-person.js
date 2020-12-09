import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class CompanyPerson extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        companyId: {type: DataTypes.BIGINT, primaryKey: true},
        personId: {type: DataTypes.BIGINT, primaryKey: true}
      },
      {
        tableName: 'company_person',
        modelName: 'companyPerson',
        timestamps: false,
        sequelize, ...opts
      })
  }
}
