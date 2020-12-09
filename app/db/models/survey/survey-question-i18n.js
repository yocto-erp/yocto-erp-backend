import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class SurveyQuestionI18N extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        surveyQuestionId: {type: DataTypes.BIGINT, primaryKey: true},
        languageId: {type: DataTypes.INTEGER, primaryKey: true},
        content: {type: DataTypes.TEXT}
      },
      {
        tableName: 'survey_question_i18n',
        modelName: 'surveyQuestionI18N',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.SurveyQuestion, {
      foreignKey: 'surveyQuestionId',
      as: 'surveyQuestion'
    });
    this.hasMany(models.SurveyQuestionAnswerI18N, {
      foreignKey: 'surveyQuestionId',
      sourceKey: 'surveyQuestionId',
      as: 'questionAnswersI18N'
    });
  }
}
