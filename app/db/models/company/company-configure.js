import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const VALUE_TYPE = Object.freeze({
  NUMBER: 1,
  STRING: 2,
  JSON: 3
})

export default class CompanyConfigure extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        companyId: {type: DataTypes.BIGINT, primaryKey: true},
        key: {type: DataTypes.STRING(64), primaryKey: true},
        value: {type: DataTypes.TEXT},
        type: {type: DataTypes.INTEGER}
      },
      {
        tableName: 'company_configure',
        modelName: 'companyConfigure',
        timestamps: false,
        sequelize, ...opts
      })
  }
}
