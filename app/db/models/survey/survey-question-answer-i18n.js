import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class SurveyQuestionAnswerI18N extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        surveyQuestionAnswerId: {type: DataTypes.INTEGER, primaryKey: true},
        surveyQuestionId: {type: DataTypes.BIGINT, primaryKey: true},
        languageId: {type: DataTypes.INTEGER, primaryKey: true},
        content: {type: DataTypes.TEXT}
      },
      {
        tableName: 'survey_question_answer_i18n',
        modelName: 'surveyQuestionAnswerI18N',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.hasMany(models.SurveyQuestionAnswer, {
      foreignKey: 'id',
      sourceKey: 'surveyQuestionAnswerId',
      as: 'surveyQuestionAnswer'
    });
  }
}
