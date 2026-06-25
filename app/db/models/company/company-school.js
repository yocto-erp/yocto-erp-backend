import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default class CompanySchool extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        companyId: { type: DataTypes.INTEGER, primaryKey: true, notNull: true },
        schoolId: { type: DataTypes.INTEGER, notNull: true }
      },
      {
        tableName: 'company_school',
        modelName: 'companySchool',
        timestamps: false,
        sequelize, ...opts
      });
  }
}
