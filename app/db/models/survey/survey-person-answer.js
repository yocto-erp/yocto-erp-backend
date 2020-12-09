import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class SurveyPersonAnswer extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        surveyPersonId: {type: DataTypes.BIGINT},
        questionId: {type: DataTypes.BIGINT},
        answer: {type: DataTypes.TEXT}
      },
      {
        tableName: 'survey_person_answer',
        modelName: 'surveyPersonAnswer',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.SurveyQuestion, {foreignKey: 'questionId', as: 'question'});
    this.belongsTo(models.SurveyPerson, {foreignKey: 'surveyPersonId'});
  }
}
