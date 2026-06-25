import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class CompanySchoolUpdate extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        region: {type: DataTypes.STRING(250)},
        joinedDate: {type: DataTypes.DATE},
        fullNameOwner: {type: DataTypes.STRING(250)},
        fullNameManage: {type: DataTypes.STRING(250)},
        level: {type: DataTypes.TEXT},
        typeOrganization: {type: DataTypes.STRING(250)},
        legalStructure: {type: DataTypes.TEXT},
        studentSize: {type: DataTypes.INTEGER},
        numberWorker: {type: DataTypes.TEXT},
        organizationalStructure: {type: DataTypes.TEXT},
        infoClass: {type: DataTypes.TEXT},
        methodTeacher: {type: DataTypes.TEXT},
        methodSchool: {type: DataTypes.TEXT},
        descriptionLastYear: {type: DataTypes.TEXT},
        demandThisYear: {type: DataTypes.TEXT},
        suggestion: {type: DataTypes.TEXT},
        lastUpdated: {type: DataTypes.DATE},
        companyId: {type: DataTypes.BIGINT},
        extraData: {type: DataTypes.TEXT},
      },
      {
        tableName: 'company_school_update',
        modelName: 'companySchoolUpdate',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.Company, {foreignKey: 'companyId', as: 'company'});
  }
}
