import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class SurveyQuestionAnswer extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.INTEGER, primaryKey: true},
        questionId: {type: DataTypes.BIGINT, primaryKey: true},
        content: {type: DataTypes.TEXT},
        key: {type: DataTypes.STRING(64)}
      },
      {
        tableName: 'survey_question_answer',
        modelName: 'surveyQuestionAnswer',
        timestamps: false,
        sequelize, ...opts
      })
  }
}
