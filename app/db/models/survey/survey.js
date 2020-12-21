import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const SURVEY_TYPE = {
  PUBLIC: 1,
  EMAIL_VERIFY: 2,
  SMS_VERIFY: 3
}

export default class Survey extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        companyId: {type: DataTypes.BIGINT},
        name: {type: DataTypes.STRING(250)},
        remark: {type: DataTypes.TEXT},
        createdById: {type: DataTypes.BIGINT},
        createdDate: {type: DataTypes.DATE},
        lastModifiedDate: {type: DataTypes.DATE},
        lastModifiedById: {type: DataTypes.BIGINT},
        totalAnswer: {type: DataTypes.INTEGER},
        lastAnsweredDate: {type: DataTypes.DATE},
        type: {type: DataTypes.INTEGER},
        formDetail: {type: DataTypes.TEXT}
      },
      {
        tableName: 'survey',
        modelName: 'survey',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.hasMany(models.SurveyQuestion, {
      foreignKey: 'surveyId',
      as: 'questions'
    });
    this.hasMany(models.SurveyI18N, {
      foreignKey: 'surveyId',
      as: 'surveyI18Ns'
    });
  }
}
