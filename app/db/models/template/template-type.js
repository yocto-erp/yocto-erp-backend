import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class TemplateType extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING(100)}
      },
      {
        tableName: 'template_type',
        modelName: 'templateType',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsToMany(models.TemplatePluginVariables, {
      through: models.TemplateTypePlugin, foreignKey: 'templateTypeId',
      otherKey: 'templatePluginId'
    });
  }
}
