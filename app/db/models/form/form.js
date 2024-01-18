import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export const FORM_STATUS = {
  ACTIVE: 1,
  DISABLE: 2
};

export default class Form extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        companyId: { type: DataTypes.BIGINT },
        name: { type: DataTypes.STRING(250) },
        description: { type: DataTypes.TEXT },
        createdDate: { type: DataTypes.DATE },
        createdById: { type: DataTypes.BIGINT },
        status: { type: DataTypes.TINYINT },
        setting: { type: DataTypes.JSON },
        publicId: { type: DataTypes.STRING(64) },
        lastRegister: { type: DataTypes.DATE },
        lastModifiedDate: { type: DataTypes.DATE }
      },
      {
        tableName: 'form',
        modelName: 'form',
        timestamps: false,
        sequelize, ...opts
      });
  }


  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'createdById', as: 'createdBy' });
  }

}
