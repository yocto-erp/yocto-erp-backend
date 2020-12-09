import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export const TEMPLATE_TYPE = {
  NORMAL: 1,
  EMAIL: 2
}

export default class Template extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        companyId: {type: DataTypes.BIGINT},
        templateTypeId: {type: DataTypes.INTEGER},
        type: {type: DataTypes.INTEGER},
        name: {type: DataTypes.STRING(100)},
        content: {type: DataTypes.TEXT},
        remark: {type: DataTypes.TEXT},
        createdById: {type: DataTypes.BIGINT},
        createdDate: {type: DataTypes.DATE},
        lastUpdatedDate: {type: DataTypes.DATE}
      },
      {
        tableName: 'template',
        modelName: 'template',
        timestamps: false,
        sequelize, ...opts
      })
  }

  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'createdById', as: 'createdBy'});
    this.belongsTo(models.TemplateType, {foreignKey: 'templateTypeId', as: 'templateType'});
  }
}
