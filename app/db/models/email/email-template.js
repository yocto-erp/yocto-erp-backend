import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class EmailTemplate extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        subject: {type: DataTypes.TEXT},
        templateId: {type: DataTypes.BIGINT, primaryKey: true},
        from: {type: DataTypes.STRING(250)},
        cc: {type: DataTypes.TEXT},
        bcc: {type: DataTypes.TEXT}
      },
      {
        tableName: 'email_template',
        modelName: 'emailTemplate',
        timestamps: false, ...opts,
        sequelize
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Template, {
      foreignKey: 'templateId',
      as: 'template'
    })
  }
}
