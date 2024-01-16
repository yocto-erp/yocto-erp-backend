import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;


export default class FormRegister extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        publicId: { type: DataTypes.STRING(64) },
        ip: { type: DataTypes.STRING(100) },
        userAgent: { type: DataTypes.TEXT },
        userId: { type: DataTypes.BIGINT },
        registerData: { type: DataTypes.JSON },
        createdDate: { type: DataTypes.DATE }
      },
      {
        tableName: 'form_register',
        modelName: 'formRegister',
        timestamps: false,
        sequelize, ...opts
      });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'createdById', as: 'createdBy' });
  }
}
