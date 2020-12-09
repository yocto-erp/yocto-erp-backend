import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class TemplateTypePlugin extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        templateTypeId: {type: DataTypes.INTEGER, primaryKey: true},
        templatePluginId: {type: DataTypes.INTEGER, primaryKey: true}
      },
      {
        tableName: 'template_type_plugin',
        modelName: 'templateTypePlugin',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.TemplatePluginVariables, {
      foreignKey: 'templatePluginId',
      as: 'variables'
    });
  }
}
