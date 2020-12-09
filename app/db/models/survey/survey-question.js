import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const SURVEY_QUESTION_TYPE = {
  RADIO: 1,
  CHECKBOX: 2,
  SELECT_SINGLE: 3,
  SELECT_MULTIPLE: 4,
  INPUT: 5
}

export default class SurveyQuestion extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        surveyId: {type: DataTypes.BIGINT},
        content: {type: DataTypes.TEXT},
        type: {type: DataTypes.TINYINT},
        rightAnswer: {type: DataTypes.STRING(512)},
        introduction: {type: DataTypes.TEXT},
        priority: {type: DataTypes.INTEGER},
        data: {type: DataTypes.TEXT},
        allowFilter: {type: DataTypes.BOOLEAN}
      },
      {
        tableName: 'survey_question',
        modelName: 'surveyQuestion',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.hasMany(models.SurveyQuestionAnswer, {
      foreignKey: 'questionId',
      as: 'questionAnswers'
    });
  }
}
