import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class TemplatePluginVariables extends Sequelize.Model{
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(100)},
        variables: {type: DataTypes.TEXT}
      },
      {
        tableName: 'template_plugin_variables',
        modelName: 'templatePluginVariables',
        timestamps: false,
        sequelize, ...opts
      })
  }
}
