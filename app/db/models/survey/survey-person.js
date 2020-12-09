import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class SurveyPerson extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        surveyId: {type: DataTypes.BIGINT},
        companyId: {type: DataTypes.BIGINT},
        personId: {type: DataTypes.BIGINT},
        IP: {type: DataTypes.STRING(64)},
        clientAgent: {type: DataTypes.TEXT},
        clientId: {type: DataTypes.STRING(64)},
        submittedDate: {type: DataTypes.DATE},
        ipfsId: {type: DataTypes.TEXT},
        blockchainId: {type: DataTypes.STRING(250)},
        lastUpdatedDate: {type: DataTypes.DATE},
        languageId: {type: DataTypes.INTEGER},
        ageRange: {type: DataTypes.STRING(10)}
      },
      {
        tableName: 'survey_person',
        modelName: 'surveyPerson',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.Person);
    this.belongsTo(models.Survey);
    this.hasMany(models.SurveyPersonAnswer, {
      foreignKey: 'surveyPersonId',
      as: 'surveyPersonAnswers'
    });
  }
}
