import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class SurveyI18N extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        surveyId: {type: DataTypes.BIGINT, primaryKey: true},
        languageId: {type: DataTypes.INTEGER, primaryKey: true},
        name: {type: DataTypes.STRING(250)},
        remark: {type: DataTypes.TEXT}
      },
      {
        tableName: 'survey_i18n',
        modelName: 'surveyI18N',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.Survey, {
      foreignKey: 'surveyId',
      as: 'survey'
    });
    this.belongsTo(models.Language, {
      foreignKey: 'languageId',
      as: 'language'
    });
  }
}
